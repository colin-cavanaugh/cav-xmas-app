// SocketProvider.js
import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import SocketContext from './SocketContext'

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const newSocket = io('http://192.168.0.12:8000')
    newSocket.on('connect', () => {
      console.log('Socket connected!')
    })

    newSocket.on('disconnect', reason => {
      console.log('Socket disconnected:', reason)
    })

    newSocket.on('connect_error', error => {
      console.error('Connection Error:', error)
    })
    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
      console.log('Socket disconnected.')
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export default SocketProvider
