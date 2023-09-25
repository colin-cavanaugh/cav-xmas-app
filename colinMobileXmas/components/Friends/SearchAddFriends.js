import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { UserContext } from '../API/UserProvider.js'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PendingRequests from './PendingRequests.js'
import { useFriends } from './UseFriends.js'
import { useSocket } from '../API/SocketProvider.js'

const SearchAddFriends = () => {
  const { user } = useContext(UserContext)
  const { socket } = useSocket()
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
  const [requestFriends, setRequestFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])

  useEffect(() => {
    if (socket && userId) {
      const handleFriendRequestAccepted = data => {
        // data could contain the newly added friend details
        setRequestFriends(prevFriends => [...prevFriends, data.newFriend])
      }

      socket.on('friend-request-accepted', handleFriendRequestAccepted)

      return () => {
        // Cleanup
        socket.off('friend-request-accepted', handleFriendRequestAccepted)
      }
    }
  }, [socket, userId])

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

      if (response.status === 404) {
        Alert.alert('User Not Found', 'No user found with that username.')
        return
      }

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
  const sendRequestAndUpdateState = async userIdToCheck => {
    await sendRequest(userIdToCheck)
    // Now update the local state immediately to reflect the change
    setFoundUsers(prevFoundUsers =>
      prevFoundUsers.filter(user => user._id !== userIdToCheck)
    )
  }

  const friendStatus = userIdToCheck => {
    if (friends.some(friend => friend._id === userIdToCheck)) {
      return null
    } else if (
      pendingSentRequests.some(request => request._id === userIdToCheck)
    ) {
      return <Text>Pending</Text>
    } else {
      return (
        <Button
          title='Add'
          onPress={() => sendRequestAndUpdateState(userIdToCheck)}
        />
      )
    }
  }

  const renderUserItem = ({ item: { _id, username } }) => (
    <TouchableOpacity
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        margin: 5,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>{username}</Text>
        {friendStatus(_id)}
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={{ padding: 20, flex: 1 }}>
      {/* <View style={{ marginBottom: 20 }}>
        <PendingRequests />
      </View> */}
      <Text>Search and Add Friends</Text>

      {/* Search Friends */}
      <TextInput
        style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
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
        style={{ marginBottom: 20 }}
      />

      {/* Received Requests */}
      <FlatList
        data={pendingReceivedRequests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 5,
            }}
          >
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
