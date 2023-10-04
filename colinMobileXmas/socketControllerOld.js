// const { getUserById } = require('./routes/dbOperations')
// let io

// const onlineUsers = {}

// function init(httpServer, client) {
//   console.log('Initializing socket.io')
//   io = require('socket.io')(httpServer)

//   io.on('connection', socket => {
//     console.log('Socket object:', socket.id)
//     let currentUser
//     console.log('New user connected:', socket.id)

//     socket.on('go-online', async userId => {
//       currentUser = userId
//       onlineUsers[userId] = socket.id

//       // Fetch user data
//       const user = await getUserById(client, userId)

//       // Get list of friend IDs
//       const friendIds = user.friends.map(friend => friend.id)

//       const onlineUser = {
//         userId: currentUser,
//         socketId: socket.id,
//         timestamp: new Date(),
//       }
//       const collection = client.db('cavanaughDB').collection('onlineUsers')
//       await collection.updateOne(
//         { userId: currentUser },
//         { $set: onlineUser },
//         { upsert: true }
//       )
//       // Filter online friend IDs
//       const onlineFriendIds = friendIds.filter(
//         friendId => onlineUsers[friendId]
//       )

//       console.log('Total Friends of', userId, ':', user.friends)
//       console.log('Online Friends of', userId, ':', onlineFriendIds)

//       // Emit online friend list to current user
//       socket.emit('online-friends-list', onlineFriendIds)

//       // Inform all friends that this user is online
//       // Inform all friends that this user is online
//       friendIds.forEach(friendId => {
//         if (onlineUsers[friendId]) {
//           io.to(onlineUsers[friendId]).emit('friend-came-online', {
//             userId: userId,
//             username: user.username,
//           })
//         }
//       })
//     })

//     socket.on('go-offline', async () => {
//       if (currentUser) {
//         delete onlineUsers[currentUser]
//         const user = await getUserById(client, currentUser)
//         const collection = client.db('cavanaughDB').collection('onlineUsers')
//         await collection.deleteOne({ userId: currentUser })

//         // Get list of friend IDs
//         const friendIds = user.friends.map(friend => friend.id)

//         friendIds.forEach(friendId => {
//           if (onlineUsers[friendId]) {
//             io.to(onlineUsers[friendId]).emit('friend-went-offline', {
//               userId: currentUser,
//               username: user.username,
//             })
//           }
//         })
//       }
//     })

//     socket.on('disconnect', async () => {
//       if (currentUser) {
//         delete onlineUsers[currentUser]
//         const user = await getUserById(client, currentUser)
//         const collection = client.db('cavanaughDB').collection('onlineUsers')
//         await collection.deleteOne({ userId: currentUser })
//         const friendIds = user.friends.map(friend => friend.id)
//         friendIds.forEach(friendId => {
//           if (onlineUsers[friendId]) {
//             io.to(onlineUsers[friendId]).emit('friend-went-offline', {
//               userId: currentUser,
//               username: user.username,
//             })
//           }
//         })
//       }
//     })
//   })
// }

// async function getOnlineFriendsForUser(userId) {
//   const user = await getUserById(client, userId)
//   if (!user || !user.friends) {
//     return []
//   }
//   return user.friends.filter(friendId => onlineUsers[friendId])
// }

// // Mock function; replace with a real database call.
// async function getFriendsForUser(userId) {
//   return ['friendId1', 'friendId2', 'friendId3']
// }

// module.exports = { init, onlineUsers }
