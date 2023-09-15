const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
const http = require('http')
const socketIo = require('socket.io')
const onlineUsers = {}
const offlineTimers = {}
const uri = process.env.CONNECTIONSTRING
const client = new MongoClient(uri)

const authRoutes = require('./routes/authRoutes')(client)
const userRoutes = require('./routes/userRoutes')(client)
const friendsRoutes = require('./routes/friendsRoutes')(client)

const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const port = 8000

function setOfflineAfterDelay(userId, delay) {
  if (offlineTimers[userId]) {
    clearTimeout(offlineTimers[userId])
  }
  offlineTimers[userId] = setTimeout(() => {
    markUserOffline(userId)
    const socketId = getSocketIdOfUser(userId)
    if (socketId) {
      delete onlineUsers[socketId]
      io.sockets.emit('user-offline', userId) // Notify all clients about the user going offline.
    }
  }, delay)
}
function getSocketIdOfUser(userId) {
  console.log('Getting socket ID for user:', userId)
  for (let [socketId, uid] of Object.entries(onlineUsers)) {
    if (uid === userId) {
      console.log('Found socket ID:', socketId)
      return socketId
    }
  }
  return null
}

// Set up socket listeners
io.on('connection', socket => {
  console.log('New user connected with id(io Connection):', socket.id)
  socket.onAny((event, ...args) => {
    console.log(`Got event: ${event}`, args)
  })

  socket.on('go-online', async userId => {
    console.log(`Received 'go-online' event for user ID: ${userId}`)
    if (offlineTimers[userId]) {
      clearTimeout(offlineTimers[userId])
      delete offlineTimers[userId]
    }
    console.log('User with id:', userId, 'went online.')
    onlineUsers[socket.id] = userId
    console.log('Updated onlineUsers after go-online event:', onlineUsers)

    try {
      const result = await markUserOnline(userId)
      if (result.modifiedCount === 1) {
        socket.broadcast.emit('user-online', userId)
      }
    } catch (error) {
      console.error(`Failed to mark user with ID: ${userId} as online.`, error)
    }
  })

  socket.on('disconnect', () => {
    const userId = onlineUsers[socket.id]
    console.log(
      `Received 'disconnect' event for user ID: ${userId} with socket ID: ${socket.id}`
    )
    if (userId) {
      setOfflineAfterDelay(userId, 5 * 60 * 1000) // Wait for 5 minutes before setting offline
    }
  })
  socket.on('go-offline', async userId => {
    console.log(`Received 'go-offline' event for user ID: ${userId}`)
    if (offlineTimers[userId]) {
      clearTimeout(offlineTimers[userId])
      delete offlineTimers[userId]
    }
    console.log('User with id:', userId, 'went offline.')

    try {
      const result = await markUserOffline(userId)
      if (result.modifiedCount === 1) {
        delete onlineUsers[socket.id]
        socket.broadcast.emit('user-offline', userId)
      }
    } catch (error) {
      console.error(`Failed to mark user with ID: ${userId} as offline.`, error)
    }
  })
  socket.on('new-message', data => {
    const { sender, recipient, content } = data

    // Check if recipient is online
    const recipientSocketId = getSocketIdOfUser(recipient)
    if (!recipientSocketId) {
      console.log(`Recipient with ID: ${recipient} is not online.`)
      // Send a feedback message to the sender, notifying them that
      // the recipient is currently offline.
      socket.emit('feedback', {
        type: 'error',
        message: `Recipient with ID: ${recipient} is not online. Your message was not delivered.`,
      })
      return
    }

    // If recipient is online, forward the message
    console.log('just before receive-message')
    socket.to(recipientSocketId).emit('receive-message', {
      sender,
      content,
      timestamp: new Date(),
    })
    console.log(
      'receive-message socket',
      `Message from ${sender} sent to ${recipient}. Content: ${content}`
    )
  })
  socket.on('error', error => {
    console.error('Socket error:', error)
  })
})

// Setting users online or offline
async function markUserOnline(userId) {
  console.log(`Attempting to mark user with ID: ${userId} as online.`) // Log before trying
  try {
    const db = client.db('cavanaughDB')
    const userCollection = db.collection('users')
    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) }, // Convert string to ObjectId
      { $set: { isOnline: true } }
    )
    console.log(
      `Updated ${result.modifiedCount} user(s) to online status for ID: ${userId}`
    ) // Log the result
    return result
  } catch (error) {
    console.error(
      `Error marking user with ID: ${userId} as online. Error:`,
      error
    )
    throw error
  }
}
async function markUserOffline(userId) {
  console.log(`Attempting to mark user with ID: ${userId} as offline.`) // Log before trying
  try {
    const db = client.db('cavanaughDB')
    const userCollection = db.collection('users')
    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isOnline: false } }
    )
    console.log(
      `Updated ${result.modifiedCount} user(s) to offline status for ID: ${userId}`
    ) // Log the result
    return result
  } catch (error) {
    console.error(
      `Error marking user with ID: ${userId} as offline. Error:`,
      error
    )
    throw error
  }
}
// Go offline status

// Middleware configurations
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://192.168.0.31:19000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.use(express.json())

app.use((req, res, next) => {
  const startTime = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - startTime
    console.log(
      `[${req.method}] ${req.path} - ${res.statusCode} [${duration}ms]`
    )
  })
  next()
})

app.use(authRoutes)
app.use(userRoutes)
app.use(friendsRoutes)
// 404 handler
app.use((req, res, next) => {
  res.status(404).send('Route not found.')
})

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
// Connect to the database
client
  .connect()
  .then(() => {
    console.log('Connected to MongoDB')
    server.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  })

app.get('/', (req, res) => {
  res.send('Hello, Express is running!')
})
