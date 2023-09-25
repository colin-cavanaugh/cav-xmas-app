import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from './UserProvider'
import io from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [loading, setLoading] = useState(true)
  // You might already have user info from another context or state
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user && !socket) {
      const newSocket = io('http://192.168.0.12:8000')
      setSocket(newSocket)
      setLoading(false)

      newSocket.on('connect', () => {
        console.log('Connected')
      })

      return () => {
        newSocket.disconnect()
      }
    }

    if (!user && socket) {
      socket.disconnect()
    }
  }, [user])

  const value = {
    socket,
    loading,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
