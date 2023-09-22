import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { SocketContext } from './SocketContext'

const SocketProvider = ({ children }) => {
  console.log('[SOCKET PROVIDER RENDER]')

  const [socket, setSocket] = useState(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  const [onlineFriends, setOnlineFriends] = useState([]) // New state for online friends
  const [socketLoading, setSocketLoading] = useState(true)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!socketRef.current) {
      const newSocket = io('http://192.168.0.12:8000')

      newSocket.on('connect', () => {
        setIsSocketConnected(true)
        setSocketLoading(false)
        console.log('[Socket Provider 2]Socket connected/reconnected!')
        console.log('[Socket Provider 1][Socket instance ID:]', newSocket.id)
      })

      newSocket.on('disconnect', reason => {
        setIsSocketConnected(false)
        setSocketLoading(true)
        console.log('[Socket Provider 3]Socket disconnected:', reason)
      })

      newSocket.on('connect_error', error => {
        setIsSocketConnected(false)
        setSocketLoading(true)
        console.error('Connection Error:', error)
      })

      newSocket.on('pong', () => {
        console.log('Received pong from server')
      })

      // Handling friend online/offline events
      newSocket.on('friend-online', friendId => {
        setOnlineFriends(prev => [...prev, friendId])
      })

      newSocket.on('friend-offline', friendId => {
        setOnlineFriends(prev => prev.filter(id => id !== friendId))
      })
      console.log('[SocketProvider] Setting socket:', newSocket.id)
      socketRef.current = newSocket
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!socket || !socket.connected) return // return early if socket isn't initialized or not connected

    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit('client-ping')
      }
    }, 5000) // every 5 seconds

    return () => {
      clearInterval(pingInterval) // This will clear the interval when the component unmounts
    }
  }, [socket])

  // Provide both the socket and onlineFriends to the context
  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, onlineFriends, socketLoading }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
