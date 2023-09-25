import React, { useEffect, useContext } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { UserContext } from '../API/UserProvider'
import { useSocket } from '../API/SocketProvider'
import { useFriends } from './UseFriends'
import { logAllFriends, logOnlineFriends } from '../utility/utility'

const OnlineOfflineFriends = () => {
  const { user } = useContext(UserContext)
  const { socket } = useSocket()
  const userId = user?.userId
  const {
    friends: allFriends,
    onlineFriends,
    setOnline,
    setOffline,
    setInitialOnlineList,
  } = useFriends(userId)

  useEffect(() => {
    if (socket && userId) {
      const handleOnlineFriends = data => {
        setInitialOnlineList(data)
      }

      const handleUserOnline = data => {
        setOnline(data.userId)
      }

      const handleUserOffline = data => {
        setOffline(data.userId)
      }

      socket.on('get-online-friends', handleOnlineFriends)
      socket.on('user-online', handleUserOnline)
      socket.on('user-offline', handleUserOffline)

      return () => {
        socket.off('get-online-friends', handleOnlineFriends)
        socket.off('user-online', handleUserOnline)
        socket.off('user-offline', handleUserOffline)
      }
    }
  }, [socket, userId])

  // Initialize friend list when friends are fetched
  useEffect(() => {
    logOnlineFriends(user, onlineFriends) // Debugging log
    const updatedAllFriends = allFriends.map(friend => {
      return {
        ...friend,
        isOnline: onlineFriends.includes(friend._id),
      }
    })
    logAllFriends(user, updatedAllFriends) // Debugging log
  }, [onlineFriends])

  return (
    <View style={styles.container}>
      <View style={styles.friendsListContainer}>
        <Text>Your Friends</Text>
        <FlatList
          data={allFriends}
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
