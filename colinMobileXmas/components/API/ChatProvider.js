import React, { useState, useContext, useCallback, useEffect } from 'react'
import { useUser } from './AuthService'
import { useFriends } from '../Friends/UseFriends'
import SocketContext from './SocketContext'
import { ChatContext } from './ChatContext'
import { TouchableOpacity, Image } from 'react-native'
import { getChatId } from '../utility/utility'

const ChatProvider = ({ children }) => {
  const { user } = useUser()
  const userId = user?.userId
  const [chatMessages, setChatMessages] = useState({})
  const [activeChats, setActiveChats] = useState([])
  const [friendList, setFriendList] = useState([])
  const { friends } = useFriends(userId)
  const [currentChatFriend, setCurrentChatFriend] = useState([])
  const [minimizedChats, setMinimizedChats] = useState([])

  const socket = useContext(SocketContext)

  const addMessageToState = useCallback(message => {
    const context = 'addMessageToState'
    console.info(
      `[INFO][${context}] Received message from ${message.sender} to ${message.recipient}`
    )

    const chatId = getChatId(message.sender, message.recipient)
    console.info(context, `Generated chatId: ${chatId}`)

    setChatMessages(prev => {
      console.info(
        context,
        `Previous messages for chatId ${chatId}: ${JSON.stringify(
          prev[chatId]
        )}`
      )

      const newMessagesForChatId = [...(prev[chatId] || []), message]
      console.info(
        context,
        `New messages for chatId ${chatId}: ${JSON.stringify(
          newMessagesForChatId
        )}`
      )
      const newChatMessages = {
        ...prev,
        [chatId]: newMessagesForChatId,
      }
      console.info(
        context,
        `Updated chatMessages state: ${JSON.stringify(newChatMessages)}`
      )

      return newChatMessages
    })
  }, [])

  useEffect(() => {
    if (friends && friends.length > 0) {
      setFriendList(friends)
    }
  }, [friends])

  const closeChat = () => {
    setCurrentChatFriend(null)
    setChatDrawerOpen(false)
  }
  const logInfo = (context, message) => {
    console.info(`[INFO][${context}] ${message}`)
  }

  const logError = (context, message) => {
    console.error(`[ERROR][${context}] ${message}`)
  }

  // const socket = useSocket(addMessageToState)
  useEffect(() => {
    if (!socket) return
    if (socket) {
      const handleUserOnline = userId => {
        setFriendList(prevFriendList => {
          const updatedFriends = prevFriendList.map(friend =>
            friend._id === userId ? { ...friend, isOnline: true } : friend
          )
          return updatedFriends
        })
      }

      const handleUserOffline = userId => {
        setFriendList(prevFriendList => {
          const updatedFriends = prevFriendList.map(friend =>
            friend._id === userId ? { ...friend, isOnline: false } : friend
          )
          return updatedFriends
        })
      }

      socket.on('user-online', handleUserOnline)
      socket.on('user-offline', handleUserOffline)

      return () => {
        socket.off('user-online', handleUserOnline)
        socket.off('user-offline', handleUserOffline)
      }
    }
  }, [socket, friends])

  // Chat Minimized function //

  const isChatMinimized = friend => {
    return minimizedChats.includes(friend._id)
  }

  const minimizeChat = friend => {
    setMinimizedChats(prevState => [...prevState, friend._id])
  }

  const maximizeChat = friend => {
    setMinimizedChats(prevState => prevState.filter(id => id !== friend._id))
  }

  // Make sure to expose these functions and states through the context so other components can use them.

  const value = {
    activeChats,
    setActiveChats,
    chatMessages,
    setChatMessages,
    friendList,
    setFriendList,
    closeChat,
    isChatMinimized,
    minimizeChat,
    maximizeChat,
    minimizedChats,
    // ... any other methods or state
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatProvider
