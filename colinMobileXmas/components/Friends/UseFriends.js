import React, { useEffect, useReducer } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const initialState = {
  friends: [],
  pendingSentRequests: [],
  pendingReceivedRequests: [],
  onlineFriends: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FRIENDS':
      return { ...state, friends: action.payload }
    case 'SET_SENT_REQUESTS':
      return { ...state, pendingSentRequests: action.payload }
    case 'SET_RECEIVED_REQUESTS':
      return { ...state, pendingReceivedRequests: action.payload }
    case 'ADD_FRIEND':
      return { ...state, friends: [...state.friends, action.payload] }
    case 'REMOVE_RECEIVED_REQUEST':
      return {
        ...state,
        pendingReceivedRequests: state.pendingReceivedRequests.filter(
          request => request._id !== action.payload
        ),
      }
    case 'ADD_SENT_REQUEST':
      return {
        ...state,
        pendingSentRequests: [...state.pendingSentRequests, action.payload],
      }
    case 'SET_ONLINE_FRIENDS':
      return { ...state, onlineFriends: action.payload }
    case 'ADD_ONLINE_FRIEND':
      return {
        ...state,
        onlineFriends: [...state.onlineFriends, action.payload],
      }
    case 'REMOVE_ONLINE_FRIEND':
      return {
        ...state,
        onlineFriends: state.onlineFriends.filter(id => id !== action.payload),
      }
    default:
      throw new Error()
  }
}

export const useFriends = userId => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setOnline = userId => {
    dispatch({ type: 'ADD_ONLINE_FRIEND', payload: userId })
  }

  const setOffline = userId => {
    dispatch({ type: 'REMOVE_ONLINE_FRIEND', payload: userId })
  }

  const setInitialOnlineList = onlineList => {
    dispatch({ type: 'SET_ONLINE_FRIENDS', payload: onlineList })
  }

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
        dispatch({ type: 'SET_FRIENDS', payload: response.data.friends })
        dispatch({
          type: 'SET_SENT_REQUESTS',
          payload: response.data.sentRequests,
        })
        dispatch({
          type: 'SET_RECEIVED_REQUESTS',
          payload: response.data.receivedRequests,
        })
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
        // Remove the accepted friend from pendingReceivedRequests
        dispatch({ type: 'REMOVE_RECEIVED_REQUEST', payload: friendId })

        // Add the accepted friend to the friends list
        const newFriend = {
          _id: friendId,
          username: friendUsername,
        }
        dispatch({ type: 'ADD_FRIEND', payload: newFriend })

        Alert.alert('Success', 'Friend request accepted.')
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
      Alert.alert('Error', 'Failed to accept friend request.')
    }
  }

  const sendFriendRequest = async friendId => {
    try {
      const token = await AsyncStorage.getItem('userToken')
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
        // Add the new friendId to pendingSentRequests
        const newPendingRequest = {
          _id: friendId,
        }
        dispatch({ type: 'ADD_SENT_REQUEST', payload: newPendingRequest })

        Alert.alert('Success', `Friend request sent.`)
      }
    } catch (error) {
      console.error('Failed to send friend request:', error)
      Alert.alert('Error', 'Failed to send friend request.')
    }
  }

  return {
    ...state, // this will include friends, pendingSentRequests, pendingReceivedRequests, and onlineFriends
    setOnline,
    setOffline,
    setInitialOnlineList,
    acceptFriendRequest, // Assume this is defined
    sendFriendRequest, // Assume this is defined
  }
}
