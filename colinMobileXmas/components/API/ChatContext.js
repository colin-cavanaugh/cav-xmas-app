import { createContext, useContext } from 'react'

export const ChatContext = createContext()

export const useChat = () => {
  return useContext(ChatContext)
}
