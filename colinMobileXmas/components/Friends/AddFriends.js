// import React, { useState } from 'react'
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Alert,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native'
// import { useUser } from '../API/AuthService.js'
// import axios from 'axios'
// import { useFriends } from './UseFriends'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import FriendsList from './FriendsList.js'

// const AddFriends = () => {
//   const { user } = useUser()
//   const userId = user?.userId
//   const {
//     friends,
//     pendingSentRequests,
//     sendFriendRequest: sendRequest,
//   } = useFriends(userId)
//   const [searchUsername, setSearchUsername] = useState('')
//   const [foundUsers, setFoundUsers] = useState([])

//   const findFriend = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken')

//       if (!token) {
//         console.error("Token doesn't exist")
//         return
//       }

//       const response = await axios.get(
//         `http://192.168.0.12:8000/api/user/search?username=${searchUsername}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       if (response.data && response.data.length > 0) {
//         setFoundUsers(response.data)
//       } else {
//         Alert.alert(
//           'User Not Found',
//           'Please check the username and try again.'
//         )
//         setFoundUsers([])
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while searching for the user.')
//       setFoundUsers([])
//     }
//   }

//   const friendStatus = userId => {
//     if (friends.includes(userId)) {
//       return null
//     } else if (pendingSentRequests.includes(userId)) {
//       return <Text>Request Sent</Text>
//     } else {
//       return <Button title='Add' onPress={() => sendRequest(userId)} />
//     }
//   }

//   const renderUserItem = ({ item: { _id, username } }) => (
//     <TouchableOpacity
//       style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
//     >
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//         <Text>{username}</Text>
//         {friendStatus(_id)}
//       </View>
//     </TouchableOpacity>
//   )

//   return (
//     <View>
//       <Text>Add Friends Component</Text>
//       <FriendsList />
//       <View>
//         <TextInput
//           value={searchUsername}
//           onChangeText={setSearchUsername}
//           placeholder='Find User'
//           onSubmitEditing={findFriend}
//         />
//         <Button title='Search' onPress={findFriend} />
//       </View>
//       <FlatList
//         data={foundUsers}
//         renderItem={renderUserItem}
//         keyExtractor={item => item._id}
//       />
//     </View>
//   )
// }

// export default AddFriends
