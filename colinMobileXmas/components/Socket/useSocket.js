// import { useEffect, useState } from 'react'
// import { io } from 'socket.io-client'
// import { useUser } from '../API/AuthService'

// const useSocket = onMessageReceived => {
//   const { user } = useUser()
//   const [socket, setSocket] = useState(null)

//   useEffect(() => {
//     if (!user) return // Only connect if there's a user

//     const newSocket = io('http://192.168.0.12:8000')
//     newSocket.emit('go-online', user.userId)
//     setSocket(newSocket)

//     return () => {
//       newSocket.disconnect()
//       console.log('Socket disconnected.')
//     }
//   }, [user])

//   useEffect(() => {
//     if (socket && onMessageReceived) {
//       socket.on('receive-message', onMessageReceived)

//       return () => {
//         socket.off('receive-message')
//       }
//     }
//   }, [socket, onMessageReceived])

//   return socket // Return socket instance in case any component wants to use it further
// }

// export default useSocket
