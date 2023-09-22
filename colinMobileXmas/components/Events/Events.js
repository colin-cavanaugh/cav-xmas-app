import React, { useState, useContext } from 'react'
import axios from 'axios'
import {
  View,
  FlatList,
  Text,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native'
import { useUser } from '../API/UserProvider'
import { useFriends } from '../Friends/UseFriends'
import { SocketContext } from '../API/SocketContext'
const Events = () => {
  const { socket } = useContext(SocketContext)
  const { user } = useUser()
  const userId = user?.userId
  const { friends } = useFriends(userId)
  const socketString = `Socket: ${socket}`
  console.log(socketString)
  const socketInfo = `Is socket connected: ${
    socket ? socket.connected : 'Socket is null'
  }`
  console.log(socketInfo)
  const userString = `Current User Object: \n Username: ${user.username}\n Id: ${user.userId}\n isOnline?: ${user.isOnline}`
  console.log(userString)
  const friendString = `Current Friends Object for: ${user.username} \n Username: ${friends.username}\n Id: ${friends.userId}\n isOnline?: ${friends.isOnline}`
  const friendsObj = friends.map(friend => {
    return {
      Username: friend.username,
      id: friend._id,
      'isOnline?': friend.isOnline,
    }
  })
  console.log('[Friends]: ', friendsObj)
  return (
    <View>
      <Text>Events Page</Text>
      {/* <FlatList data={user} />
      <FlatList data={socket} />
      <FlatList
        data={viewFriends}
        renderItem={({ item }) => <Item text={item.text} />}
      /> */}
    </View>
  )
}

export default Events
