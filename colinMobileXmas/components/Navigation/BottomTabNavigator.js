import React from 'react'
import { Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import OnlineOfflineFriends from '../Friends/OnlineOffline'
import PendingRequests from '../Friends/PendingRequests'
import SearchAddFriends from '../Friends/SearchAddFriends'
import EventsContainer from '../Events/EventsContainer'
import EventsItem from '../Events/EventsItem'
import Icon from 'react-native-vector-icons/Ionicons'
import Search from 'react-native-vector-icons/Ionicons'
import Calendar from 'react-native-vector-icons/Ionicons'
import Loading from 'react-native-vector-icons/AntDesign'
import Home from '../Home/Home'
import Events from '../Events/Events'
import HomeIcon from 'react-native-vector-icons/Ionicons'
import CustomHeader from '../Home/CustomHeader'
const HomeStack = createStackNavigator()

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name='Home'
      component={Home}
      options={{
        header: () => <CustomHeader />,
      }}
    />
  </HomeStack.Navigator>
)

const EventsStack = createStackNavigator()

const EventsStackScreen = () => (
  <EventsStack.Navigator>
    <EventsStack.Screen
      name='Events'
      component={Events}
      options={{
        header: () => <CustomHeader />,
      }}
    />
  </EventsStack.Navigator>
)
const OnlineOfflineStack = createStackNavigator()

const OnlineOfflineStackScreen = () => (
  <OnlineOfflineStack.Navigator>
    <OnlineOfflineStack.Screen
      name='Friends List'
      component={OnlineOfflineFriends}
      options={{
        header: () => <CustomHeader />,
      }}
    />
  </OnlineOfflineStack.Navigator>
)
const SearchFriendsStack = createStackNavigator()

const SearchFriendsStackScreen = () => (
  <SearchFriendsStack.Navigator>
    <SearchFriendsStack.Screen
      name='HomeSearch'
      component={SearchAddFriends}
      options={{
        header: () => <CustomHeader />,
      }}
    />
  </SearchFriendsStack.Navigator>
)

const BottomTab = createBottomTabNavigator()

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name='HomeTab'
        component={HomeStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={30}
              color='#607D8B'
            />
          ),
        }}
      />
      <BottomTab.Screen
        name='Friends'
        component={OnlineOfflineStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'people' : 'people-outline'}
              size={30}
              color='#607D8B'
            />
          ),
        }}
      />
      <BottomTab.Screen
        name='Search'
        component={SearchFriendsStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Search
              name={focused ? 'search-sharp' : 'search-outline'}
              size={30}
              color='#607D8B'
            />
          ),
        }}
      />
      <BottomTab.Screen
        name='EventsTab'
        component={EventsStackScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Search
              name={focused ? 'calendar-clear-sharp' : 'calendar-clear-outline'}
              size={30}
              color='#607D8B'
            />
          ),
        }}
      />
      {/* other BottomTab.Screens */}
    </BottomTab.Navigator>
  )
}

export default BottomTabNavigator
