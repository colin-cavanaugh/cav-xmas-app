const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
const app = express()
const port = 8000
const uri = process.env.CONNECTIONSTRING
const client = new MongoClient(uri)

const authRoutes = require('./routes/authRoutes')(client)
const userRoutes = require('./routes/userRoutes')(client)
const friendsRoutes = require('./routes/friendsRoutes')(client)

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
  // ... other code
  next()
})
app.use(authRoutes)
app.use(userRoutes)
app.use(friendsRoutes)

// Connect to the database once when starting the server
client
  .connect()
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err)
    process.exit(1)
  })

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Hello, Express is running!')
})

// Start Server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
