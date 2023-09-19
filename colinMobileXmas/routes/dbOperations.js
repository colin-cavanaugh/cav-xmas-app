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
    if (!user) {
      throw new Error(`User with ID: ${userId} not found.`)
    }
    return user.friendsList || [] // assuming the user object has a property "friendsList" which is an array of friend user IDs.
  } catch (error) {
    console.error(`Failed to fetch friends for user ID: ${userId}.`, error)
    return []
  }
}

module.exports = {
  markUserOnline,
  markUserOffline,
  fetchFriendsFromDB,
}
