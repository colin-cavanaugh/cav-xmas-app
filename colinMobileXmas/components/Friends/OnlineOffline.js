import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
} from 'react-native'
import { useUser } from '../API/AuthService.js'
import { ChatContext } from '../API/ChatContext' // import the context
import OpenChat from '../Messages/OpenChat.js'
import { useNavigation } from '@react-navigation/native'
import { SocketContext } from '../API/SocketContext'

const OnlineOfflineFriends = () => {
  const { user } = useUser()
  const navigation = useNavigation()
  const { friendList: initialFriendList, setCurrentChatFriend } = useContext(
    ChatContext
  )
  const { socket, onlineFriends } = useContext(SocketContext)
  const [friendList, setFriendList] = useState(initialFriendList) // Use a local state
  // console.log('FriendList inside OnlineOfflineFriends:', friendList)
  const sortedFriendList = friendList.sort((a, b) => {
    if (a.isOnline && !b.isOnline) return -1
    if (!a.isOnline && b.isOnline) return 1
    return 0
  })

  useEffect(() => {
    // Update friend online status
    friendList.forEach(friend => {
      friend.isOnline = onlineFriends.includes(friend._id)
    })
    setFriendList([...friendList]) // Re-render
  }, [onlineFriends])

  useEffect(() => {
    if (!socket) return

    const handleFriendOnline = friendId => {
      const updatedList = friendList.map(friend => {
        if (friend._id === friendId) {
          friend.isOnline = true
        }
        return friend
      })
      setFriendList(updatedList)
      // Optional: Display a notification here.
    }

    const handleFriendOffline = friendId => {
      const updatedList = friendList.map(friend => {
        if (friend._id === friendId) {
          friend.isOnline = false
        }
        return friend
      })
      setFriendList(updatedList)
      // Optional: Display a notification here.
    }

    socket.on('friend-online', handleFriendOnline)
    socket.on('friend-offline', handleFriendOffline)

    return () => {
      socket.off('friend-online', handleFriendOnline)
      socket.off('friend-offline', handleFriendOffline)
    }
  }, [socket, friendList])

  const handleOpenChat = friend => {
    setCurrentChatFriend(friend)
    navigation.navigate('ChatRoom', { friendId: friend._id })
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
            <TouchableHighlight
              underlayColor='#F0F0F0'
              onPress={() => handleOpenChat(item)}
            >
              <View style={styles.friendItem}>
                <View style={styles.statusIndicator(item.isOnline)} />
                <Text style={{ fontSize: 14 }}>{item.username}</Text>
                {item.isOnline && (
                  <OpenChat friend={item} onClick={handleOpenChat} />
                )}
              </View>
            </TouchableHighlight>
          )}
        />
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
    marginBottom: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5, // subtle line for separation
    borderBottomColor: '#E0E0E0', // light grey color
  },
  statusIndicator: isOnline => ({
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: isOnline ? 'green' : 'grey',
    marginRight: 10,
  }),
})

export default OnlineOfflineFriends
