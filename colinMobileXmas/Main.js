import 'react-native-gesture-handler'
import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { UserContext } from './components/API/UserProvider'
import { SocketProvider } from './components/API/SocketProvider'
import BottomTabNavigator from './components/Navigation/BottomTabNavigator.js'
import Login from './components/Login/Login'
import Chat from './components/Social/Chat'
import MainSideDrawer from './components/Navigation/MainSideDrawer'
import ChatRoom from './components/Social/ChatRoom.js'

const Stack = createStackNavigator()
const MainStack = createStackNavigator()

const Main = () => {
  const { user } = useContext(UserContext)

  const AuthenticatedApp = () => (
    <SocketProvider>
      <MainStack.Navigator screenOptions={{ presentation: 'modal' }}>
        <MainStack.Screen
          name='MainDrawer'
          component={MainSideDrawer}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name='TabNavigator'
          options={{ headerShown: false }}
          children={() => <BottomTabNavigator />}
        />
        <MainStack.Screen
          name='Chat'
          component={Chat}
          options={{ title: 'Chat' }}
        />
        <MainStack.Screen
          name='ChatRoom'
          component={ChatRoom}
          options={{ title: 'Chat Room' }}
        />
      </MainStack.Navigator>
    </SocketProvider>
  )

  const UnauthenticatedApp = () => (
    <Stack.Navigator>
      <Stack.Screen
        name='Login'
        component={Login}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )

  return (
    <NavigationContainer>
      {user && user.userId ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </NavigationContainer>
  )
}

export default Main
