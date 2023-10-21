const { ObjectId } = require('mongodb')

async function markUserOnline(client, userId) {
  console.log(`Attempting to mark user with ID: ${userId} as online.`) // Log before trying
  try {
    const db = client.db('cavanaughDB')
    const userCollection = db.collection('users')
    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) }, // Convert string to ObjectId
      { $set: { isOnline: true } }
    )
    console.log(
      `Updated ${
        result.modifiedCount
      } user(s) to online status for ID: ${userId} Result${JSON.stringify(
        result
      )}`
    ) // Log the result
    return result
  } catch (error) {
    console.error(
      `Error marking user with ID: ${userId} as online. Error:`,
      error
    )
    throw error
  }
}
async function markUserOffline(client, userId) {
  console.log(
    `[dbOperations.js][1] Attempting to mark user with ID: ${userId} as offline.`
  ) // Log before trying
  try {
    const db = client.db('cavanaughDB')
    const userCollection = db.collection('users')
    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isOnline: false } }
    )
    console.log(
      `[dbOperations.js][2][Updated ${
        result.modifiedCount
      } user(s) to offline status for ID: ${userId} Result${JSON.stringify(
        result
      )}]`
    ) // Log the result
    return result
  } catch (error) {
    console.error(
      `Error marking user with ID: ${userId} as offline. Error:`,
      error
    )
    throw error
  }
}
async function fetchFriendsFromDB(client, userId) {
  try {
    const db = client.db('cavanaughDB')
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })

    // Debug: Log the user object retrieved from the database
    console.log('Debug: User object from DB:', user)

    if (!user) {
      throw new Error(`User with ID: ${userId} not found.`)
    }

    // Debug: Log the friends list specifically
    console.log('Debug: User friends list:', user.friends)

    return user.friends || []
  } catch (error) {
    console.error(`Failed to fetch friends for user ID: ${userId}.`, error)
    return []
  }
}
async function getUserById(client, userId) {
  try {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid userId format')
    }

    const user = await client
      .db('cavanaughDB')
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })

    if (!user) {
      throw new Error('User not found')
    }

    return {
      username: user.username,
      photoUrl: user.photoUrl,
      sentRequests: user.sentRequests,
      friendRequests: user.friendRequests,
      isOnline: user.isOnline,
      friends: user.friends,
    }
  } catch (error) {
    console.error('Error encountered:', error)
    throw error
  }
}
module.exports = {
  markUserOnline,
  markUserOffline,
  fetchFriendsFromDB,
  getUserById,
}
