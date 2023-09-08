import React from 'react'
import { View, Text } from 'react-native'
import { useFriends } from './UseFriends'
import { FlatList } from 'react-native-gesture-handler'
import { useUser } from '../API/AuthService'

const PendingRequests = () => {
  const { user } = useUser()
  const userId = user?.userId
  const {
    pendingSentRequests,
    pendingReceivedRequests,
    acceptFriendRequest,
  } = useFriends(userId)

  const renderFriendItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.username}</Text>
    </View>
  )

  const renderPendingRequestItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.username}</Text>
      <Button
        title='Accept'
        onPress={() => acceptFriendRequest(item._id, item.username)}
      />
    </View>
  )

  return (
    <View>
      <Text>Sent Requests</Text>
      <FlatList
        data={pendingSentRequests}
        renderItem={renderFriendItem}
        keyExtractor={item => item._id}
      />
      <Text>Received Requests</Text>
      <FlatList
        data={pendingReceivedRequests}
        renderItem={renderPendingRequestItem}
        keyExtractor={item => item._id}
      />
    </View>
  )
}

export default PendingRequests
