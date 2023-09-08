import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useUser } from '../API/AuthService'

export const socket = io('http://192.168.0.12:8000')

const useSocket = () => {
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      socket.emit('go-online', user.userId)
    }

    return () => {
      socket.disconnect()
    }
  }, [user])

  return socket // Return socket instance in case any component wants to use it further
}

export default useSocket
