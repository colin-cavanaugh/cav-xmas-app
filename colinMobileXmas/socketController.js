const { getUserById } = require('./routes/dbOperations')
let io

function init(httpServer, client) {
  console.log('Initializing socket.io')
  io = require('socket.io')(httpServer)

  io.on('connection', socket => {
    console.log('Socket object:', socket.id)
    let currentUser
    console.log('New user connected:', socket.id)

    socket.on('go-online', async userId => {
      currentUser = userId

      // Fetch user data
      const user = await getUserById(client, userId)
      const friendIds = user.friends.map(friend => friend.id)

      const onlineUser = {
        userId: currentUser,
        socketId: socket.id,
        timestamp: new Date(),
      }
      const collection = client.db('cavanaughDB').collection('onlineUsers')
      await collection.updateOne(
        { userId: currentUser },
        { $set: onlineUser },
        { upsert: true }
      )

      // Fetch online friends from the DB instead of in-memory object
      const onlineFriendsInDB = await collection
        .find({ userId: { $in: friendIds } })
        .toArray()
      const onlineFriendIds = onlineFriendsInDB.map(user => user.userId)

      console.log('Total Friends of', userId, ':', user.friends)
      console.log('Online Friends of', userId, ':', onlineFriendIds)

      // Emit online friend list to current user
      console.log('Just before online-friend-list: ', onlineFriendIds)
      socket.emit('online-friends-list', onlineFriendIds)

      // Inform all friends that this user is online
      friendIds.forEach(friendId => {
        if (onlineFriendIds.includes(friendId)) {
          const friendOnlineData = onlineFriendsInDB.find(
            user => user.userId === friendId
          )
          if (friendOnlineData && friendOnlineData.socketId) {
            console.log(
              'Just before friend-came-online---friendOnlineData: ',
              friendOnlineData
            )
            io.to(friendOnlineData.socketId).emit('friend-came-online', {
              userId: userId,
              username: user.username,
            })
          }
        }
      })
    })

    socket.on('go-offline', async () => {
      handleOfflineEvent(currentUser, client)
    })

    socket.on('disconnect', async () => {
      handleOfflineEvent(currentUser, client)
    })
  })
}

async function handleOfflineEvent(currentUser, client) {
  if (currentUser) {
    const user = await getUserById(client, currentUser)
    const collection = client.db('cavanaughDB').collection('onlineUsers')
    await collection.deleteOne({ userId: currentUser })
    const friendIds = user.friends.map(friend => friend.id)

    const onlineFriendsInDB = await collection
      .find({ userId: { $in: friendIds } })
      .toArray()
    const onlineFriendIds = onlineFriendsInDB.map(user => user.userId)

    friendIds.forEach(friendId => {
      if (onlineFriendIds.includes(friendId)) {
        const friendOnlineData = onlineFriendsInDB.find(
          user => user.userId === friendId
        )
        if (friendOnlineData && friendOnlineData.socketId) {
          console.log(
            'Just before friend-went-offline---friendOnlineData: ',
            friendOnlineData
          )
          io.to(friendOnlineData.socketId).emit('friend-went-offline', {
            userId: currentUser,
            username: user.username,
          })
        }
      }
    })
  }
}

module.exports = { init }
