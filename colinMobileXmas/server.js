const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
const http = require('http')
const socketIo = require('socket.io')
const onlineUsers = {}
const uri = process.env.CONNECTIONSTRING
const client = new MongoClient(uri)

const authRoutes = require('./routes/authRoutes')(client)
const userRoutes = require('./routes/userRoutes')(client)
const friendsRoutes = require('./routes/friendsRoutes')(client)

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const port = 8000

// Set up socket listeners
io.on('connection', socket => {
  console.log('New user connected with id:', socket.id)

  socket.on('go-online', userId => {
    console.log('User with id:', userId, 'went online.')
    onlineUsers[socket.id] = userId
    markUserOnline(userId)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected with id:', socket.id)
    const userId = onlineUsers[socket.id]
    if (userId) {
      markUserOffline(userId)
      delete onlineUsers[socket.id]
    }
  })
  socket.on('go-offline', userId => {
    console.log('User with id:', userId, 'went offline.')
    markUserOffline(userId)
    delete onlineUsers[socket.id]
  })
  socket.on('new-message', data => {
    const { sender, recipient, content } = data
    // Forward this message to the recipient through their socket.
    // Assume each user has a unique socket room by their userId.
    socket.to(recipient).emit('receive-message', {
      sender,
      content,
      timestamp: new Date(),
    })
  })
})

// Setting users online or offline
async function markUserOnline(userId) {
  try {
    const db = client.db('cavanaughDB')
    const userCollection = db.collection('users')
    await userCollection.updateOne(
      { _id: new ObjectId(userId) }, // Convert string to ObjectId
      { $set: { isOnline: true } }
    )
    console.log(`User ${userId} marked online`)
  } catch (error) {
    console.error('Error marking user online', error)
  }
}
async function markUserOffline(userId) {
  try {
    const db = client.db('cavanaughDB')
    const userCollection = db.collection('users')
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isOnline: false } }
    )
    console.log(`User ${userId} marked offline`)
  } catch (error) {
    console.error('Error marking user offline', error)
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
  console.log(`[${req.method}] ${req.path}`)
  next()
})

app.use(authRoutes)
app.use(userRoutes)
app.use(friendsRoutes)

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
