// import React, { useState, useEffect } from 'react'
// import { View, Text, Button, FlatList, Alert } from 'react-native'
// import axios from 'axios'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { useUser } from '../API/AuthService'
// import { useFriends } from './UseFriends'

// const FriendsList = () => {
//   const { user, setUser } = useUser()
//   const userId = user?.userId
//   const username = user?.username
//   const { friends, pendingRequests, acceptFriendRequest } = useFriends(userId) // Use the hook
//   ///// Where Old Code Was //////////

//   const renderFriendItem = ({ item }) => (
//     <View style={{ padding: 10 }}>
//       <Text>{item.username}</Text>
//     </View>
//   )

//   const renderPendingRequestItem = ({ item }) => (
//     <View style={{ padding: 10 }}>
//       <Text>{item.username}</Text>
//       <Button
//         title='Accept'
//         onPress={() => acceptFriendRequest(item._id, item.username)}
//       />
//     </View>
//   )

//   return (
//     <View>
//       <Text>Friends</Text>
//       <FlatList
//         data={friends}
//         renderItem={renderFriendItem}
//         keyExtractor={item => item._id}
//       />
//       <Text>Pending Requests</Text>
//       <FlatList
//         data={pendingRequests}
//         renderItem={renderPendingRequestItem}
//         keyExtractor={item => item._id}
//       />
//     </View>
//   )
// }

// export default FriendsList
