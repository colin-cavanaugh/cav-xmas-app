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
export const logAllFriends = (user, allFriends) => {
  if (allFriends) {
    allFriends.forEach(friend => {
      console.log(`${user.username}'s Friends:
    Username: ${friend.username},
    isOnline?: ${friend.isOnline}
    `)
    })
  }
}
export const logOnlineFriends = (user, onlineFriends) => {
  if (onlineFriends) {
    onlineFriends.forEach(friend => {
      console.log(`${user.username}'s Online Friends:
      Username: ${friend.username},
      isOnline?: ${friend.isOnline}
      `)
    })
  }
}
