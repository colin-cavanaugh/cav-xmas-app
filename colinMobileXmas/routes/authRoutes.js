const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendResponse } = require('./utils') // Assuming utils.js is one level up

const SECRET_KEY = process.env.SECRET_KEY

module.exports = function (client) {
  const router = express.Router()

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
      await client
        .db('cavanaughDB')
        .collection('users')
        .insertOne({ username, password: hashedPassword })

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
        const token = jwt.sign({ userId: user._id.toString() }, SECRET_KEY, {
          expiresIn: '1h',
        })
        return sendResponse(res, 'success', { token }, 'Login Successful')
      }
      if (!isMatch) {
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

  return router
}
