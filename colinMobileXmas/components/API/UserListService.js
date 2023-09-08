// import React, { createContext, useState, useContext, useEffect } from 'react'
// import socket from '../Socket/useSocket'

// // Create the context
// export const UserListContext = createContext()

// // Create a custom hook for easy access to the context
// export const useUserList = () => {
//   return useContext(UserListContext)
// }

// // Provider component
// export const UserListProvider = ({ children }) => {
//   const [userList, setUserList] = useState([])

//   // Inside the UserListProvider component

//   useEffect(() => {
//     // Listen for 'friend-online' event
//     socket.on('friend-online', userId => {
//       // Update the userList to set that user as online
//       const updatedList = userList.map(user =>
//         user._id === userId ? { ...user, isOnline: true } : user
//       )
//       setUserList(updatedList)
//     })

//     // Listen for 'friend-offline' event
//     socket.on('friend-offline', userId => {
//       // Update the userList to set that user as offline
//       const updatedList = userList.map(user =>
//         user._id === userId ? { ...user, isOnline: false } : user
//       )
//       setUserList(updatedList)
//     })

//     // Cleanup listeners on unmount
//     return () => {
//       socket.off('friend-online')
//       socket.off('friend-offline')
//     }
//   }, [userList])

//   return (
//     <UserListContext.Provider value={{ userList, setUserList }}>
//       {children}
//     </UserListContext.Provider>
//   )
// }
