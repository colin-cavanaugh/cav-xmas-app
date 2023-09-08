import React from 'react'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'

import OnlineOfflineFriends from './OnlineOfflineFriends' // Contains list of online and offline friends
import PendingRequests from './PendingRequests' // Contains list of pending friend requests
import SearchAddFriends from './SearchAddFriends' // Contains the search bar and result list
import io from 'socket.io-client'

const socket = io('http://192.168.0.12:8000')

// When user logs in or app is foreground:
socket.emit('go-online', userId)

const BottomTab = createBottomTabNavigator({
  Friends: OnlineOfflineFriends,
  Requests: PendingRequests,
  Search: SearchAddFriends,
})

export default createAppContainer(BottomTab)
