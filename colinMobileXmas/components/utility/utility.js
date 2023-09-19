export const getChatId = (userId, friendId) => {
  const sortedIds = [userId, friendId].sort()
  return `${sortedIds[0]}-${sortedIds[1]}`
}
export const logEvent = (event, location, userId) => {
  const timeStamp = new Date().toISOString()
  console.log(
    `[${timeStamp}] [${location}] Emitting event: ${event} for User ID: ${userId}`
  )
}
