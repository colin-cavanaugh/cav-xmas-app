import React, { useContext } from 'react'
import { View, Text, FlatList, Button } from 'react-native'
import { UserContext } from '../API/UserProvider'
import { useFriends } from './UseFriends.js'

const PendingRequests = () => {
  const { user } = useContext(UserContext)
  const userId = user?.userId
  const {
    pendingSentRequests,
    pendingReceivedRequests,
    acceptFriendRequest,
  } = useFriends(userId)

  return (
    <View style={{ padding: 20 }}>
      <Text>Friend Requests</Text>

      {/* Received friend requests */}
      <FlatList
        data={pendingReceivedRequests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>{item.username} sent you a friend request.</Text>
            <Button
              title='Accept'
              onPress={() => acceptFriendRequest(item._id, item.username)}
            />
          </View>
        )}
      />

      {/* Sent friend requests */}
      <FlatList
        data={pendingSentRequests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <Text>You have sent a friend request to {item.username}.</Text>
        )}
      />
    </View>
  )
}

export default PendingRequests
