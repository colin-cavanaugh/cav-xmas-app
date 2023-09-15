// export const getChatId = (userId1, userId2) => {
//   return [userId1, userId2].sort().join('-')
// }
// export const getChatId = (userId1, userId2) => {
//   // Ensure the chat ID is always in the same order, regardless of input order
//   return userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`
// }
export const getChatId = (userId, friendId) => {
  const sortedIds = [userId, friendId].sort()
  return `${sortedIds[0]}-${sortedIds[1]}`
}
