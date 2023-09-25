const { markUserOnline, markUserOffline } = require('./routes/dbOperations')
let io

const onlineUsers = {}

const updateOnlineStatus = async (userId, isOnline, client, socket) => {
  try {
    const markStatusFunc = isOnline ? markUserOnline : markUserOffline
    const result = await markStatusFunc(client, userId)

    if (result.modifiedCount === 1) {
      if (isOnline) {
        onlineUsers[userId] = socket.id
      } else {
        delete onlineUsers[userId]
      }

      const emitEvent = isOnline ? 'user-online' : 'user-offline'
      socket.broadcast.emit(emitEvent, userId)
    }
  } catch (error) {
    console.error(
      `Failed to mark user as ${isOnline ? 'online' : 'offline'}:`,
      error
    )
  }
}

function init(httpServer, client) {
  console.log('Initializing socket.io')
  io = require('socket.io')(httpServer)

  io.on('connection', socket => {
    console.log('New user connected:', socket.id)

    socket.on('go-online', async userId => {
      console.log('User is online:', userId)
      await updateOnlineStatus(userId, true, client)
    })

    socket.on('go-offline', async userId => {
      console.log('User is offline:', userId)
      await updateOnlineStatus(userId, false, client)
    })

    socket.on('disconnect', reason => {
      console.log('User disconnected:', socket.id, 'Reason:', reason)
    })

    socket.on('get-online-friends', async (userId, callback) => {
      try {
        const onlineFriends = await getOnlineFriendsForUser(userId)
        callback(null, onlineFriends)
      } catch (error) {
        callback(error)
      }
    })
  })
}

async function getOnlineFriendsForUser(userId) {
  // Fetch friends from the database or use a pre-loaded list.
  const friends = await getFriendsForUser(userId)
  return friends.filter(friendId => onlineUsers[friendId])
}

// Mock function; replace with a real database call.
async function getFriendsForUser(userId) {
  return ['friendId1', 'friendId2', 'friendId3']
}

module.exports = { init, onlineUsers }
