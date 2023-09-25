const express = require('express')
const { ObjectId } = require('mongodb')
// Adjust path accordingly
module.exports = function (client) {
  const router = express.Router()
  const { sendResponse, authenticateJWT } = require('./utils')
  ///////////////// Search Users Endpoint //////////////////////
  router.get('/api/user/search', authenticateJWT, async (req, res) => {
    console.log('GET api/user/search endpoint called')
    try {
      const username = req.query.username
      console.log('Received username:', username)
      if (!username) {
        console.log('Missing username. Query parameters:', req.query)
        return res
          .status(400)
          .send({ error: 'Username query parameter is required' })
      }
      const user = await client
        .db('cavanaughDB')
        .collection('users')
        .findOne(
          { username: new RegExp(`^${username}$`, 'i') },
          { projection: { username: 1 } }
        )
      if (!user) {
        return res.status(404).send({ error: 'User not found' })
      }
      res.send([user])
    } catch (error) {
      res.status(500).send({ error: `An error occurred ${error.message}` })
      console.error('Error encountered:', error)
    }
  })
  ///////////////// Upload Photo Endpoint //////////////////////
  router.put('/api/user/:id/photo', async (req, res) => {
    console.log('PUT api/user/:id/photo endpoint called')
    try {
      const userId = req.params.id // "id" because in your route it's defined as `:id`, not `:_id`
      console.log('User Id: ', userId)
      const { photoUrl } = req.body
      console.log('Request body:', req.body)
      console.log('PhotoURL: ', photoUrl)
      if (!photoUrl) {
        return res.status(400).send({ error: 'photoUrl is required.' })
      }
      const result = await client
        .db('cavanaughDB')
        .collection('users')
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { photoUrl: photoUrl } }
        )

      if (result.matchedCount === 0) {
        return res.status(404).send({ error: 'User not found' })
      }
      if (result.matchedCount != 0 && result.modifiedCount === 0) {
        return res
          .status(304)
          .send({ message: 'User found, but no modifications were made.' })
      }

      res.send({
        success: `Successfully uploaded profile photo for ${userId}`,
        photoUrl,
      })
    } catch (error) {
      res.status(500).send({ error: `An error occured ${error.message}` })
      console.error('Error encountered:', error)
    }
  })
  ///////////////// User Id Endpoint //////////////////////
  router.get('/api/user/:id', authenticateJWT, async (req, res) => {
    console.log('GET api/user/:id endpoint called')
    try {
      const userId = req.params.id

      if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res
          .status(400)
          .send({ error: 'Invalid userId format api/user/:id endpoint' })
      }

      const user = await client
        .db('cavanaughDB')
        .collection('users')
        .findOne({ _id: new ObjectId(userId) })

      // console.log('Found user:', user) // Debug log

      if (!user) {
        return res.status(404).send({ error: 'User not found' })
      }
      // console.log('User from user/:id endpoint: ', user)
      res.send({
        username: user.username,
        photoUrl: user.photoUrl,
        sentRequests: user.sentRequests,
        friendRequests: user.friendRequests,
        isOnline: user.isOnline,
        friends: user.friends,
      })
    } catch (error) {
      res.status(500).send({ error: `An error occurred ${error.message}` })
      console.error('Error encountered:', error)
    }
  })
  return router
}
