import React, { useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
  StyleSheet,
  Image,
} from 'react-native'
import { useUser } from '../API/AuthService.js'
import DefaultIcon from 'react-native-vector-icons/Ionicons'
import { ChatContext } from '../API/ChatContext' // import the context
import OpenChat from '../Messages/OpenChat.js'

const OnlineOfflineFriends = () => {
  const { user } = useUser()
  const {
    friendList,
    activeChats,
    setActiveChats,
    setChatDrawerOpen,
    setCurrentChatFriend,
  } = useContext(ChatContext) // get required states and functions from ChatProvider

  console.log('FriendList inside OnlineOfflineFriends:', friendList)

  const openChat = friend => {
    ToastAndroid.showWithGravity(
      `Chat Opened with ${friend.username}`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    )
    const isChatActive = activeChats.find(chat => chat._id === friend._id)
    if (!isChatActive) {
      setActiveChats([...activeChats, friend])
    }
    setCurrentChatFriend(friend)
    setChatDrawerOpen(true)
  }
  console.log(friendList)

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
        {/* Chat Drawer (Moved to Home Component, so removing from here) */}

        {/* Active Chat Icons */}
        <View style={styles.activeChatsContainer}>
          {activeChats &&
            activeChats.map(friend => (
              <OpenChat
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
    backgroundColor: 'white',
  },
  friendsListContainer: {
    flex: 1,
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
