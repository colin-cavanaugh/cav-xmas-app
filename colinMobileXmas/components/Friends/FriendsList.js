import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, Alert } from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUser } from '../API/AuthService'

const FriendsList = () => {
  const { user, setUser } = useUser()
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const userId = user?.userId
  const username = user?.username

  const fetchFriendList = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/${userId}/friendsList`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.status === 200) {
        setFriends(response.data.friends)
        setPendingRequests(response.data.pendingRequests)
      }
    } catch (error) {
      console.error('Error fetching friend list', error)
    }
  }

  useEffect(() => {
    fetchFriendList()
  }, [userId])

  const acceptFriendRequest = async (friendId, friendUsername) => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.post(
        `http://192.168.0.12:8000/api/user/${userId}/acceptFriendRequest`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        // On successful friend request acceptance, update local state
        // Remove the user from pendingRequests
        const updatedPendingRequests = pendingRequests.filter(
          request => request._id !== friendId
        )
        setPendingRequests(updatedPendingRequests)

        // Add the user to friends list
        // Note: You would probably want to add more information for the friend here.
        const newFriend = {
          _id: friendId,
          username: friendUsername,
        }
        setFriends([...friends, newFriend])

        // Optionally, you can show a success alert
        Alert.alert('Success', 'Friend request accepted.')
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
      // Optionally, you can show an error alert
      Alert.alert('Error', 'Failed to accept friend request.')
    }
  }

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
      <Text>Friends</Text>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={item => item._id}
      />
      <Text>Pending Requests</Text>
      <FlatList
        data={pendingRequests}
        renderItem={renderPendingRequestItem}
        keyExtractor={item => item._id}
      />
    </View>
  )
}

export default FriendsList
