import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { useUser } from '../API/AuthService'
import { getChatId } from '../utility/utility'
import { SocketContext } from '../API/SocketContext'
import { useFriends } from '../Friends/UseFriends'
import { ChatContext } from '../API/ChatContext'
import LoadingIndicator from './LoadingIndicator'

const ChatRoom = ({ route }) => {
  const {
    activeChats,
    setActiveChats,
    chatMessages,
    setChatMessages,
    friendList,
    currentMessages,
    addMessageToState,
    setCurrentMessages,
    sendMessage,
    setCurrentChatFriend,
  } = useContext(ChatContext)
  const { friendId } = route.params
  const { user } = useUser()
  const userId = user?.userId
  const chatId = getChatId(userId, friendId)
  const socket = useContext(SocketContext)
  const [message, setMessage] = useState('')
  const friendDetails = friendList.find(friend => friend._id === friendId)
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  useEffect(() => {
    // Connect event
    socket.on('connect', () => {
      setIsSocketConnected(true)
      console.log('Socket instance ID in ChatRoom socket.connect:', socket.id)
    })

    // Disconnect event
    socket.on('disconnect', () => {
      setIsSocketConnected(false)
    })

    // Message receive event
    const handleReceiveMessage = incomingMessage => {
      console.log('Received Message:', incomingMessage)
      addMessageToState(incomingMessage)
      console.log('Current messages after adding:', currentMessages)
    }
    socket.on('receive-message', handleReceiveMessage)

    // Feedback event
    const handleFeedback = feedback => {
      console.log('Received feedback:', feedback)
      // You can set this feedback to state and then display it to the user, or handle it in any other way.
    }
    socket.on('feedback', handleFeedback)

    // Cleanup all listeners on component unmount
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('receive-message', handleReceiveMessage)
      socket.off('feedback', handleFeedback)
    }
  }, [socket, addMessageToState])

  // if (!isSocketConnected) {
  //   // Display loading indicator or return null until socket is connected.
  //   return <LoadingIndicator />
  // }

  // const sendMessage = () => {
  //   if (!message.trim()) return // Avoid sending empty messages

  //   const outgoingMessage = {
  //     sender: userId, // assuming you've extracted this from user context
  //     recipient: friendId,
  //     content: message,
  //   }

  //   // Emit the 'send-message' event to the backend via the socket
  //   console.log('Socket instance ID in ChatRoom send-message:', socket.id)
  //   socket.emit('send-message', outgoingMessage)

  //   // Add the message to the local state
  //   addMessageToState(outgoingMessage)

  //   // Clear the message input after sending
  //   setMessage('')
  // }
  // const addTestMessage = () => {
  //   const testMessage = {
  //     sender: userId, // or 'TEST_USER_ID' to differentiate
  //     recipient: friendId, // or 'TEST_FRIEND_ID'
  //     content: 'This is a test message.',
  //   }
  //   addMessageToState(testMessage)
  // }

  return (
    <View style={styles.container}>
      {/* Display friend's details at the top */}
      {friendDetails && (
        <View style={styles.friendDetailsContainer}>
          <Text style={styles.friendName}>{friendDetails.username}</Text>
          {/* If you have more details, like a profile image, you can display it here */}
        </View>
      )}
      <ScrollView>
        {currentMessages &&
          currentMessages.map((msg, index) => (
            <View key={index} style={styles.messageContainer}>
              <Text>
                {msg.sender === userId ? 'You' : 'Friend'}: {msg.content}
              </Text>
            </View>
          ))}
      </ScrollView>
      <TextInput
        value={message}
        onChangeText={setMessage}
        style={styles.textInput}
        placeholder='Type a message...'
      />
      <Button title='Send' onPress={() => sendMessage(friendId, message)} />
      {/* <Button title='Add Test Message' onPress={addTestMessage} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  textInput: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default ChatRoom
