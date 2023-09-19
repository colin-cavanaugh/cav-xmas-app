import React, { useState, useContext, useCallback, useEffect } from 'react'
import { useUser } from './AuthService'
import { useFriends } from '../Friends/UseFriends'
import { SocketContext } from './SocketContext'
import { ChatContext } from './ChatContext'
import { getChatId } from '../utility/utility'
import { useChatSocketListeners } from './useChatSocketListeners'

type ChatMessage = {
  sender: string
  recipient: string
  content: string
}

type ChatMessages = {
  [chatId: string]: ChatMessage[]
}

type Friend = {
  _id: string
  isOnline?: boolean
  // Add other properties as needed
}
type ChatProviderProps = {
  children: React.ReactNode
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  console.log('[CHAT PROVIDER RENDER]')
  const { user } = useUser()
  const userId = user?.userId

  const [chatMessages, setChatMessages] = useState<ChatMessages>({})
  const [activeChats, setActiveChats] = useState<string[]>([])
  const [friendList, setFriendList] = useState<Friend[]>([])
  const { friends } = useFriends(userId)
  const [minimizedChats, setMinimizedChats] = useState<string[]>([])
  const [currentChatFriend, setCurrentChatFriend] = useState<string | null>(
    null
  )
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([])
  const socket = useContext(SocketContext)
  const [message, setMessage] = useState('')

  const addMessageToState = useCallback(
    (message: ChatMessage) => {
      console.log('Before adding message:', currentMessages)
      const chatId = getChatId(message.sender, message.recipient)

      setChatMessages(prev => {
        const newMessagesForChatId = [...(prev[chatId] || []), message]
        return {
          ...prev,
          [chatId]: newMessagesForChatId,
        }
      })

      if (chatId === getChatId(userId, currentChatFriend)) {
        setCurrentMessages(prevMessages => [...prevMessages, message])
      }

      console.log('After adding message:', currentMessages)
    },
    [userId, currentChatFriend]
  )

  useEffect(() => {
    if (currentChatFriend) {
      const chatId = getChatId(userId, currentChatFriend)
      setCurrentMessages(chatMessages[chatId] || [])
    }
  }, [currentChatFriend, userId])

  // Integrate the socket listeners

  useChatSocketListeners(setFriendList, addMessageToState, socket)

  // Function to send messages
  const sendMessage = (recipientId: string, content: string) => {
    console.log('sendMessage called in ChatProvider')

    if (!socket || !userId) return

    const message = {
      sender: userId,
      recipient: recipientId,
      content,
    }

    socket.emit('send-message', message)
    console.log('Socket instance ID in ChatProvider send-message:', socket.id)
    addMessageToState(message)
    setMessage('') // Clear the input
  }

  useEffect(() => {
    if (friends && friends.length > 0) {
      setFriendList(friends)
    }
  }, [friends])

  const isChatMinimized = (friend: Friend) => {
    return minimizedChats.includes(friend._id)
  }

  const minimizeChat = (friend: Friend) => {
    setMinimizedChats(prevState => [...prevState, friend._id])
  }

  const maximizeChat = (friend: Friend) => {
    setMinimizedChats(prevState => prevState.filter(id => id !== friend._id))
  }

  const value = {
    activeChats,
    setActiveChats,
    chatMessages,
    setChatMessages,
    friendList,
    setFriendList,
    isChatMinimized,
    minimizeChat,
    maximizeChat,
    minimizedChats,
    setCurrentChatFriend,
    currentMessages,
    setCurrentMessages,
    addMessageToState,
    sendMessage,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export default ChatProvider
