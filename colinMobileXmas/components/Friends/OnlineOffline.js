import React, { useState } from 'react'
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

const OnlineOfflineFriends = () => {
  const { user } = useUser()
  const userId = user?.userId
  const { friends } = useFriends(userId)

  const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)
  const [currentChatFriend, setCurrentChatFriend] = useState(null)
  const [activeChats, setActiveChats] = useState([])
  const [chatMessages, setChatMessages] = useState({})

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
    setChatDrawerOpen(true)
  }
  const closeChat = () => {
    setCurrentChatFriend(null)
    setChatDrawerOpen(false)
  }
  const addMessageToState = message => {
    setChatMessages(prev => ({
      ...prev,
      [message.recipient]: [...(prev[message.recipient] || []), message],
    }))
  }

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
          data={friends}
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
