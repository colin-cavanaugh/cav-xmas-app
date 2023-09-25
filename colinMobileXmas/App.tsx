// import 'react-native-gesture-handler'
// import React, { useState, useEffect, useContext, useRef } from 'react'
// import { Text, AppState, AppStateStatus } from 'react-native'
// import { NavigationContainer } from '@react-navigation/native'
// import { createStackNavigator } from '@react-navigation/stack'
// import { useUser } from './components/API/UserProvider'
// import DefaultPhoto from 'react-native-vector-icons/FontAwesome'
// import { SocketContext } from './components/API/SocketContext'
// import { CustomSocket } from './components/API/SocketTypes'
// import BottomTabNavigator from './components/Navigation/BottomTabNavigator.js'
// import Login from './components/Login/Login'
// import Chat from './components/Social/Chat'
// import MainSideDrawer from './components/Navigation/MainSideDrawer'
// import ChatRoom from './components/Social/ChatRoom.js'
// import { logEvent } from './components/utility/utility.js'
// import ChatProvider from './components/API/ChatProvider'

// type MainStackParamList = {
//   MainDrawer: undefined
//   TabNavigator: undefined
//   Chat: ChatProps
//   ChatRoom: undefined
// }

// type ChatProps = {
//   exampleProp?: string
// }
// export type RootStackParamList = {
//   Home: undefined
//   Profile: undefined
//   AddFriends: undefined
//   Events: undefined
//   Details: { itemId: number }
//   Login: undefined
//   FriendsNav: undefined
//   Drawer: undefined
// }

// const Stack = createStackNavigator<RootStackParamList>()
// const MainStack = createStackNavigator<MainStackParamList>()

// function App() {
//   const { user, loading } = useUser()
//   const userId = user?.userId
//   const [appState, setAppState] = useState<AppStateStatus>(
//     AppState.currentState
//   )
//   const { socket, socketLoading } = useContext(SocketContext)
//   const appStateRef = useRef(appState)
//   useEffect(() => {
//     appStateRef.current = appState

//     const handleAppStateChange = (nextAppState: AppStateStatus) => {
//       // Using appStateRef.current instead of appState directly
//       if (appStateRef.current !== nextAppState) {
//         console.log(
//           'at if(appStateRef.current !== nextAppState) { App State: ',
//           appStateRef.current,
//           'Next App State: ',
//           nextAppState
//         )

//         if (
//           nextAppState === 'active' &&
//           appStateRef.current.match(/inactive|background/) &&
//           socket &&
//           user?.userId
//         ) {
//           logEvent('go-online', 'App.tsx:handleAppStateChange', user.userId)
//           console.log('Socket in App.tsx go-online Socket Value:', socket)
//           console.log(typeof socket, socket)
//           if (socket && user?.userId) {
//             ;(socket as any).emit('go-online', user.userId)
//           }
//         } else if (
//           nextAppState.match(/inactive|background/) &&
//           appStateRef.current === 'active' &&
//           socket &&
//           user?.userId
//         ) {
//           logEvent('go-offline', 'App.tsx:handleAppStateChange', user.userId)
//           // console.log('Socket in App.tsx go-offline Socket Value:', socket)
//           if (socket) {
//             ;(socket as any).emit('go-offline', user.userId)
//           }
//         }

//         setAppState(nextAppState)
//       }
//     }

//     const subscription = AppState.addEventListener(
//       'change',
//       handleAppStateChange
//     )

//     return () => {
//       subscription.remove()
//     }
//   }, [socket, user?.userId])

//   if (loading || socketLoading) {
//     return <Text>Loading...</Text>
//   }

//   return (
//     <ChatProvider>
//       <NavigationContainer>
//         {user && user.userId ? (
//           <MainStack.Navigator screenOptions={{ presentation: 'modal' }}>
//             <MainStack.Screen
//               name='MainDrawer'
//               component={MainSideDrawer}
//               options={{ headerShown: false }}
//             />
//             <MainStack.Screen
//               name='TabNavigator'
//               options={{ headerShown: false }}
//               children={() => <BottomTabNavigator />}
//             />
//             <MainStack.Screen
//               name='Chat'
//               component={Chat}
//               options={{ title: 'Chat' }}
//             />
//             <MainStack.Screen
//               name='ChatRoom'
//               component={ChatRoom}
//               options={{ title: 'Chat Room' }}
//             />
//           </MainStack.Navigator>
//         ) : (
//           <Stack.Navigator>
//             <Stack.Screen
//               name='Login'
//               component={Login}
//               options={{ headerShown: false }}
//             />
//           </Stack.Navigator>
//         )}
//       </NavigationContainer>
//     </ChatProvider>
//   )
// }

// export default App
