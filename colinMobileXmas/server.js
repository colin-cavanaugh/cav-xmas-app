const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const { MongoClient } = require('mongodb')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY
const app = express()
const port = 8000
const uri = process.env.CONNECTIONSTRING
const client = new MongoClient(uri)

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://192.168.0.31:19000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)
app.use(express.json())
app.options('*', cors()) // <-- This enables pre-flight response for all routes
app.use((req, res, next) => {
  console.log(res.getHeaders())
  console.log(req.headers.origin)
  console.log(`[${req.method}] ${req.path}`)
  console.log('Headers:', req.headers)
  console.log('Body:', req.body)
  next()
})
///////////////// Response Helper Function //////////////////////
const sendResponse = (res, status, data, message) => {
  res.json({
    status,
    data,
    message,
  })
}
///////////////// Middleware Function //////////////////////
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader) {
    const token = authHeader.split(' ')[1]
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.error('Token verification failed:', err)
        return sendResponse(res, 'error', null, 'Token not valid')
      }
      console.log(user)
      req.user = user
      next()
    })
  } else {
    console.error('Authorization header missing')
    return sendResponse(res, 'error', null, 'Authorization header missing')
  }
}

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

app.get('/', (req, res) => {
  res.send('Hello, Express is running!')
})

///////////////// Register API Endpoint //////////////////////
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  //store users in database
  try {
    await client
      .db('cavanaughDB')
      .collection('users')
      .insertOne({ username, password: hashedPassword })
    const dataToSend = { key: username }
    sendResponse(res, 'success', dataToSend, 'Registration Successful.')
  } catch (error) {
    sendResponse(res, 'error', null, `Error processing data: ${error.message}`)
  }
})
///////////////// Login API Endpoint //////////////////////
app.post('/api/login', async (req, res) => {
  console.log('Login route hit')
  const { username, password } = req.body
  try {
    const user = await client
      .db('cavanaughDB')
      .collection('users')
      .findOne({ username })

    if (!user) {
      return sendResponse(res, 'error', null, 'Invalid login credentials')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign({ userId: user._id.toString() }, SECRET_KEY, {
        expiresIn: '1h',
      })
      // const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      //   expiresIn: '5d',
      // })
      return sendResponse(res, 'success', { token }, 'Login Successful')
    }
    if (!isMatch) {
      return sendResponse(res, 'error', null, 'Invalid password')
    }
  } catch (error) {
    sendResponse(res, 'error', null, `Error processing data: ${error.message}`)
  }
})

///////////////// Groups API Endpoint //////////////////////
app.post('/api/groups', async (req, res) => {
  const group = req.body
  console.log('Reached /api/groups endpoint')
  try {
    await client.db('cavanaughDB').collection('group').insertOne(group)
    const dataToSend = { key: 'value' } // Example data
    sendResponse(res, 'success', dataToSend, 'Group created successfully.')
  } catch (error) {
    sendResponse(res, 'error', null, `Error processing data: ${error.message}`)
  }
})
///////////////// Validate Token Endpoint //////////////////////
app.get('/api/validate-token', cors(), authenticateJWT, (req, res) => {
  console.log('Reached /api/validate-token endpoint')
  // If we reach this line, the token is valid (because of the middleware)
  sendResponse(res, 'success', { userId: req.user.userId }, 'Token is valid')
})
///////////////// Refresh Token Endpoint //////////////////////
// app.post('/api/token', (req, res) => {
//   const refreshToken = req.body.token
//   if (refreshToken == null) return res.sendStatus(401)
//   if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

//   jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, user) => {
//     if (err) return res.sendStatus(403)
//     const accessToken = jwt.sign(user, ACCESS_SECRET_KEY, { expiresIn: '20m' })
//     res.json({ accessToken })
//   })
// })

///////////////// Upload Photo Endpoint //////////////////////
app.put('api/user/:id/photo', async (req, res) => {
  try {
    const userId = req.params.id // "id" because in your route it's defined as `:id`, not `:_id`
    const { photoUrl } = req.body

    const result = await client
      .db('cavanaughDB')
      .collection('users')
      .updateOne(
        { _id: new require('mongodb').ObjectID(userId) },
        { $set: { photoUrl: photoUrl } }
      )

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: 'User not found' })
    }

    res.send({ success: true, photoUrl })
  } catch (error) {
    res.status(500).send({ error: 'An error occured uploading photo' })
  }
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
