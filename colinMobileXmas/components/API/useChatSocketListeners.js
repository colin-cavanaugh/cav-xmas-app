import React, { useEffect } from 'react'

export const useChatSocketListeners = (
  setFriendList,
  addMessageToState,
  socket
) => {
  useEffect(() => {
    if (!socket) return

    const handleUserOnline = userId => {
      console.log('HandleUserOnline in useChatSocket')
      setFriendList(prevFriendList =>
        prevFriendList.map(friend =>
          friend._id === userId ? { ...friend, isOnline: true } : friend
        )
      )
    }

    const handleUserOffline = userId => {
      console.log('HandleUserOffline in useChatSocket')
      setFriendList(prevFriendList =>
        prevFriendList.map(friend =>
          friend._id === userId ? { ...friend, isOnline: false } : friend
        )
      )
    }

    const handleReceiveMessage = message => {
      addMessageToState(message)
    }

    socket.on('user-online', handleUserOnline)
    socket.on('user-offline', handleUserOffline)
    socket.on('receive-message', handleReceiveMessage)

    return () => {
      socket.off('user-online', handleUserOnline)
      socket.off('user-offline', handleUserOffline)
      socket.off('receive-message', handleReceiveMessage)
    }
  }, [socket, setFriendList, addMessageToState])
}
