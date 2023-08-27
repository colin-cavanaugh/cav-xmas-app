import React, { useState } from 'react'
import { View, Text, Button, Dimensions } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'
import { useUser } from './components/API/AuthService.js'
// Components
import Header from './components/Header/Header'
import Login from './components/Login/Login'
// import Register from './components/Registration/Register'
import Home from './components/Home/Home'
// import MyProfile from './components/MyProfile/MyProfile'

type RootStackParamList = {
  Home: undefined
  // MyProfile: undefined
  Details: { itemId: number }
  Login: undefined
  // Register: undefined
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
  const [menuOpen, setMenuOpen] = useState(false)
  // const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { user, logout } = useUser()

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
          {/* <Stack.Screen name='MyProfile' component={MyProfile} /> */}
          <Stack.Screen name='Details' component={DetailsScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name='Register'
            component={Register}
            options={{ headerShown: false }}
          /> */}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

export default App
