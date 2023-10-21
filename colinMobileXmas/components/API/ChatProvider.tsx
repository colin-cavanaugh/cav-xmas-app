// import React, { useState, useContext, useCallback, useEffect } from 'react'
// import { useUser } from './UserProvider'
// import { SocketContext } from './SocketContext'
// import { ChatContext } from './ChatContext'
// import { getChatId } from '../utility/utility'
// import { ToastAndroid } from 'react-native'

// type ChatMessage = {
//   sender: string
//   recipient: string
//   content: string
// }

// type ChatMessages = {
//   [chatId: string]: ChatMessage[]
// }
// type ChatContextType = {
//   addMessageToState: (message: ChatMessage) => void
// }

// type ChatProviderProps = {
//   children: React.ReactNode
// }

// const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
//   const { user } = useUser()
//   const userId = user?.userId
//   useEffect(() => {
//     console.log('[CHAT PROVIDER RENDER]', user.username)
//   }, [])

//   const [chatMessages, setChatMessages] = useState<ChatMessages>({})
//   const [currentChatFriend, setCurrentChatFriend] = useState<string | null>(
//     null
//   )
//   const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([])
//   const { socket } = useContext(SocketContext)

//   const addMessageToState = useCallback((message: ChatMessage) => {
//     const chatId = getChatId(message.sender, message.recipient)
//     setChatMessages(prev => {
//       const newMessagesForChatId = [...(prev[chatId] || []), message]
//       return {
//         ...prev,
//         [chatId]: newMessagesForChatId,
//       }
//     })
//   }, [])

//   useEffect(() => {
//     if (currentChatFriend) {
//       console.log(
//         'Current chat friend:',
//         currentChatFriend,
//         'Current User:',
//         userId
//       )
//       const chatId = getChatId(userId, currentChatFriend)
//       setCurrentMessages(chatMessages[chatId] || [])
//     }
//   }, [currentChatFriend, userId, chatMessages])

//   const sendMessage = (friendId: string, message: string) => {
//     const payload = {
//       sender: userId,
//       recipient: friendId,
//       content: message,
//     }
//     console.log('payload content:', payload.content)
//     // Here, make sure that your socket object is valid
//     if (socket) {
//       console.log('Sending message payload:', payload)
//       socket.emit('send-message', payload)
//     }

//     addMessageToState(payload) // This will update the UI immediately, optimistic update
//   }

//   const value = {
//     chatMessages,
//     setChatMessages,
//     setCurrentChatFriend,
//     sendMessage,
//     addMessageToState,
//   }

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
// }

// export default ChatProvider

