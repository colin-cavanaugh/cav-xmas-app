const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const http = require('http')
const socketIo = require('socket.io')
const uri = process.env.CONNECTIONSTRING
const client = new MongoClient(uri)
const app = express()
const server = http.createServer(app)
const io = socketIo(server)
const port = 8000
// const { sendResponse, authenticateJWT } = require('./routes/utils')

// Middleware configurations
app.use(express.json())
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://192.168.0.31:19000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)
app.use((req, res, next) => {
  req.io = io
  next()
})
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

client
  .connect()
  .then(() => {
    console.log('Connected to MongoDB')

    // Routes
    app.get('/', (req, res) => {
      res.send('Hello, Express is running!')
    })

    const socketController = require('./socketController')
    socketController.init(server, client)

    const userRoutes = require('./routes/userRoutes')(client)
    const friendsRoutes = require('./routes/friendsRoutes')(client)
    const authRoutes = require('./routes/authRoutes')(client, io)

    // Use routes
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

    server.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  })
