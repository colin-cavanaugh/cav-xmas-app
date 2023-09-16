import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useUser } from '../API/AuthService.js'
import { useFriends } from './UseFriends'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PendingRequests from './PendingRequests.js'

const SearchAddFriends = () => {
  const { user } = useUser()
  const userId = user?.userId
  const {
    friends,
    pendingSentRequests,
    sendFriendRequest: sendRequest,
    pendingReceivedRequests,
    acceptFriendRequest,
  } = useFriends(userId)

  const [searchUsername, setSearchUsername] = useState('')
  const [foundUsers, setFoundUsers] = useState([])

  const findFriend = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      if (!token) {
        console.error("Token doesn't exist")
        return
      }

      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/search?username=${searchUsername}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data && response.data.length > 0) {
        setFoundUsers(response.data)
      } else {
        Alert.alert(
          'User Not Found',
          'Please check the username and try again.'
        )
        setFoundUsers([])
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while searching for the user.')
      console.error(error)
      setFoundUsers([])
    }
  }

  const friendStatus = userId => {
    if (friends.some(friend => friend._id === userId)) {
      return null
    } else if (pendingSentRequests.some(request => request._id === userId)) {
      return <Text>Request Sent</Text>
    } else {
      return <Button title='Add' onPress={() => sendRequest(userId)} />
    }
  }

  const renderUserItem = ({ item: { _id, username } }) => (
    <TouchableOpacity
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>{username}</Text>
        {friendStatus(_id)}
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={{ padding: 20 }}>
      <View>
        <PendingRequests />
      </View>
      <Text>Search and Add Friends</Text>

      {/* Search Friends */}
      <TextInput
        value={searchUsername}
        onChangeText={setSearchUsername}
        placeholder='Find User'
        onSubmitEditing={findFriend}
      />
      <Button title='Search' onPress={findFriend} />

      {/* Found Users */}
      <FlatList
        data={foundUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item._id}
      />

      <FlatList
        data={pendingReceivedRequests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.username} sent you a friend request.</Text>
            <Button
              title='Accept'
              onPress={() => acceptFriendRequest(item._id, item.username)}
            />
          </View>
        )}
      />
    </View>
  )
}

export default SearchAddFriends
