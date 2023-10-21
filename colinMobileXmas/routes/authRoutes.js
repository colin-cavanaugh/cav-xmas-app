const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongodb')

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

module.exports = function (client, io) {
  const router = express.Router()
  const { sendResponse } = require('./utils')

  router.post('/api/register', async (req, res) => {
    console.log('POST api/register endpoint called')
    const { username, password } = req.body

    const existingUser = await client
      .db('cavanaughDB')
      .collection('users')
      .findOne({ username })

    if (existingUser) {
      return sendResponse(res, 'error', null, 'Username is already taken')
    }

    // Hash the password after checking for existing user
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      // Initialize the friends, sentRequests, and friendRequests arrays
      const newUser = {
        username,
        password: hashedPassword,
        friends: [],
        sentRequests: [],
        friendRequests: [],
        isOnline: false,
        photoUrl: '', // or some default photo URL
      }

      await client.db('cavanaughDB').collection('users').insertOne(newUser)

      const dataToSend = { key: username }
      sendResponse(res, 'success', dataToSend, 'Registration Successful.')
    } catch (error) {
      sendResponse(
        res,
        'error',
        null,
        `Error processing data: ${error.message}`
      )
    }
  })

  router.post('/api/login', async (req, res) => {
    console.log('POST api/login endpoint called')
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
        const token = jwt.sign({ userId: user._id.toString() }, ACCESS_SECRET, {
          expiresIn: '1h',
        })
        console.log('Generated Token:', token)

        const refreshToken = jwt.sign(
          { userId: user._id.toString() },
          REFRESH_SECRET,
          {
            expiresIn: '7d',
          }
        )

        await client
          .db('cavanaughDB')
          .collection('refreshTokens')
          .insertOne({ token: refreshToken })

        return sendResponse(
          res,
          'success',
          { accessToken: token, refreshToken },
          'Login Successful'
        )
      } else {
        return sendResponse(res, 'error', null, 'Invalid password')
      }
    } catch (error) {
      sendResponse(
        res,
        'error',
        null,
        `Error processing data: ${error.message}`
      )
    }
  })

  router.post('/api/logout', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) return sendResponse(res, 'error', null, 'No token provided')

    jwt.verify(token, ACCESS_SECRET, async (err, user) => {
      if (err) {
        console.error('Token verification failed:', err)
        return sendResponse(res, 'error', null, 'Token verification failed')
      }

      // Remove refresh token (optional but recommended for security)
      await client
        .db('cavanaughDB')
        .collection('refreshTokens')
        .deleteOne({ token: req.body.refreshToken })

      sendResponse(res, 'success', null, 'Logged out successfully')
    })
  })

  router.post('/api/token', async (req, res) => {
    console.log('/api/token endpoint called with refreshToken:', req.body.token)
    const refreshToken = req.body.token

    if (!refreshToken) {
      return sendResponse(res, 'error', null, 'No token provided', 400) // 400 Bad Request
    }

    const existingToken = await client
      .db('cavanaughDB')
      .collection('refreshTokens')
      .findOne({ token: refreshToken })

    if (!existingToken) {
      console.error('Refresh token not found in database:', refreshToken)
      return sendResponse(res, 'error', null, 'Invalid refresh token', 401) // 401 Unauthorized
    }

    jwt.verify(refreshToken, REFRESH_SECRET, async (err, user) => {
      if (err)
        return sendResponse(res, 'error', null, 'Token verification failed')

      // Not updating online status in the database,
      // handling online/offline through sockets.

      const accessToken = jwt.sign({ userId: user.userId }, ACCESS_SECRET, {
        expiresIn: '1h',
      })
      console.log('Access Token in Token API', accessToken)
      return sendResponse(res, 'success', { accessToken }, 'Token refreshed')
    })
  })
  return router
}
