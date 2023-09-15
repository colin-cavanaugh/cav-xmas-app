import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  StyleSheet,
  Image,
} from 'react-native' // Imported Alert
import { useUser } from '../API/AuthService.js'
import { useFriends } from './UseFriends.js'
import ChatDrawer from '../Social/ChatDrawer.js'
import DefaultIcon from 'react-native-vector-icons/Ionicons'
// import useSocket from '../Socket/useSocket.js'
import { getChatId } from '../utility/utility.js'
import SocketContext from '../API/SocketContext.js'

const OnlineOfflineFriends = () => {
  const { user } = useUser()
  const userId = user?.userId
  const { friends } = useFriends(userId)

  const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)
  const [currentChatFriend, setCurrentChatFriend] = useState(null)
  const [activeChats, setActiveChats] = useState([])
  const [chatMessages, setChatMessages] = useState({})
  const [friendList, setFriendList] = useState([])
  const socket = useContext(SocketContext)

  useEffect(() => {
    if (friends && friends.length > 0) {
      setFriendList(friends)
    }
  }, [friends])
  const openChat = friend => {
    // Alert.alert('Chat Opened', `Now chatting with ${friend.username}`)
    ToastAndroid.showWithGravity(
      `Chat Opened with ${friend.username}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    )
    console.log('Friend Pressed: ', friend)
    const isChatActive = activeChats.find(chat => chat._id === friend._id)

    if (!isChatActive) {
      // If not, add the friend to the active chats.
      setActiveChats([...activeChats, friend])
    }

    setCurrentChatFriend(friend)
    console.log('Current Chat Friend: ', currentChatFriend)
    setChatDrawerOpen(true)
  }
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
  const addMessageToState = useCallback(message => {
    const context = 'addMessageToState'
    logInfo(
      context,
      `Received message from ${message.sender} to ${message.recipient}`
    )

    // Update this line to use both sender and recipient from the message
    const chatId = getChatId(message.sender, message.recipient)
    logInfo(context, `Generated chatId: ${chatId}`)

    setChatMessages(prev => {
      logInfo(
        context,
        `Previous messages for chatId ${chatId}: ${JSON.stringify(
          prev[chatId]
        )}`
      )

      const newMessagesForChatId = [...(prev[chatId] || []), message]
      logInfo(
        context,
        `New messages for chatId ${chatId}: ${JSON.stringify(
          newMessagesForChatId
        )}`
      )
      const newChatMessages = {
        ...prev,
        [chatId]: newMessagesForChatId,
      }
      logInfo(
        context,
        `Updated chatMessages state: ${JSON.stringify(newChatMessages)}`
      )

      return newChatMessages
    })
  }, [])

  // const socket = useSocket(addMessageToState)
  useEffect(() => {
    if (!socket) return
    if (socket) {
      const handleUserOnline = userId => {
        logInfo(context, `User online: ${userId}`)
        const updatedFriends = friendList.map(friend =>
          friend._id === userId ? { ...friend, isOnline: true } : friend
        )
        logInfo(
          context,
          `Updated Friends List after user came online: ${JSON.stringify(
            updatedFriends
          )}`
        )
        setFriendList(updatedFriends)
      }

      const handleUserOffline = userId => {
        logInfo(context, `User offline: ${userId}`)
        const updatedFriends = friendList.map(friend =>
          friend._id === userId ? { ...friend, isOnline: false } : friend
        )
        setFriendList(updatedFriends)
      }

      socket.on('user-online', handleUserOnline)
      socket.on('user-offline', handleUserOffline)

      return () => {
        socket.off('user-online', handleUserOnline)
        socket.off('user-offline', handleUserOffline)
      }
    }
  }, [socket, friends])

  const UserIcon = ({ friend, onClick }) => {
    return (
      <TouchableOpacity style={styles.bubble} onPress={() => onClick(friend)}>
        {friend.photoUrl ? (
          <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
        ) : (
          <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Friends List */}
      <View style={styles.friendsListContainer}>
        <Text>Your Friends</Text>
        <FlatList
          data={friendList}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openChat(item)}>
              <View style={styles.friendItem}>
                <View style={styles.statusIndicator(item.isOnline)} />
                <Text style={{ fontSize: 14 }}>
                  {item.username} - {item.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Chat Section */}
      <View style={styles.chatSection}>
        {/* Chat Drawer */}
        <View style={styles.chatContainer}>
          {isChatDrawerOpen && currentChatFriend && (
            <ChatDrawer
              friend={currentChatFriend}
              onClose={closeChat}
              setCurrentChatFriend={setCurrentChatFriend}
              activeChats={activeChats}
              chatMessages={chatMessages}
              addMessageToState={addMessageToState}
            />
          )}
        </View>

        {/* Active Chat Icons */}
        <View style={styles.activeChatsContainer}>
          {activeChats.map(friend => (
            <UserIcon
              key={friend._id}
              friend={friend}
              onClick={setCurrentChatFriend}
            />
          ))}
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  friendsListContainer: {
    flex: 0.5,
    marginBottom: 20, // Gives a bit of space between the lists and chat section
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statusIndicator: isOnline => ({
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: isOnline ? 'green' : 'grey',
    marginRight: 5,
  }),
  chatSection: {
    flexDirection: 'row',
    flex: 0.5,
  },
  chatContainer: {
    flex: 0.8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  activeChatsContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderRadius: 25,
    overflow: 'hidden',
  },
  chatBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    // ... other chat styles
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
})

export default OnlineOfflineFriends
