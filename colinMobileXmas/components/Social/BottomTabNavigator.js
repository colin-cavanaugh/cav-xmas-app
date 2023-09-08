import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OnlineOfflineFriends from '../Friends/OnlineOfflineFriends'
import PendingRequests from '../Friends/PendingRequests'
import SearchAddFriends from '../Friends/SearchAddFriends'

const Tab = createBottomTabNavigator()

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Friends' component={OnlineOfflineFriends} />
      <Tab.Screen name='Requests' component={PendingRequests} />
      <Tab.Screen name='Search' component={SearchAddFriends} />
    </Tab.Navigator>
  )
}

export default BottomTabNavigator
