import React from 'react'
import io from 'socket.io-client'
import { useUser } from '../API/AuthService'

const socket = io('http://192.168.0.12:8000')

const OnlineOfflineFriends = () => {
  const { user } = useUser()
  const userId = user?.userId
  // When user logs in or app is foreground:
  socket.emit('go-online', userId)
  return <></>
}

export default OnlineOfflineFriends
