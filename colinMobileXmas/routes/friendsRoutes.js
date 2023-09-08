const express = require('express')
const bcrypt = require('bcrypt')
const { MongoClient, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { authenticateJWT } = require('./utils') // Adjust the path as necessary

dotenv.config()
const port = 8000
const SECRET_KEY = process.env.SECRET_KEY

module.exports = function (client) {
  const router = express.Router()
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

  ///////////////// Fetch All Friend Data Endpoint //////////////////////
  router.get(
    '/api/user/:id/allFriendData',
    authenticateJWT,
    async (req, res) => {
      const userId = req.params.id

      try {
        const user = await client
          .db('cavanaughDB')
          .collection('users')
          .findOne(
            { _id: new ObjectId(userId) },
            { projection: { friends: 1, sentRequests: 1, friendRequests: 1 } }
          )

        if (!user) {
          res.status(404).send('User not found')
          return
        }

        const friendsList = user.friends
          ? user.friends.map(friendId => new ObjectId(friendId))
          : []

        const sentRequestsList = user.sentRequests
          ? user.sentRequests.map(requestId => new ObjectId(requestId))
          : []

        const receivedRequestsList = user.friendRequests
          ? user.friendRequests.map(requestId => new ObjectId(requestId))
          : []

        const friends = await client
          .db('cavanaughDB')
          .collection('users')
          .find({ _id: { $in: friendsList } })
          .project({ username: 1 })
          .toArray()

        const sentRequests = await client
          .db('cavanaughDB')
          .collection('users')
          .find({ _id: { $in: sentRequestsList } })
          .project({ username: 1 })
          .toArray()

        const receivedRequests = await client
          .db('cavanaughDB')
          .collection('users')
          .find({ _id: { $in: receivedRequestsList } })
          .project({ username: 1 })
          .toArray()

        res.status(200).json({
          friends,
          sentRequests,
          receivedRequests,
        })
      } catch (error) {
        console.error('Detailed Error:', error)
        res.status(500).send('An error occurred')
      }
    }
  )

  ///////////////// Send Friend Request Endpoint //////////////////////
  router.post(
    '/api/user/:id/sendFriendRequest',
    authenticateJWT,
    async (req, res) => {
      console.log('POST api/user/:id/sendFriendRequest endpoint called')
      console.log('Received userId:', req.params.id) // Debug log
      console.log('Received friendId:', req.body.friendId) // Debug log
      const userId = req.params.id
      const friendId = req.body.friendId // Assume this is passed in the request body
      try {
        await client
          .db('cavanaughDB')
          .collection('users')
          .updateOne(
            { _id: new ObjectId(friendId) },
            { $addToSet: { friendRequests: new ObjectId(userId) } }
          )
        // Update sender's sentRequests
        await client
          .db('cavanaughDB')
          .collection('users')
          .updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { sentRequests: friendId } }
          )
        res.status(200).send('Friend request sent')
      } catch (error) {
        console.error('Detailed Error:', error)
        res.status(500).send('An error occurred')
      }
    }
  )

  ///////////////// Accept Friend Request Endpoint //////////////////////
  router.post('/api/user/:id/acceptFriendRequest', async (req, res) => {
    const userId = req.params.id
    const friendId = req.body.friendId
    try {
      // Remove the friend request
      await client
        .db('cavanaughDB')
        .collection('users')
        .updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { friendRequests: new ObjectId(friendId) } }
        )

      // Add each user to the other's friends list
      await client
        .db('cavanaughDB')
        .collection('users')
        .updateOne(
          { _id: new ObjectId(userId) },
          { $push: { friends: new ObjectId(friendId) } }
        )

      await client
        .db('cavanaughDB')
        .collection('users')
        .updateOne(
          { _id: new ObjectId(friendId) },
          { $push: { friends: new ObjectId(userId) } }
        )

      res.status(200).send('Friend request accepted')
    } catch (error) {
      console.error('Detailed Error:', error)
      res.status(500).send('An error occurred')
    }
  })

  return router
}
// ///////////////// Fetch Sent Friend Requests Endpoint //////////////////////
// router.get(
//   '/api/user/:id/sentFriendRequests',
//   authenticateJWT,
//   async (req, res) => {
//     console.log('GET api/user/:id/sentFriendRequests endpoint called')
//     console.log('Received userId:', req.params.id) // Debug log

//     const userId = req.params.id

//     try {
//       const user = await client
//         .db('cavanaughDB')
//         .collection('users')
//         .findOne(
//           { _id: new ObjectId(userId) },
//           { projection: { sentRequests: 1 } }
//         )

//       if (!user) {
//         return res.status(404).send({ error: 'User not found' })
//       }

//       res.status(200).send(user.sentRequests)
//     } catch (error) {
//       console.error('Detailed Error:', error)
//       res.status(500).send('An error occurred')
//     }
//   }
// )
// ///////////////// Fetch Received Friend Requests Endpoint //////////////////////
// router.get(
//   '/api/user/:id/receivedFriendRequests',
//   authenticateJWT,
//   async (req, res) => {
//     const userId = req.params.id

//     try {
//       const user = await client
//         .db('cavanaughDB')
//         .collection('users')
//         .findOne(
//           { _id: new ObjectId(userId) },
//           { projection: { friendRequests: 1 } } // Fetch friendRequests, not sentRequests
//         )

//       if (!user) {
//         return res.status(404).send({ error: 'User not found' })
//       }

//       res.status(200).send(user.friendRequests) // Send the received friend requests
//     } catch (error) {
//       console.error('Detailed Error:', error)
//       res.status(500).send('An error occurred')
//     }
//   }
// );
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
// // Fetching friends and pending requests
// router.get('/api/user/:id/friendsList', async (req, res) => {
//   const userId = req.params.id

//   try {
//     const user = await client
//       .db('cavanaughDB')
//       .collection('users')
//       .findOne(
//         { _id: new ObjectId(userId) },
//         { projection: { friends: 1, friendRequests: 1 } }
//       )

//     if (!user) {
//       res.status(404).send('User not found')
//       return
//     }
//     if (!user.friends || !user.friendRequests) {
//       // Log or handle this specific case
//       console.log('Friends or friendRequests field is undefined.')
//     }
//     const friendsList = user.friends
//       ? user.friends.map(friendId => new ObjectId(friendId))
//       : []
//     const pendingList = user.friendRequests
//       ? user.friendRequests.map(requestId => new ObjectId(requestId))
//       : []

//     const friends = await client
//       .db('cavanaughDB')
//       .collection('users')
//       .find({ _id: { $in: friendsList } })
//       .project({ username: 1 })
//       .toArray()

//     const pendingRequests = await client
//       .db('cavanaughDB')
//       .collection('users')
//       .find({ _id: { $in: pendingList } })
//       .project({ username: 1 })
//       .toArray()

//     res.status(200).json({
//       friends,
//       pendingRequests,
//     })
//   } catch (error) {
//     console.error('Detailed Error:', error)
//     res.status(500).send('An error occurred')
//   }
// })
