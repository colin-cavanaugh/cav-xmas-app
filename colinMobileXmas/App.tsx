import React, { useState } from 'react'
import { View, Text, Button, Dimensions } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'
import { useUser } from './components/API/AuthService.js'
// Components
import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import Events from './components/Events/Events.js'
import AddFriends from './components/Friends/AddFriends.js'

type RootStackParamList = {
  Home: undefined
  Profile: undefined
  AddFriends: undefined
  Events: undefined
  Details: { itemId: number }
  Login: undefined
}

const DetailsScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'grey' }}>
      <Text>Details Screen</Text>
    </View>
  )
}

const Stack = createStackNavigator<RootStackParamList>()

function App() {
  console.log('App component initialized')
  const [menuOpen, setMenuOpen] = useState(false)
  // const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { user, logout } = useUser()
  console.log('User State in App:', user)
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }
  useEffect(() => {
    console.log('menuOpen', menuOpen)
  }, [menuOpen])
  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator
          screenOptions={{
            header: props => (
              <Header
                {...props}
                user={user}
                logout={logout}
                toggleMenu={toggleMenu}
                menuOpen={menuOpen}
              />
            ),
          }}
        >
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Profile' component={Profile} />
          <Stack.Screen name='AddFriends' component={AddFriends} />
          <Stack.Screen name='Events' component={Events} />
          <Stack.Screen name='Details' component={DetailsScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

export default App
