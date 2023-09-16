import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import OnlineOfflineFriends from '../Friends/OnlineOffline'
import PendingRequests from '../Friends/PendingRequests'
import SearchAddFriends from '../Friends/SearchAddFriends'
import EventsContainer from '../Events/EventsContainer'
import EventsItem from '../Events/EventsItem'
import Icon from 'react-native-vector-icons/Ionicons'
import Search from 'react-native-vector-icons/Ionicons'
import Calendar from 'react-native-vector-icons/Ionicons'
import Loading from 'react-native-vector-icons/AntDesign'

const Tab = createBottomTabNavigator()

const TestNav = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'people' : 'people-outline'}
              size={30}
              color='#607D8B'
            />
          ),
        }}
        name='Friends'
        component={OnlineOfflineFriends}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Search
              name={focused ? 'search-sharp' : 'search-outline'}
              size={30}
              color='#607D8B'
            />
          ),
        }}
        name='Search'
        component={SearchAddFriends}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Search
              name={focused ? 'calendar-clear-sharp' : 'calendar-clear-outline'}
              size={30}
              color='#607D8B'
            />
          ),
        }}
        name='Events'
        component={EventsContainer}
      />
      <Tab.Screen name='EventsItem' component={EventsItem} />
    </Tab.Navigator>
  )
}

export default TestNav
