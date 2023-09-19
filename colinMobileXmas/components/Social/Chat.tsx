import { createStackNavigator } from '@react-navigation/stack'
import React, { useContext, useState } from 'react'
import { View, Text, Button, TextInput } from 'react-native'
import CustomHeader from '../Home/CustomHeader'
import { ChatContext } from '../API/ChatContext'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useChat } from '../API/ChatContext'

type ChatProps = {
  userId?: string
  onMessageSend?: (message: string) => void
}
type ChatMessage = {
  sender: string
  recipient: string
  content: string
}
const Chat: React.FC<ChatProps> = ({ userId, onMessageSend }) => {
  const [messageText, setMessageText] = useState<string>('')
  const { activeChats, chatMessages, friendList, setChatMessages } = useChat()

  const sendMessage = () => {
    if (onMessageSend) {
      onMessageSend(messageText)
    }
    // You might also want to reset messageText here after sending
    setMessageText('')
  }
  return (
    <View>
      <Text>Welcome to Chat!</Text>

      {/* Check if userId exists before trying to access chatMessages */}
      <View>
        {userId &&
          chatMessages[userId]?.map((msg: ChatMessage, index: number) => (
            <Text key={index}>{msg.content}</Text>
          ))}
      </View>

      <TextInput
        value={messageText}
        onChangeText={text => setMessageText(text)}
        placeholder='Type your message...'
      />

      <Button title='Send' onPress={sendMessage} />
    </View>
  )
}
export default Chat
