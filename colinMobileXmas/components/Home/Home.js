import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useState, useEffect, useContext, useRef } from 'react'
import EventsContainer from '../Events/EventsContainer'
import EventsItem from '../Events/EventsItem'
import MessageBubble from '../Messages/MessageBubble'
import ChatDrawer from '../Social/ChatDrawer'
import OnlineOfflineFriends from '../Friends/OnlineOffline'
import { ChatContext } from '../API/ChatContext'
import Icon from 'react-native-vector-icons/Octicons.js'
import BottomSheet from '@gorhom/bottom-sheet'
import BottomTabNavigator from '../Social/BottomTabNavigator'
import { NavigationContainer } from '@react-navigation/native'
import OpenChat from '../Messages/OpenChat'
import TestNav from '../Social/TestNav'

const Home = () => {
  // State declarations
  const [unreadCount, setUnreadCount] = useState(0)
  const [showFriendsList, setShowFriendsList] = useState(false)
  const [notifications, setNotifications] = useState({})
  const [currentChatFriend, setCurrentChatFriend] = useState(null)
  const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)
  const [isBottomTabOpen, setIsBottomTabOpen] = useState(false)
  const {
    activeChats,
    setActiveChats,
    chatMessages,
    setChatMessages,
    closeChat, // This can be used instead of `onClose`
    addMessageToState,
    isChatMinimized,
    minimizeChat,
    maximizeChat,
    minimizedChats,
  } = useContext(ChatContext)
  const bottomSheetRef = useRef(null)
  // Helper functions
  const toggleFriendsList = () => {
    console.log('ToggleFriendsList pressed')
    setShowFriendsList(prevState => !prevState)
  }

  const handleMessageReceived = message => {
    // Handle the incoming message here
    // Probably update the chatMessages state
  }

  const toggleChatDrawer = () => {
    setChatDrawerOpen(prevState => !prevState)
  }

  const closeChatDrawer = () => {
    setChatDrawerOpen(false)
    setTimeout(() => {
      setCurrentChatFriend(null)
    }, 100)
  }

  useEffect(() => {
    const totalUnread = Object.values(notifications).reduce((a, b) => a + b, 0)
    setUnreadCount(totalUnread)
  }, [notifications])

  return (
    <View style={{ ...styles.welcomeXmas, flex: 1 }}>
      <Text style={styles.welcome}>Welcome to your Home Page!</Text>
      <Text>Please navigate using the menu in the top right</Text>
      <EventsContainer />
      {activeChats.map(friend => (
        <View key={friend._id} style={styles.chatBubble}>
          {isChatMinimized(friend) ? (
            <TouchableOpacity onPress={() => maximizeChat(friend)}>
              {/* Display the user's photo or name */}
              <Text>{friend.name}</Text>
            </TouchableOpacity>
          ) : (
            <OpenChat
              friend={friend}
              onMinimize={() => minimizeChat(friend)}
              onClose={() => closeChat(friend)}
            />
          )}
        </View>
      ))}
      {isChatDrawerOpen && (
        <ChatDrawer
          onMessageReceived={handleMessageReceived}
          activeChats={activeChats}
          setCurrentChatFriend={setCurrentChatFriend}
          friend={currentChatFriend}
          onClose={toggleChatDrawer}
          chatMessages={chatMessages}
          addMessageToState={addMessageToState}
        />
      )}
      {showFriendsList && <OnlineOfflineFriends activeChats={activeChats} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  welcomeXmas: {
    alignItems: 'center',
    marginBottom: 0,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  welcome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
})
export default Home
