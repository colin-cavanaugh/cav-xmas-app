import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from 'react-native'
import axios from 'axios'

export const useFriends = userId => {
  const [friends, setFriends] = useState([])
  const [pendingSentRequests, setPendingSentRequests] = useState([])
  const [pendingReceivedRequests, setPendingReceivedRequests] = useState([])

  const fetchFriendData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/${userId}/allFriendData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.status === 200) {
        setFriends(response.data.friends)
        setPendingSentRequests(response.data.sentRequests)
        setPendingReceivedRequests(response.data.receivedRequests)
      }
    } catch (error) {
      console.error('Error fetching friend data', error)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchFriendData()
    }
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
        const updatedPendingReceivedRequests = pendingReceivedRequests.filter(
          request => request._id !== friendId
        )
        setPendingReceivedRequests(updatedPendingReceivedRequests)

        // Add the user to friends list
        // Note: You would probably want to add more information for the friend here.
        const newFriend = {
          _id: friendId,
          username: friendUsername,
        }
        setFriends(prevFriends => [...prevFriends, newFriend])

        // Optionally, you can show a success alert
        Alert.alert('Success', 'Friend request accepted.')
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
      // Optionally, you can show an error alert
      Alert.alert('Error', 'Failed to accept friend request.')
    }
  }
  const sendFriendRequest = async friendId => {
    const token = await AsyncStorage.getItem('userToken')
    try {
      const response = await axios.post(
        `http://192.168.0.12:8000/api/user/${userId}/sendFriendRequest`,
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        console.log(response.data) // If your server returns a message, it will be logged here
        // Update pendingSentRequests to include the new friendId
        setPendingSentRequests(prevRequests => [...prevRequests, friendId])
        Alert.alert(`Friend request sent to ...`)
      } else {
        console.error(response.data) // Error message, if provided by the server, will be logged here
      }
    } catch (error) {
      console.error('Failed to send friend request:', error)
    }
  }

  return {
    friends,
    pendingSentRequests,
    pendingReceivedRequests,
    acceptFriendRequest,
    sendFriendRequest,
  }
}
