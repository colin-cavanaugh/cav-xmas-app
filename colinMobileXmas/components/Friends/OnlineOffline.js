import React, { useEffect, useState, useContext, useFocusEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  ToastAndroid,
} from 'react-native'
import { useUser } from '../API/UserProvider'
import { useNavigation } from '@react-navigation/native'
import { SocketContext } from '../API/SocketContext'
import { useFriends } from './UseFriends'

const OnlineOfflineFriends = () => {
  const { user } = useUser()
  const navigation = useNavigation()
  const userId = user?.userId
  const { friends: initialFriends } = useFriends(userId)
  console.log('Initial Friends:', initialFriends)
  const { socket, onlineFriends } = useContext(SocketContext)
  const [loading, setLoading] = useState(true)
  const [friendList, setFriendList] = useState([...initialFriends])

  const sortedFriendList = friendList.sort((a, b) => {
    if (a.isOnline && !b.isOnline) return -1
    if (!a.isOnline && b.isOnline) return 1
    return 0
  })
  useEffect(() => {
    if (initialFriends && initialFriends.length > 0) {
      setFriendList([...initialFriends])
      setLoading(false)
    }
  }, [initialFriends])

  useEffect(() => {
    let isChanged = false
    const updatedList = sortedFriendList.map(friend => {
      const isCurrentlyOnline = onlineFriends.includes(friend._id)
      if (friend.isOnline !== isCurrentlyOnline) {
        isChanged = true
      }
      return {
        ...friend,
        isOnline: isCurrentlyOnline,
      }
    })

    if (isChanged) {
      setFriendList(updatedList)
    }
  }, [onlineFriends])

  useEffect(() => {
    if (!socket || !socket.connected) return

    const handleFriendOnline = friendId => {
      const friend = friendList.find(f => f._id === friendId)
      if (friend && friend.username) {
        ToastAndroid.showWithGravity(
          `${friend.username} is online!`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        )
      }
      const updatedList = friendList.map(friend => {
        if (friend._id === friendId) {
          return { ...friend, isOnline: true }
        }
        return friend
      })
      setFriendList(updatedList)
    }

    const handleFriendOffline = friendId => {
      const friend = friendList.find(f => f._id === friendId)
      if (friend && friend.username) {
        ToastAndroid.showWithGravity(
          `${friend.username} is offline.`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        )
      }
      const updatedList = friendList.map(friend => {
        if (friend._id === friendId) {
          return { ...friend, isOnline: false }
        }
        return friend
      })
      setFriendList(updatedList)
    }

    socket.on('friend-online', handleFriendOnline)
    socket.on('friend-offline', handleFriendOffline)

    return () => {
      socket.off('friend-online', handleFriendOnline)
      socket.off('friend-offline', handleFriendOffline)
    }
  }, [socket, friendList])

  const handleOpenChat = friend => {
    console.log(
      'Current User:',
      user.username,
      'Friend Pressed:',
      'Id:',
      friend._id,
      'Username:',
      friend.username
    )
    navigation.navigate('ChatRoom', { friendId: friend._id })
  }
  if (loading) {
    return <Text>Loading friends...</Text>
  }

  return (
    <View style={styles.container}>
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
