const {
  markUserOnline,
  markUserOffline,
  fetchFriendsFromDB,
} = require('./routes/dbOperations')
const onlineUsers = {}
const offlineTimers = {}
let io

function getSocketIdOfUser(userId) {
  console.log('[socketController.js][1][Getting socket ID for user:]', userId)
  for (let [socketId, uid] of Object.entries(onlineUsers)) {
    if (uid === userId) {
      console.log('Found socket ID:', socketId)
      return socketId
    }
  }
  return null
}
function setOfflineAfterDelay(userId, delay) {
  if (offlineTimers[userId]) {
    clearTimeout(offlineTimers[userId])
  }
  offlineTimers[userId] = setTimeout(async () => {
    try {
      const result = await markUserOffline(client, userId)
      if (result.modifiedCount === 1) {
        const socketId = getSocketIdOfUser(userId)
        if (socketId) {
          delete onlineUsers[socketId]
        }
        io.sockets.emit('user-offline', userId) // Notify all clients about the user going offline.
      }
    } catch (error) {
      console.error(`Failed to mark user with ID: ${userId} as offline.`, error)
    }
  }, delay)
}
function init(httpServer, client) {
  console.log('function init triggered')
  io = require('socket.io')(httpServer)

  io.on('connection', socket => {
    console.log(
      '[socketController.js][2][New user connected with id(io Connection)]:',
      socket.id
    )
    socket.onAny((event, ...args) => {
      console.log(`Got event: ${event}`, args)
    })

    socket.on('go-online', async userId => {
      console.log(
        `[socketController.js][3][Received 'go-online' event for user ID:] ${userId}`
      )

      if (offlineTimers[userId]) {
        clearTimeout(offlineTimers[userId])
        delete offlineTimers[userId]
      }

      console.log(
        '[socketController.js][4][User with id:]',
        userId,
        'went online.'
      )

      onlineUsers[socket.id] = userId
      console.log(
        '[socketController.js][5][Updated onlineUsers after go-online event:]',
        onlineUsers
      )

      try {
        const result = await markUserOnline(client, userId)
        if (result.modifiedCount === 1) {
          socket.broadcast.emit('user-online', userId) // This line notifies everyone. Depending on your app's requirements, you might want to adjust this.

          // Start of the block to notify only online friends.
          const friendsList = await fetchFriendsFromDB(client, userId) // Fetch friends from DB. You'll have to implement this function or replace it with your actual function.
          const onlineFriends = friendsList.filter(friendId =>
            Object.values(onlineUsers).includes(friendId)
          )
          onlineFriends.forEach(friendId => {
            const friendSocketId = getSocketIdOfUser(friendId)
            if (friendSocketId) {
              io.to(friendSocketId).emit('friend-online', userId)
            }
          })
          // End of the block to notify only online friends.
        }
      } catch (error) {
        console.error(
          `Failed to mark user with ID: ${userId} as online.`,
          error
        )
      }
    })

    socket.on('disconnect', () => {
      const userId = onlineUsers[socket.id]
      console.log(
        `[socketController.js][6][Received 'disconnect' event for user ID:] ${userId} with socket ID: ${socket.id}`
      )
      if (userId) {
        setOfflineAfterDelay(userId, 5 * 60 * 1000) // Wait for 5 minutes before setting offline
      }
    })
    socket.on('go-offline', async userId => {
      console.log(`Received 'go-offline' event for user ID: ${userId}`)
      if (offlineTimers[userId]) {
        clearTimeout(offlineTimers[userId])
        delete offlineTimers[userId]
      }
      console.log('User with id:', userId, 'went offline.')

      try {
        const result = await markUserOffline(client, userId)
        if (result.modifiedCount === 1) {
          delete onlineUsers[socket.id]
          socket.broadcast.emit('user-offline', userId)
        }
        // Start of the block to notify only online friends.
        const friendsList = await fetchFriendsFromDB(client, userId) // Fetch friends from DB. You'll have to implement this function or replace it with your actual function.
        const onlineFriends = friendsList.filter(friendId =>
          Object.values(onlineUsers).includes(friendId)
        )
        onlineFriends.forEach(friendId => {
          const friendSocketId = getSocketIdOfUser(friendId)
          if (friendSocketId) {
            io.to(friendSocketId).emit('friend-offline', userId)
          }
        })
        // End of the block to notify only online friends.
      } catch (error) {
        console.error(
          `Failed to mark user with ID: ${userId} as offline.`,
          error
        )
      }
    })
    socket.on('send-message', data => {
      console.log(
        '[socketController.js][7][Online Users Object in send-message]',
        onlineUsers
      )
      const { sender, recipient, content } = data

      // Check if recipient is online
      const recipientSocketId = getSocketIdOfUser(recipient)
      if (!recipientSocketId) {
        console.log(`Recipient with ID: ${recipient} is not online.`)
        // Send a feedback message to the sender, notifying them that
        // the recipient is currently offline.
        socket.emit('feedback', {
          type: 'error',
          message: `Recipient with ID: ${recipient} is not online. Your message was not delivered.`,
        })
        return
      }

      // If recipient is online, forward the message
      socket.to(recipientSocketId).emit('receive-message', {
        sender,
        content,
        timestamp: new Date(),
      })
      // Feedback to the sender
      socket.emit('feedback', {
        type: 'success',
        message: `Your message was successfully sent to ${recipient}.`,
      })
      console.log(
        '[socketController.js][8][receive-message socket]',
        `Message from ${sender} sent to ${recipient}. Content: ${content}`
      )
    })
    socket.on('error', error => {
      console.error('Socket error:', error)
    })
    // Handle custom 'client-ping' event
    const TIMEOUT_DURATION = 15000 // 15 seconds
    const clientPings = {}

    socket.on('client-ping', () => {
      console.log('Received custom ping from client', socket.id)

      // Emitting a custom 'client-pong' event
      socket.emit('client-pong')

      if (clientPings[socket.id]) {
        clearTimeout(clientPings[socket.id])
      }

      clientPings[socket.id] = setTimeout(() => {
        console.log(
          `No custom ping received from client ${socket.id} for 15 seconds.`
        )
        // Handle client offline logic here if needed
      }, TIMEOUT_DURATION)
    })
  })
}

function getIo() {
  if (!io) {
    throw new Error('Socket.io not initialized!')
  }
  return io
}

module.exports = { init, getIo, offlineTimers, onlineUsers }
