import React, { useState, useEffect } from 'react'
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
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { BACKEND_URL } from '@env'

const AddFriends = () => {
  const { user, setUser } = useUser()
  console.log('User Object in AddFriend: ', user)
  const [searchUsername, setSearchUsername] = useState('') // New state for search input
  const [foundUsers, setFoundUsers] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [friends, setFriends] = useState([])
  const userId = user?.userId

  const fetchSentRequests = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/${userId}/sentFriendRequests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        setSentRequests(response.data) // Assume the response data is the array of sent requests
      }
    } catch (error) {
      console.error('Error fetching sent friend requests:', error)
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
        setSentRequests([...sentRequests, friendId]) // Update sent requests
        Alert.alert('Success', 'Friend request sent')
      }
      // Update the local user state to reflect the new friend.
      // This assumes that the response object contains the updated user data.
      // Adjust according to your back-end response.
      if (response.data && response.data.updatedUser) {
        setUser(response.data.updatedUser)
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
      Alert.alert('Error', 'Failed to send friend request')
    }
  }

  const findFriend = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')

      if (!token) {
        console.error("Token doesn't exist")
        return
      }
      console.log(`Searching for username: ${searchUsername}`)
      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/search?username=${searchUsername}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(response)
      if (response.data && response.data.length > 0) {
        console.log('User Found', `Username: ${response.data[0].username}`) // Feedback for a found user
        setFoundUsers(response.data)
      } else {
        Alert.alert(
          'User Not Found',
          'Please check the username and try again.'
        ) // Feedback if not found
        setFoundUsers([])
      }
    } catch (error) {
      console.error(
        `There was an error in findFriend request: ${
          error.message
        }, ${JSON.stringify(error.response)}`
      )

      Alert.alert('Error', 'An error occurred while searching for the user.') // Feedback for error
      setFoundUsers([])
    }
  }
  // Fetch list of friends
  const fetchFriends = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/${userId}/friends`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (response.status === 200) {
        setFriends(response.data) // Assume the response data is the array of friends
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
    }
  }

  // On component mount, fetch sent friend requests and friends
  useEffect(() => {
    fetchSentRequests()
  }, [userId])
  useEffect(() => {
    fetchFriends() // fetch friends list
  }, [userId])
  // Render a single user item
  const renderUserItem = ({ item: { _id, username } }) => (
    <TouchableOpacity
      style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>{username}</Text>
        {friends.includes(
          _id
        ) ? null /* if they are friends, don't show the button */ : sentRequests.includes(
            _id
          ) ? (
          <Text>Request Sent</Text>
        ) : (
          <Button title='Add' onPress={() => sendFriendRequest(_id)} />
        )}
      </View>
    </TouchableOpacity>
  )
  return (
    <View>
      <Text>Add Friends Component</Text>
      <View>
        <TextInput
          value={searchUsername}
          onChangeText={setSearchUsername}
          placeholder='Find User'
          onSubmitEditing={findFriend}
        />
        <Button title='Search' onPress={findFriend} />
      </View>
      <FlatList
        data={foundUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item._id} // Assuming each user has a unique _id
      />
    </View>
  )
}

export default AddFriends
