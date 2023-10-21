// import React, { useEffect, useState, useContext } from 'react'
// import io from 'socket.io-client'
// import { UserContext } from './UserProvider'

// const useSocket = (
//   friendRequestAcceptedCb,
//   onlineFriendsCb,
//   userOnlineCb,
//   userOfflineCb
// ) => {
//   const [socket, setSocket] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const { user, showToast } = useContext(UserContext)
//   const [attempt, setAttempt] = useState(0)

//   useEffect(() => {
//     console.log('Running useEffect in useSocket')
//     if (user && user.userId && !socket) {
//       const newSocket = io('http://192.168.0.12:8000')
//       setSocket(newSocket)

//       newSocket.on('connect', () => {
//         setLoading(false)
//         setAttempt(0)
//         console.log('Successfully connected')
//       })

//       newSocket.on('friend-request-accepted', friendRequestAcceptedCb)
//       newSocket.on('get-online-friends', onlineFriendsCb)
//       newSocket.on('user-online', userOnlineCb)
//       newSocket.on('user-offline', userOfflineCb)

//       newSocket.on('connect_error', error => {
//         console.log('Connection Error:', error)
//         setAttempt(prev => prev + 1)
//         if (attempt < 5) {
//           setTimeout(() => {
//             newSocket.connect()
//           }, 2000)
//         }
//       })

//       return () => {
//         newSocket.disconnect()
//       }
//     }

//     if (!user && socket) {
//       socket.disconnect()
//       setSocket(null)
//     }
//   }, [user, attempt])

//   return { socket, loading }
// }

// export default useSocket
