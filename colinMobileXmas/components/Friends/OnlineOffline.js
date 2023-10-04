import React, { useEffect, useContext, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { UserContext } from '../API/UserProvider'
import { useSocket } from '../API/SocketProvider'
import { useFriends } from './UseFriends'
import { logAllFriends, logOnlineFriends } from '../utility/utility'
import { useFocusEffect } from '@react-navigation/native'

const OnlineOfflineFriends = () => {
  const { user } = useContext(UserContext)
  const { socket } = useSocket()
  const userId = user?.userId
  const [displayFriends, setDisplayFriends] = useState([])
  const {
    friends: allFriends,
    onlineFriends,
    setOnline,
    setOffline,
    setInitialOnlineList,
    fetchFriendData,
  } = useFriends(userId)

  useFocusEffect(
    React.useCallback(() => {
      console.log('OnlineOfflineFriends screen focused!')
      fetchFriendData()

      // Socket handlers
      const handleOnlineFriends = data => {
        console.log('handleOnlineFriends triggered')
        console.log('handleOnlineFriends data: ', data)
        setInitialOnlineList(data)
      }

      const handleUserOnline = data => {
        setOnline(data.userId)
      }

      const handleUserOffline = data => {
        setOffline(data.userId)
      }

      // Set up socket event listeners
      if (socket && userId) {
        socket.on('online-friends-list', handleOnlineFriends)
        socket.on('friend-came-online', handleUserOnline)
        socket.on('friend-went-offline', handleUserOffline)
      }

      return () => {
        // Clean up socket event listeners
        if (socket) {
          socket.off('online-friends-list', handleOnlineFriends)
          socket.off('friend-came-online', handleUserOnline)
          socket.off('friend-went-offline', handleUserOffline)
        }
      }
    }, [socket, userId])
  )

  // Initialize friend list when friends are fetched
  useEffect(() => {
    const updatedAllFriends = allFriends.map(friend => {
      return {
        ...friend,
        isOnline: onlineFriends.includes(friend.id),
      }
    })
    setDisplayFriends(updatedAllFriends)
  }, [onlineFriends, allFriends])

  return (
    <View style={styles.container}>
      <View style={styles.friendsListContainer}>
        <Text>Your Friends</Text>
        <FlatList
          data={displayFriends}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.friendItem}>
              <View style={styles.statusIndicator(item.isOnline)} />
              <Text style={{ fontSize: 14 }}>{item.username}</Text>
            </View>
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
    justifyContent: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
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
