const express = require('express')
const bcrypt = require('bcrypt')
const { MongoClient, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { io, onlineUsers } = require('../SocketController')

// Adjust the path as necessary

dotenv.config()
const port = 8000
const ACCESS_SECRET = process.env.ACCESS_SECRET

module.exports = function (client, io) {
  const router = express.Router()
  const { authenticateJWT } = require('./utils')
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
          .project({ username: 1, photoUrl: 1, isOnline: 1 })
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
      // Fetch user and friend details
      const user = await client
        .db('cavanaughDB')
        .collection('users')
        .findOne({ _id: new ObjectId(userId) })
      const friend = await client
        .db('cavanaughDB')
        .collection('users')
        .findOne({ _id: new ObjectId(friendId) })

      // Remove the friend request
      await client
        .db('cavanaughDB')
        .collection('users')
        .updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { friendRequests: new ObjectId(friendId) } }
        )

      // Prepare the friend objects to be inserted
      const userFriendObject = {
        id: friend._id.toString(),
        username: friend.username,
        isOnline: friend.isOnline || false,
        photoUrl: user.photoUrl,
        // ...other attributes
      }

      const friendFriendObject = {
        id: user._id.toString(),
        username: user.username,
        isOnline: user.isOnline || false,
        photoUrl: user.photoUrl,
        // ...other attributes
      }

      // Add each user to the other's friends list
      await client
        .db('cavanaughDB')
        .collection('users')
        .updateOne(
          { _id: new ObjectId(userId) },
          { $push: { friends: userFriendObject } }
        )

      await client
        .db('cavanaughDB')
        .collection('users')
        .updateOne(
          { _id: new ObjectId(friendId) },
          { $push: { friends: friendFriendObject } }
        )
      // After adding each user to the other's friend list

      // Emit socket event if the user is online
      if (onlineUsers[userId]) {
        req.io
          .to(onlineUsers[userId])
          .emit('friend-request-accepted', friendFriendObject)
      }

      // Emit socket event if the friend is online
      if (onlineUsers[friendId]) {
        req.io
          .to(onlineUsers[friendId])
          .emit('friend-request-accepted', userFriendObject)
      }

      res.status(200).send('Friend request accepted')
    } catch (error) {
      console.error('Detailed Error:', error)
      res.status(500).send('An error occurred')
    }
  })

  return router
}
