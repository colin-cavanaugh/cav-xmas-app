// /* Keep this ChatBubble component for possible group messages later, it will display the user photo in line with the text so its easier to see who sent it*/
// }
// // const ChatBubble = ({ friend }) => {
// //   return (
// //     <TouchableOpacity style={styles.bubble}>
// //       {friend.photoUrl ? (
// //         <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
// //       ) : (
// //         <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
// //       )}
// //     </TouchableOpacity>
// //   )
// // }

// const ChatDrawer = ({
//   activeChats,
//   setCurrentChatFriend,
//   friend,
//   onClose,
//   chatMessages,
//   addMessageToState,
// }) => {
//   console.log('Render ChatDrawer Component')
//   console.log('Chat Messages', chatMessages)
//   const [message, setMessage] = useState('')
//   // const [chatMessages, setChatMessages] = useState([])
//   const { user } = useUser()
//   const userId = user?.userId
//   const chatId = getChatId(userId, friend._id)
//   const currentMessages = chatMessages[chatId] || []

//   // const socket = useSocket(addMessageToState)
//   const socket = useContext(SocketContext)

//   const sendMessage = () => {
//     const newMessage = {
//       sender: userId,
//       recipient: friend._id,
//       content: message,
//     }

//     // Check if the recipient is online before sending the message
//     if (friend.isOnline) {
//       console.log(`Sending message: ${message} to ${friend.username}`)
//       if (socket) {
//         socket.emit('new-message', newMessage)
//       }
//     } else {
//       // Handle the case where the recipient is offline (e.g., display a notification).
//       console.log(`Recipient ${friend.username} is offline. Message not sent.`)
//       // You can implement logic to store the message and send it later when the recipient is online.
//       // addMessageToQueue(newMessage); // Example: Store the message in a queue.
//     }

//     addMessageToState(newMessage) // Use the function to organize the message
//     setMessage('') // Resetting the input after sending.
//   }

//   // Receiving a message
//   useEffect(() => {
//     if (socket) {
//       socket.on('receive-message', message => {
//         console.log('Received message:', message)
//         // Handle the incoming message.
//         addMessageToState(message) // Use the function to organize the message
//         // TODO: Add notification or pop up the chat window here
//         ToastAndroid.showWithGravity(
//           `New message from ${message.sender}`,
//           ToastAndroid.SHORT,
//           ToastAndroid.CENTER
//         )
//       })

//       return () => {
//         socket.off('receive-message')
//       }
//     }
//   }, [socket])

//   useEffect(() => {
//     console.log('chatMessages changed:', chatMessages)
//   }, [chatMessages])

//   console.log('Current Messages:', currentMessages)
//   return (
//     <View style={styles.chatDrawerContainer}>
//       <TouchableOpacity
//         onPress={onClose}
//         style={{ position: 'absolute', top: 10, right: 10 }}
//       >
//         <Text>X</Text>
//       </TouchableOpacity>

//       {/* <ScrollView horizontal={true} style={styles.bubbleContainer}>
//         {activeChats.map(friend => (
//           <ChatBubble
//             key={friend._id}
//             friend={friend}
//             onClick={setCurrentChatFriend}
//           />
//         ))}
//       </ScrollView> */}

//       <Text>Chat with {friend.username}</Text>
//       <ScrollView>
//         {currentMessages.map((msg, index) => (
//           <View
//             key={index}
//             style={{ flexDirection: 'row', alignItems: 'center' }}
//           >
//             {msg.sender === userId ? (
//               <Text>You: {msg.content}</Text>
//             ) : (
//               <React.Fragment>
//                 {friend.photoUrl ? (
//                   <Image
//                     source={{ uri: friend.photoUrl }}
//                     style={styles.profilePic}
//                   />
//                 ) : (
//                   <DefaultIcon
//                     name='chatbubble-outline'
//                     size={30}
//                     color={'blue'}
//                   />
//                 )}
//                 <Text>
//                   {friend.username}: {msg.content}
//                 </Text>
//               </React.Fragment>
//             )}
//           </View>
//         ))}
//       </ScrollView>
//       <TextInput
//         value={message}
//         onChangeText={setMessage}
//         style={styles.textInput}
//         placeholder='Type a message...'
//       />
//       <Button title='Send' onPress={sendMessage} />
//     </View>
//   )
// }

// I am starting to think instead of the people icon bringing you to three different tabs where onlineoffline friends, pendingrequests, and the addfriend (search bar) functionality lives, the home screen should just contain separate icons for each of these that take you to that component.  That was most of the components are right on the home screen and readily accessible but displayed in a smaller format(the icons) for navigation.  I would have a people icon for the search functionality (the pending requests could also render here if it looks ok with the two together).  Then a chat bubble icon for all of the chat functionality when you receive a new message the count goes up on this chat bubble displaying how many new messages in total you have.  When you press the icon it takes you to your active messages and also displays OnlineOffline users to open new chats with if you'd like.  My App.tsx is quite large but here is the majority of it to compare and decide if this is a good idea for refactoring:
// const Stack = createStackNavigator<RootStackParamList>()
// const Drawer = createDrawerNavigator<RootStackParamList>()

// function CustomDrawerContent(props: DrawerContentComponentProps) {
//   const { user, logout } = useUser()
//   const userId = user?.userId
//   const { friends } = useFriends(userId)

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={{ alignItems: 'center', marginVertical: 20 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
//           Welcome!
//         </Text>
//         <Image
//           source={require('./components/Images/xmas_tree_cartoon.png')} // Replace with the actual image path
//           style={{ width: 80, height: 80, borderRadius: 50 }}
//         />
//         <Text style={{ fontSize: 18, marginTop: 5 }}>{user?.username}</Text>
//       </View>
//       <DrawerItemList {...props} />

//       <DrawerItem
//         label='Logout'
//         onPress={() => {
//           console.log('Logout pressed')
//           logout()
//         }}
//       />
//       {/* Add more DrawerItem here to add more custom items */}
//     </DrawerContentScrollView>
//   )
// }

// function MainSideDrawer() {
//   return (
//     <Drawer.Navigator
//       initialRouteName='Home'
//       screenOptions={{
//         drawerStyle: { width: Dimensions.get('window').width * 0.5 },
//       }}
//       drawerContent={props => <CustomDrawerContent {...props} />}
//     >
//       <Drawer.Screen name='Home' component={Home} />
//       <Drawer.Screen name='Profile' component={Profile} />
//       <Drawer.Screen name='Events' component={Events} />
//     </Drawer.Navigator>
//   )
// }

// const FriendsTab = createBottomTabNavigator<FriendsTabParamList>()

// function FriendsTabNavigator() {
//   return (
//     <FriendsTab.Navigator
//       screenOptions={{
//         tabBarLabel: '',
//         tabBarStyle: { height: 60, justifyContent: 'center' }, // Adjust the height as needed
//         tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
//       }}
//     >
//       <FriendsTab.Screen
//         name='Friends'
//         component={OnlineOffline}
//         initialParams={{
//           friends: [],
//         }}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <UserIcon
//               name='user-check'
//               color={color}
//               size={35}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: [{ translateX: -15 }, { translateY: -15 }],
//               }}
//             />
//           ),
//         }}
//       />
//       <FriendsTab.Screen
//         name='Requests'
//         component={PendingRequests}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <UserIcon
//               name='user-plus'
//               color={color}
//               size={35}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: [{ translateX: -15 }, { translateY: -15 }],
//               }}
//             />
//           ),
//         }}
//       />
//       <FriendsTab.Screen
//         name='Add'
//         component={SearchAddFriends}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Search
//               name='account-search'
//               color={color}
//               size={35}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: [{ translateX: -15 }, { translateY: -15 }],
//               }}
//             />
//           ),
//         }}
//       />
//     </FriendsTab.Navigator>
//   )
// }
// function FriendsButton() {
//   const navigation = useNavigation<StackNavigationProp<MainStackParamList>>()

//   const currentRouteName = useNavigationState(
//     state => state?.routes?.[state.index]?.name
//   )

//   const handlePress = () => {
//     if (currentRouteName === 'FriendsTabsModal') {
//       navigation.goBack()
//     } else {
//       navigation.navigate('FriendsTabsModal')
//     }
//   }

//   return (
//     <TouchableOpacity
//       style={{
//         position: 'absolute',
//         bottom: 675,
//         right: 0,
//         backgroundColor: 'white',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//       }}
//       onPress={handlePress}
//     >
//       <Icon name='people' size={30} color='#607D8B' />
//     </TouchableOpacity>
//   )
// }

// const MainStack = createStackNavigator<MainStackParamList>()
// function App() {
//   const { user, logout, loading } = useUser()
//   const userId = user?.userId
//   const { friends } = useFriends(userId) // Here we get the friends
//   const [appState, setAppState] = useState<AppStateStatus>(
//     AppState.currentState
//   )
//   const socket = useContext(SocketContext)
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState: AppStateStatus) => {
//       if (appState !== nextAppState) {
//         if (nextAppState === 'active') {
//           // Emit go-online when app comes to the foreground
//           if (socket && user?.userId) {
//             ;(socket as any).emit('go-online', user.userId)
//           }
//         } else if (nextAppState.match(/inactive|background/)) {
//           // Emit go-offline when app goes to the background
//           if (socket && user?.userId) {
//             ;(socket as any).emit('go-offline', user.userId)
//           }
//         }
//         // Update the app state
//         setAppState(nextAppState)
//       }
//     }

//     // Add the event listener and get a subscription object back
//     const subscription = AppState.addEventListener(
//       'change',
//       handleAppStateChange
//     )

//     return () => {
//       // Remove the event listener using the subscription object
//       subscription.remove()
//     }
//   }, [appState, socket, user?.userId])

//   // Define the Friend interface
//   interface Friend {
//     _id: string
//     username: string
//     isOnline?: boolean // Assuming isOnline is optional
//   }

//   if (loading) {
//     return <Text>Loading...</Text>
//   }
//   return (
//     <NavigationContainer>
//       {user && user.userId ? (
//         <>
//           <MainStack.Navigator
//             screenOptions={{ presentation: 'modal' }}
//             // headerMode='none'
//           >
//             <MainStack.Screen
//               name='MainDrawer'
//               component={MainSideDrawer}
//               options={{ headerShown: false }}
//             />
//             <MainStack.Screen
//               name='FriendsTabsModal'
//               component={FriendsTabNavigator}
//               options={{
//                 cardStyle: { backgroundColor: 'transparent' }, // This makes modal transparent
//                 cardOverlayEnabled: true, // This renders a semi-transparent overlay below the modal
//                 headerShown: false,
//               }}
//             />
//           </MainStack.Navigator>
//           {/* <NavigateButton /> */}

//           <FriendsButton />
//         </>
//       ) : (
//         <Stack.Navigator>
//           <Stack.Screen
//             name='Login'
//             component={Login}
//             options={{ headerShown: false }}
//           />
//         </Stack.Navigator>
//       )}
//     </NavigationContainer>
//   )
// }

// ChatGPT
// Your app seems to have grown complex, which is typical as you add more features. Refactoring is always good to improve maintainability and scalability, and it's an ongoing process.

// Considering your aim to implement notifications for chat messages and based on the code you've shared, here's a high-level plan for a refactor:

// Chat Notifications Icon:

// Create a ChatNotificationIcon component that you'll place on your Home screen (or wherever you want it to be globally accessible).
// This component should have:
// A chat icon
// A badge that displays the count of new messages.
// Global Message State:

// You can utilize React's context system or use a state management library like Redux. You'll want a global state to keep track of the total number of new messages, so the ChatNotificationIcon can access and display the count.
// Each time a new message is received (handled in the ChatDrawer component's useEffect that listens for 'receive-message'), increment this global count.
// Each time a user views their messages, reset this count to zero.
// Refactor Navigation:

// Given your idea of having separate icons for different functionalities on the home screen, it might make navigation more user-friendly and intuitive.
// By doing so, each functionality is directly accessible, reducing the steps a user needs to take.
// Adjust your NavigationContainer and the relevant navigator configurations accordingly.
// Improve the ChatDrawer:

// As you've started working on a ChatBubble component for group messages, you can also consider having a similar bubble for individual chats. When a message is received, this bubble can 'pop' to attract attention.
// Consider showing an online/offline status for each chat in the list. This can give users a visual cue about the friend's current status.
// Optimize App.tsx:

// To avoid having an overly large App.tsx, consider modularizing your code. For instance, your navigation could be split into its own component or file. Same goes for providers or any significant chunk of code.
// Handle Offline Messaging:

// Currently, if the recipient is offline, the message isn't sent. Consider implementing a system where the message is saved server-side and delivered when the recipient comes online.
// Performance:

// With your app growing, keep an eye on performance. The more useEffect hooks and listeners you have, the more potential there is for performance issues. Always clean up listeners in the cleanup function of useEffect to avoid potential memory leaks.
// If your list of chats or messages grows large, consider implementing virtualized lists using React Native's FlatList for better performance.
// Testing:

// With these changes, ensure you have testing in place. This can be unit tests, integration tests, or end-to-end tests to ensure the refactoring didn't introduce new bugs.
// Finally, while the above suggestions might be ideal for your current state, always keep in mind the future of your application. Are there any features you might want to add later? Plan for those in advance to ensure your refactoring efforts now will still be relevant down the line.

// User
// thank you, to start, can you help me clean up the App.tsx file into a more containable component.  I can separate navigation like you said if you wouldnt mind showing me the most efficient way:
// import 'react-native-gesture-handler'
// import React, { useState, useEffect, useContext } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Alert,
//   Dimensions,
// } from 'react-native'
// import {
//   NavigationContainer,
//   useNavigation,
//   useRoute,
//   RouteProp,
//   useNavigationState,
// } from '@react-navigation/native'
// import { createStackNavigator } from '@react-navigation/stack'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import {
//   createDrawerNavigator,
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem,
//   DrawerContentComponentProps,
// } from '@react-navigation/drawer'

// // import Icon from 'react-native-vector-icons/Ionicons.js'
// import Icon from 'react-native-vector-icons/Octicons.js'
// import Search from 'react-native-vector-icons/MaterialCommunityIcons.js'
// import UserIcon from 'react-native-vector-icons/Feather.js'
// import { useUser } from './components/API/AuthService.js'
// import { StackNavigationProp } from '@react-navigation/stack'

// // Components
// import Login from './components/Login/Login'
// import Home from './components/Home/Home'
// import Profile from './components/Profile/Profile'
// import Events from './components/Events/Events.js'
// import OnlineOffline from './components/Friends/OnlineOffline.js'
// import PendingRequests from './components/Friends/PendingRequests.js'
// import SearchAddFriends from './components/Friends/SearchAddFriends.js'
// // import AddFriends from './components/Friends/AddFriends.js'
// import SocialDrawer from './components/Social/SocialDrawer.js'
// import ChatDrawer from './components/Social/ChatDrawer.js'
// // import BottomTabNavigator from './components/Social/BottomTabNavigator.js'
// import { useFriends } from './components/Friends/UseFriends.js'
// // import useSocket from './components/Socket/useSocket.js'
// import NavigateButton from './components/Navigation/NavigateButton.js'
// import SocketProvider from './components/API/SocketProvider.js'
// import SocketContext from './components/API/SocketContext.js'
// import io from 'socket.io-client'
// import { AppState, AppStateStatus } from 'react-native'

// type RootStackParamList = {
//   Home: undefined
//   Profile: undefined
//   AddFriends: undefined
//   Events: undefined
//   Details: { itemId: number }
//   Login: undefined
//   FriendsNav: undefined
//   Drawer: undefined
// }
// type MainStackParamList = {
//   MainDrawer: undefined
//   FriendsTabsModal: undefined
// }
// type FriendsButtonProps = {
//   navigation: StackNavigationProp<MainStackParamList>
// }
// export type FriendsScreenParams = {
//   friends: any // or the appropriate type
// }

// export type FriendsTabParamList = {
//   Friends: {
//     friends: any // Replace 'any' with the appropriate type if available
//   }
//   Requests: undefined
//   Add: undefined
//   // Add other screens' params here if needed
// }
// const Stack = createStackNavigator<RootStackParamList>()
// const Drawer = createDrawerNavigator<RootStackParamList>()

// function CustomDrawerContent(props: DrawerContentComponentProps) {
//   const { user, logout } = useUser()
//   const userId = user?.userId
//   const { friends } = useFriends(userId)

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={{ alignItems: 'center', marginVertical: 20 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
//           Welcome!
//         </Text>
//         <Image
//           source={require('./components/Images/xmas_tree_cartoon.png')} // Replace with the actual image path
//           style={{ width: 80, height: 80, borderRadius: 50 }}
//         />
//         <Text style={{ fontSize: 18, marginTop: 5 }}>{user?.username}</Text>
//       </View>
//       <DrawerItemList {...props} />

//       <DrawerItem
//         label='Logout'
//         onPress={() => {
//           console.log('Logout pressed')
//           logout()
//         }}
//       />
//       {/* Add more DrawerItem here to add more custom items */}
//     </DrawerContentScrollView>
//   )
// }

// function MainSideDrawer() {
//   return (
//     <Drawer.Navigator
//       initialRouteName='Home'
//       screenOptions={{
//         drawerStyle: { width: Dimensions.get('window').width * 0.5 },
//       }}
//       drawerContent={props => <CustomDrawerContent {...props} />}
//     >
//       <Drawer.Screen name='Home' component={Home} />
//       <Drawer.Screen name='Profile' component={Profile} />
//       <Drawer.Screen name='Events' component={Events} />
//     </Drawer.Navigator>
//   )
// }

// const FriendsTab = createBottomTabNavigator<FriendsTabParamList>()

// function FriendsTabNavigator() {
//   return (
//     <FriendsTab.Navigator
//       screenOptions={{
//         tabBarLabel: '',
//         tabBarStyle: { height: 60, justifyContent: 'center' }, // Adjust the height as needed
//         tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
//       }}
//     >
//       <FriendsTab.Screen
//         name='Friends'
//         component={OnlineOffline}
//         initialParams={{
//           friends: [],
//         }}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <UserIcon
//               name='user-check'
//               color={color}
//               size={35}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: [{ translateX: -15 }, { translateY: -15 }],
//               }}
//             />
//           ),
//         }}
//       />
//       <FriendsTab.Screen
//         name='Requests'
//         component={PendingRequests}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <UserIcon
//               name='user-plus'
//               color={color}
//               size={35}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: [{ translateX: -15 }, { translateY: -15 }],
//               }}
//             />
//           ),
//         }}
//       />
//       <FriendsTab.Screen
//         name='Add'
//         component={SearchAddFriends}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <Search
//               name='account-search'
//               color={color}
//               size={35}
//               style={{
//                 position: 'absolute',
//                 top: '50%',
//                 left: '50%',
//                 transform: [{ translateX: -15 }, { translateY: -15 }],
//               }}
//             />
//           ),
//         }}
//       />
//     </FriendsTab.Navigator>
//   )
// }
// function FriendsButton() {
//   const navigation = useNavigation<StackNavigationProp<MainStackParamList>>()

//   const currentRouteName = useNavigationState(
//     state => state?.routes?.[state.index]?.name
//   )

//   const handlePress = () => {
//     if (currentRouteName === 'FriendsTabsModal') {
//       navigation.goBack()
//     } else {
//       navigation.navigate('FriendsTabsModal')
//     }
//   }

//   return (
//     <TouchableOpacity
//       style={{
//         position: 'absolute',
//         bottom: 675,
//         right: 0,
//         backgroundColor: 'white',
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//       }}
//       onPress={handlePress}
//     >
//       <Icon name='people' size={30} color='#607D8B' />
//     </TouchableOpacity>
//   )
// }

// const MainStack = createStackNavigator<MainStackParamList>()
// function App() {
//   const { user, logout, loading } = useUser()
//   const userId = user?.userId
//   const { friends } = useFriends(userId) // Here we get the friends
//   const [appState, setAppState] = useState<AppStateStatus>(
//     AppState.currentState
//   )
//   const socket = useContext(SocketContext)
//   useEffect(() => {
//     const handleAppStateChange = (nextAppState: AppStateStatus) => {
//       if (appState !== nextAppState) {
//         if (nextAppState === 'active') {
//           // Emit go-online when app comes to the foreground
//           if (socket && user?.userId) {
//             ;(socket as any).emit('go-online', user.userId)
//           }
//         } else if (nextAppState.match(/inactive|background/)) {
//           // Emit go-offline when app goes to the background
//           if (socket && user?.userId) {
//             ;(socket as any).emit('go-offline', user.userId)
//           }
//         }
//         // Update the app state
//         setAppState(nextAppState)
//       }
//     }

//     // Add the event listener and get a subscription object back
//     const subscription = AppState.addEventListener(
//       'change',
//       handleAppStateChange
//     )

//     return () => {
//       // Remove the event listener using the subscription object
//       subscription.remove()
//     }
//   }, [appState, socket, user?.userId])

//   // Define the Friend interface
//   interface Friend {
//     _id: string
//     username: string
//     isOnline?: boolean // Assuming isOnline is optional
//   }

//   if (loading) {
//     return <Text>Loading...</Text>
//   }
//   return (
//     <NavigationContainer>
//       {user && user.userId ? (
//         <>
//           <MainStack.Navigator
//             screenOptions={{ presentation: 'modal' }}
//             // headerMode='none'
//           >
//             <MainStack.Screen
//               name='MainDrawer'
//               component={MainSideDrawer}
//               options={{ headerShown: false }}
//             />
//             <MainStack.Screen
//               name='FriendsTabsModal'
//               component={FriendsTabNavigator}
//               options={{
//                 cardStyle: { backgroundColor: 'transparent' }, // This makes modal transparent
//                 cardOverlayEnabled: true, // This renders a semi-transparent overlay below the modal
//                 headerShown: false,
//               }}
//             />
//           </MainStack.Navigator>
//           {/* <NavigateButton /> */}

//           <FriendsButton />
//         </>
//       ) : (
//         <Stack.Navigator>
//           <Stack.Screen
//             name='Login'
//             component={Login}
//             options={{ headerShown: false }}
//           />
//         </Stack.Navigator>
//       )}
//     </NavigationContainer>
//   )
// }

// export default App
// ChatGPT
// Alright, let's start by separating your code into smaller, more manageable pieces. Given the nature of React-Native with React Navigation, a lot of this is concerned with navigation structures.

// 1. Refactor Navigation:

// A common practice is to separate out your navigation into its own module. This can include the Stack, Drawer, and Tabs navigators.

// 1.1. RootNavigation.tsx:

// tsx
// Copy code
// // RootNavigation.tsx
// import {
//   createStackNavigator,
//   StackNavigationProp,
// } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';

// // Your imports ...

// export const Stack = createStackNavigator<RootStackParamList>();
// export const Drawer = createDrawerNavigator<RootStackParamList>();
// export const FriendsTab = createBottomTabNavigator<FriendsTabParamList>();

// // ... Rest of your components related to navigation ...

// export default function RootNavigation() {
//   const { user, logout, loading } = useUser();

//   // Rest of your logic ...

//   return (
//     <NavigationContainer>
//       {/* Your Navigator structure */}
//     </NavigationContainer>
//   );
// }
// 1.2. CustomDrawerContent.tsx:

// tsx
// Copy code
// // CustomDrawerContent.tsx
// import {
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem,
//   DrawerContentComponentProps,
// } from '@react-navigation/drawer';
// import React from 'react';

// // Your other imports ...

// export default function CustomDrawerContent(props: DrawerContentComponentProps) {
//   // The code for your drawer content ...
// }
// 2. Create a separate file for each custom component:

// For example:

// 2.1. MainSideDrawer.tsx:

// tsx
// Copy code
// // MainSideDrawer.tsx
// import React from 'react';
// import { Drawer } from './RootNavigation';

// export default function MainSideDrawer() {
//   // Your drawer structure...
// }
// 2.2. FriendsButton.tsx:

// tsx
// Copy code
// // FriendsButton.tsx
// import React from 'react';
// import { useNavigation, useNavigationState } from '@react-navigation/native';

// export default function FriendsButton() {
//   // Your button component ...
// }
// 2.3. Repeat for FriendsTabNavigator and other reusable components.

// 3. Use the Components in the Main App.tsx file:

// Your main App.tsx becomes:

// tsx
// Copy code
// import React from 'react';
// import RootNavigation from './navigation/RootNavigation';

// function App() {
//   return <RootNavigation />;
// }

// export default App;
// This is a rough breakdown, and you might need to adjust things based on your project's requirements, but this approach keeps your code modular and easier to manage. You can always enhance and optimize as needed.

// User
// const [notifications, setNotifications] = useState({});

// {
//   "userId1": 3, // 3 unread messages from userId1
//   "userId2": 5  // 5 unread messages from userId2
// }

// function handleMessageReceived(message) {
//   if (message.sender !== activeChatUser) { // or however you track the active chat
//     setNotifications(prev => ({
//       ...prev,
//       [message.sender]: (prev[message.sender] || 0) + 1
//     }));
//   }
// }
// const totalUnread = Object.values(notifications).reduce((acc, curr) => acc + curr, 0);

// function handleChatOpened(userId) {
//   setNotifications(prev => {
//     const newNotifications = { ...prev };
//     delete newNotifications[userId];
//     return newNotifications;
//   });
// }
// // For each user with notifications
// notifications.map((userId, count) => (
//   <ChatBubble userId={userId} count={count} />
// ))

// For this functionality you mentioned earlier, can I refactor the ChatDrawer to use it for now and test if this method works good or not before refactoring everything in the app?
// here is ChatDrawer:
// import React, { useState, useEffect, useContext } from 'react'
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Image,
//   ToastAndroid,
// } from 'react-native'
// // import useSocket from '../Socket/useSocket'
// import { useUser } from '../API/AuthService'
// import { getChatId } from '../utility/utility'
// import DefaultIcon from 'react-native-vector-icons/Ionicons'
// import SocketContext from '../API/SocketContext'

// {
//   /* Keep this ChatBubble component for possible group messages later, it will display the user photo in line with the text so its easier to see who sent it*/
// }
// // const ChatBubble = ({ friend }) => {
// //   return (
// //     <TouchableOpacity style={styles.bubble}>
// //       {friend.photoUrl ? (
// //         <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
// //       ) : (
// //         <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
// //       )}
// //     </TouchableOpacity>
// //   )
// // }

// const ChatDrawer = ({
//   activeChats,
//   setCurrentChatFriend,
//   friend,
//   onClose,
//   chatMessages,
//   addMessageToState,
// }) => {
//   console.log('Render ChatDrawer Component')
//   console.log('Chat Messages', chatMessages)
//   const [message, setMessage] = useState('')
//   // const [chatMessages, setChatMessages] = useState([])
//   const { user } = useUser()
//   const userId = user?.userId
//   const chatId = getChatId(userId, friend._id)
//   const currentMessages = chatMessages[chatId] || []

//   // const socket = useSocket(addMessageToState)
//   const socket = useContext(SocketContext)

//   const sendMessage = () => {
//     const newMessage = {
//       sender: userId,
//       recipient: friend._id,
//       content: message,
//     }

//     // Check if the recipient is online before sending the message
//     if (friend.isOnline) {
//       console.log(`Sending message: ${message} to ${friend.username}`)
//       if (socket) {
//         socket.emit('new-message', newMessage)
//       }
//     } else {
//       // Handle the case where the recipient is offline (e.g., display a notification).
//       console.log(`Recipient ${friend.username} is offline. Message not sent.`)
//       // You can implement logic to store the message and send it later when the recipient is online.
//       // addMessageToQueue(newMessage); // Example: Store the message in a queue.
//     }

//     addMessageToState(newMessage) // Use the function to organize the message
//     setMessage('') // Resetting the input after sending.
//   }

//   // Receiving a message
//   useEffect(() => {
//     if (socket) {
//       socket.on('receive-message', message => {
//         console.log('Received message:', message)
//         // Handle the incoming message.
//         addMessageToState(message) // Use the function to organize the message
//         // TODO: Add notification or pop up the chat window here
//         ToastAndroid.showWithGravity(
//           `New message from ${message.sender}`,
//           ToastAndroid.SHORT,
//           ToastAndroid.CENTER
//         )
//       })

//       return () => {
//         socket.off('receive-message')
//       }
//     }
//   }, [socket])

//   useEffect(() => {
//     console.log('chatMessages changed:', chatMessages)
//   }, [chatMessages])

//   console.log('Current Messages:', currentMessages)
//   return (
//     <View style={styles.chatDrawerContainer}>
//       <TouchableOpacity
//         onPress={onClose}
//         style={{ position: 'absolute', top: 10, right: 10 }}
//       >
//         <Text>X</Text>
//       </TouchableOpacity>

//       {/* <ScrollView horizontal={true} style={styles.bubbleContainer}>
//         {activeChats.map(friend => (
//           <ChatBubble
//             key={friend._id}
//             friend={friend}
//             onClick={setCurrentChatFriend}
//           />
//         ))}
//       </ScrollView> */}

//       <Text>Chat with {friend.username}</Text>
//       <ScrollView>
//         {currentMessages.map((msg, index) => (
//           <View
//             key={index}
//             style={{ flexDirection: 'row', alignItems: 'center' }}
//           >
//             {msg.sender === userId ? (
//               <Text>You: {msg.content}</Text>
//             ) : (
//               <React.Fragment>
//                 {friend.photoUrl ? (
//                   <Image
//                     source={{ uri: friend.photoUrl }}
//                     style={styles.profilePic}
//                   />
//                 ) : (
//                   <DefaultIcon
//                     name='chatbubble-outline'
//                     size={30}
//                     color={'blue'}
//                   />
//                 )}
//                 <Text>
//                   {friend.username}: {msg.content}
//                 </Text>
//               </React.Fragment>
//             )}
//           </View>
//         ))}
//       </ScrollView>
//       <TextInput
//         value={message}
//         onChangeText={setMessage}
//         style={styles.textInput}
//         placeholder='Type a message...'
//       />
//       <Button title='Send' onPress={sendMessage} />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   chatDrawerContainer: {
//     flex: 1,
//     flexDirection: 'column',
//     width: '100%',
//     backgroundColor: 'white',
//     padding: 10,
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   textInput: {
//     padding: 10,
//     borderColor: 'black',
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   bubbleContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#e1e8ee',
//   },
//   bubble: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   chatBubble: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//     // ... other styles as needed
//   },
//   profilePic: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
// })

// export default ChatDrawer
// ChatGPT
// Certainly! We can integrate the notification functionality into your ChatDrawer component. Here's how we can proceed:

// Integrate the State: To maintain the unread notifications state in ChatDrawer, we'll add the notifications state from the previous logic. This will keep track of how many unread messages are there from each user.

// Update Notification on Message Reception: The handleMessageReceived function can be incorporated into the receive-message socket event.

// Clearing Notifications on Chat Open: When a chat with a user is opened, we should clear the unread message count for that user. We can integrate handleChatOpened function for this.

// Displaying the Notifications: Instead of rendering ChatBubble directly for each user, we can conditionally render a notification count badge beside their name or picture if there are unread messages.

// Here's a potential implementation with the changes:

// javascript
// Copy code
// // ... previous imports ...

// // State to maintain unread notifications
// const [notifications, setNotifications] = useState({});

// // Function to handle received messages
// function handleMessageReceived(message) {
//   if (message.sender !== friend._id) {
//     setNotifications(prev => ({
//       ...prev,
//       [message.sender]: (prev[message.sender] || 0) + 1
//     }));
//   }
// }

// // ... other code ...

// // Receiving a message
// useEffect(() => {
//   if (socket) {
//     socket.on('receive-message', message => {
//       console.log('Received message:', message);

//       // Handle the incoming message
//       addMessageToState(message);
//       handleMessageReceived(message);

//       ToastAndroid.showWithGravity(
//         `New message from ${message.sender}`,
//         ToastAndroid.SHORT,
//         ToastAndroid.CENTER
//       );
//     });

//     return () => {
//       socket.off('receive-message');
//     }
//   }
// }, [socket]);

// // Whenever the active chat changes, we reset the notifications for that user.
// useEffect(() => {
//   handleChatOpened(friend._id);
// }, [friend]);

// // ... other code ...

// // When rendering a chat message, we can conditionally render the unread count
// return (
//   <View style={styles.chatDrawerContainer}>
//     {/* ... other components ... */}

//     <ScrollView>
//       {activeChats.map(chatFriend => (
//         <TouchableOpacity
//           key={chatFriend._id}
//           onPress={() => {
//             setCurrentChatFriend(chatFriend);
//             handleChatOpened(chatFriend._id);
//           }}
//         >
//           {/* Your ChatBubble component here */}
//           {notifications[chatFriend._id] && <Text style={{color: 'red'}}>{notifications[chatFriend._id]}</Text>}
//         </TouchableOpacity>
//       ))}
//     </ScrollView>

//     {/* ... other components ... */}
//   </View>
// );

// // ... rest of the code ...
// Note: The above code assumes activeChats is an array of chat friends with properties like _id. Adjust accordingly if that's not the case.

// With these changes, you should see a red number beside chat friends' names indicating unread messages. Adjust the styling and positioning of the unread count as necessary.

// Testing this implementation in a smaller scope, like ChatDrawer, before propagating the changes to the entire app is a prudent approach. If it works well, you can consider integrating this functionality in other parts of the app.

// User
// does this look ok? when sending messages I wasnt seeing anything render currently:
// import React, { useState, useEffect, useContext } from 'react'
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Image,
//   ToastAndroid,
// } from 'react-native'
// // import useSocket from '../Socket/useSocket'
// import { useUser } from '../API/AuthService'
// import { getChatId } from '../utility/utility'
// import DefaultIcon from 'react-native-vector-icons/Ionicons'
// import SocketContext from '../API/SocketContext'

// {
//   /* Keep this ChatBubble component for possible group messages later, it will display the user photo in line with the text so its easier to see who sent it*/
// }
// // const ChatBubble = ({ friend }) => {
// //   return (
// //     <TouchableOpacity style={styles.bubble}>
// //       {friend.photoUrl ? (
// //         <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
// //       ) : (
// //         <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
// //       )}
// //     </TouchableOpacity>
// //   )
// // }

// const ChatDrawer = ({
//   activeChats,
//   setCurrentChatFriend,
//   friend,
//   onClose,
//   chatMessages,
//   addMessageToState,
// }) => {
//   console.log('Render ChatDrawer Component')
//   console.log('Chat Messages', chatMessages)
//   const [message, setMessage] = useState('')
//   // const [chatMessages, setChatMessages] = useState([])
//   const { user } = useUser()
//   const userId = user?.userId
//   const chatId = getChatId(userId, friend._id)
//   const currentMessages = chatMessages[chatId] || []

//   // const socket = useSocket(addMessageToState)
//   const socket = useContext(SocketContext)

//   const sendMessage = () => {
//     const newMessage = {
//       sender: userId,
//       recipient: friend._id,
//       content: message,
//     }

//     // Check if the recipient is online before sending the message
//     if (friend.isOnline) {
//       console.log(`Sending message: ${message} to ${friend.username}`)
//       if (socket) {
//         socket.emit('new-message', newMessage)
//       }
//     } else {
//       // Handle the case where the recipient is offline (e.g., display a notification).
//       console.log(`Recipient ${friend.username} is offline. Message not sent.`)
//       // You can implement logic to store the message and send it later when the recipient is online.
//       // addMessageToQueue(newMessage); // Example: Store the message in a queue.
//     }

//     addMessageToState(newMessage) // Use the function to organize the message
//     setMessage('') // Resetting the input after sending.
//   }
//   const [notifications, setNotifications] = useState({})

//   // Function to handle received messages
//   function handleMessageReceived(message) {
//     if (message.sender !== friend._id) {
//       setNotifications(prev => ({
//         ...prev,
//         [message.sender]: (prev[message.sender] || 0) + 1,
//       }))
//     }
//   }
//   // Receiving a message
//   useEffect(() => {
//     if (socket) {
//       socket.on('receive-message', message => {
//         console.log('Received message:', message)

//         // Handle the incoming message
//         addMessageToState(message)
//         handleMessageReceived(message)

//         ToastAndroid.showWithGravity(
//           `New message from ${message.sender}`,
//           ToastAndroid.SHORT,
//           ToastAndroid.CENTER
//         )
//       })

//       return () => {
//         socket.off('receive-message')
//       }
//     }
//   }, [socket])

//   useEffect(() => {
//     console.log('chatMessages changed:', chatMessages)
//   }, [chatMessages])

//   console.log('Current Messages:', currentMessages)
//   return (
//     <View style={styles.chatDrawerContainer}>
//       <TouchableOpacity
//         onPress={onClose}
//         style={{ position: 'absolute', top: 10, right: 10 }}
//       >
//         <Text>X</Text>
//       </TouchableOpacity>

//       {/* <ScrollView horizontal={true} style={styles.bubbleContainer}>
//         {activeChats.map(friend => (
//           <ChatBubble
//             key={friend._id}
//             friend={friend}
//             onClick={setCurrentChatFriend}
//           />
//         ))}
//       </ScrollView> */}
//       <ScrollView>
//         {activeChats.map(chatFriend => (
//           <TouchableOpacity
//             key={chatFriend._id}
//             onPress={() => {
//               setCurrentChatFriend(chatFriend)
//               handleChatOpened(chatFriend._id)
//             }}
//           >
//             {/* Your ChatBubble component here */}
//             {notifications[chatFriend._id] && (
//               <Text style={{ color: 'red' }}>
//                 {notifications[chatFriend._id]}
//               </Text>
//             )}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <Text>Chat with {friend.username}</Text>
//       <ScrollView>
//         {currentMessages.map((msg, index) => (
//           <View
//             key={index}
//             style={{ flexDirection: 'row', alignItems: 'center' }}
//           >
//             {msg.sender === userId ? (
//               <Text>You: {msg.content}</Text>
//             ) : (
//               <React.Fragment>
//                 {friend.photoUrl ? (
//                   <Image
//                     source={{ uri: friend.photoUrl }}
//                     style={styles.profilePic}
//                   />
//                 ) : (
//                   <DefaultIcon
//                     name='chatbubble-outline'
//                     size={30}
//                     color={'blue'}
//                   />
//                 )}
//                 <Text>
//                   {friend.username}: {msg.content}
//                 </Text>
//               </React.Fragment>
//             )}
//           </View>
//         ))}
//       </ScrollView>
//       <TextInput
//         value={message}
//         onChangeText={setMessage}
//         style={styles.textInput}
//         placeholder='Type a message...'
//       />
//       <Button title='Send' onPress={sendMessage} />
//     </View>
//   )
// }
// ChatGPT
// Your refactored code seems to be logically structured, and you have implemented the notifications feature for the chat. Here are a few things to consider:

// Logging:

// You've added a lot of console.log calls which are great for debugging, but they can clutter up your console over time. Once you confirm that parts of your code are working as expected, it might be a good idea to clean them up.
// Offline Handling:

// In your sendMessage function, you check if the friend is online before sending the message. If the friend isn't online, you currently only log this information. Depending on your backend setup, you might still want to send this message to the server, and the server can handle delivering it when the friend is online.
// Notifications:

// The way you handle notifications is clear and concise. It checks if the received message is from the currently active chat user, and if not, it increments the notification for that user. This is a simple and effective method. But, you should add a function handleChatOpened to reset the notification counter:
// javascript
// Copy code
// function handleChatOpened(userId) {
//   setNotifications(prev => {
//     const newNotifications = { ...prev };
//     delete newNotifications[userId];
//     return newNotifications;
//   });
// }
// Chat List:

// I see you've implemented a scroll view for the active chats. This is a good structure to allow users to scroll through their chats and see unread message counts.
// Reactivity:

// If you're not seeing messages render as expected, you might want to check a couple of things:
// Ensure addMessageToState updates the chatMessages state correctly.
// Ensure that the chatMessages state is being passed down correctly from the parent component.
// Check if the SocketContext is emitting and receiving messages correctly.
// Styling & Components:

// Don't forget to bring back the chat bubble component when you're ready. You've commented it out, but it's a good idea to have it for future group chats or even for individual chats.
// Dependency Array in useEffect:

// For the useEffect where you listen to the 'receive-message' event, the dependency array only includes socket. It would be a good idea to also add addMessageToState and handleMessageReceived to the dependency array to ensure that these functions' most recent instances are used.
// Lastly, once these changes are done, it's always a good idea to thoroughly test the component by simulating various scenarios like receiving a message when the chat is active, when it's not active, sending a message, etc.

// Keep up the good work!

// User
// looks like the addMessagesToState are getting logged and updated:
// INFO  [INFO][addMessageToState] Received message from 64fdec515f8348e521ce502a to 64ebd1f152e9cd6101f4bd8c
//  INFO  [INFO][addMessageToState] Generated chatId: 64ebd1f152e9cd6101f4bd8c-64fdec515f8348e521ce502a
//  INFO  [INFO][addMessageToState] Previous messages for chatId 64ebd1f152e9cd6101f4bd8c-64fdec515f8348e521ce502a: [{"sender":"64fdec515f8348e521ce502a","recipient":"64ebd1f152e9cd6101f4bd8c","content":"Hey"}]
//  INFO  [INFO][addMessageToState] New messages for chatId 64ebd1f152e9cd6101f4bd8c-64fdec515f8348e521ce502a: [{"sender":"64fdec515f8348e521ce502a","recipient":"64ebd1f152e9cd6101f4bd8c","content":"Hey"},{"sender":"64fdec515f8348e521ce502a","recipient":"64ebd1f152e9cd6101f4bd8c","content":"Hey"}]
//  INFO  [INFO][addMessageToState] Updated chatMessages state: {"64ebd1f152e9cd6101f4bd8c-64fdec515f8348e521ce502a":[{"sender":"64fdec515f8348e521ce502a","recipient":"64ebd1f152e9cd6101f4bd8c","content":"Hey"},{"sender":"64fdec515f8348e521ce502a","recipient":"64ebd1f152e9cd6101f4bd8c","content":"Hey"}]}
//  LOG  Render ChatDrawer Component
//  LOG  Chat Messages {"64ebd1f152e9cd6101f4bd8c-64fdec515f8348e521ce502a": [{"content": "Hey", "recipient": "64ebd1f152e9cd6101f4bd8c", "sender": "64fdec515f8348e521ce502a"}, {"content": "Hey", "recipient": "64ebd1f152e9cd6101f4bd8c", "sender": "64fdec515f8348e521ce502a"}]}
//  LOG  Current Messages: [{"content": "Hey", "recipient": "64ebd1f152e9cd6101f4bd8c", "sender": "64fdec515f8348e521ce502a"}, {"content": "Hey", "recipient": "64ebd1f152e9cd6101f4bd8c", "sender": "64fdec515f8348e521ce502a"}]

// However when uploading a profile photo for User B I am getting a warning, is it possible this could be causing inefficient socket connections?
// Possible Unhandled Promise Rejection (id: 1):
// ReferenceError: Property 'context' doesn't exist
// ReferenceError: Property 'context' doesn't exist
//     at handleUserOnline (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:175279:19)
//     at apply (native)
//     at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:189870:27)
//     at apply (native)
//     at emitEvent (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:192923:180)
//     at onevent (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:192909:25)
//     at onpacket (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:192875:25)
//     at apply (native)
//     at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:189870:27)
//     at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:188484:30)
//     at tryCallOne (/root/react-native/packages/react-native/ReactAndroid/hermes-engine/.cxx/Release/2sw813f4/arm64-v8a/lib/InternalBytecode/InternalBytecode.js:53:16)
//     at anonymous (/root/react-native/packages/react-native/ReactAndroid/hermes-engine/.cxx/Release/2sw813f4/arm64-v8a/lib/InternalBytecode/InternalBytecode.js:139:27)
//     at apply (native)
//     at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:35019:26)
//     at _callTimer (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:34898:17)
//     at _callReactNativeMicrotasksPass (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:34943:17)
//     at callReactNativeMicrotasks (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:35149:44)
//     at __callReactNativeMicrotasks (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:6060:46)
//     at anonymous (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:5834:45)
//     at __guard (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:6033:15)
//     at flushedQueue (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runModule=true:5833:21)
//     at callFunctionReturnFlushedQueue (http://localhost:8081/index.bundle//&platform=android&dev=true&minify=false&app=com.colinmobilexmas&modulesOnly=false&runMod

// just to clarify, the photo is uploading and displaying correctly
// ChatGPT
// The two issues you've brought up seem to be distinct:

// Chat Messages Rendering: From the logs you provided, it appears that the messages are indeed being updated correctly. If you aren't seeing the messages rendered in the component as expected, you should ensure that the relevant parts of the component re-render when the state changes. The logs indicate that they are being logged correctly.

// Profile Photo Warning: The warning ReferenceError: Property 'context' doesn't exist suggests that there's an attempt to access a property named context somewhere in the code which is not defined. It's hard to pin down the exact issue without seeing the complete code, but there are some areas to investigate:

// Event Handler: The error appears to originate from the handleUserOnline function. This function seems to be an event handler for when a user comes online. You should examine this function to see where it's attempting to access the context property and ensure it's correctly defined.

// Socket Event Binding: The stack trace indicates this issue occurs during a socket event. Check the area in your code where you're binding socket events (especially the 'user online' type events) and ensure that all the event handlers have the correct context, or that all variables and properties they attempt to access are available in their scope.

// Context API Misuse: If you're using the React Context API somewhere in relation to this feature, ensure that you're using it correctly. For instance, make sure you're wrapping the relevant parts of your app in the provider and that you're accessing the context value correctly in consumer components.

// The profile photo warning is unlikely to be directly related to the socket connections unless the handleUserOnline function or a related function is making socket connections or emissions. However, unhandled promise rejections or errors can cause unexpected behaviors or inefficiencies in other parts of the app.

// For a more precise diagnosis and solution, you would need to provide the relevant portions of code where the error originates (handleUserOnline function, any related socket event bindings, etc.).

// User
// this functionality is contained in OnlineOffline component:
// import React, { useState, useEffect, useCallback, useContext } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ToastAndroid,
//   StyleSheet,
//   Image,
// } from 'react-native' // Imported Alert
// import { useUser } from '../API/AuthService.js'
// import { useFriends } from './UseFriends.js'
// import ChatDrawer from '../Social/ChatDrawer.js'
// import DefaultIcon from 'react-native-vector-icons/Ionicons'
// // import useSocket from '../Socket/useSocket.js'
// import { getChatId } from '../utility/utility.js'
// import SocketContext from '../API/SocketContext.js'

// const OnlineOfflineFriends = () => {
//   const { user } = useUser()
//   const userId = user?.userId
//   const { friends } = useFriends(userId)

//   const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)
//   const [currentChatFriend, setCurrentChatFriend] = useState(null)
//   const [activeChats, setActiveChats] = useState([])
//   const [chatMessages, setChatMessages] = useState({})
//   const [friendList, setFriendList] = useState([])
//   const socket = useContext(SocketContext)

//   useEffect(() => {
//     if (friends && friends.length > 0) {
//       setFriendList(friends)
//     }
//   }, [friends])
//   const openChat = friend => {
//     // Alert.alert('Chat Opened', `Now chatting with ${friend.username}`)
//     ToastAndroid.showWithGravity(
//       `Chat Opened with ${friend.username}`,
//       ToastAndroid.SHORT,
//       ToastAndroid.CENTER
//     )
//     console.log('Friend Pressed: ', friend)
//     const isChatActive = activeChats.find(chat => chat._id === friend._id)

//     if (!isChatActive) {
//       // If not, add the friend to the active chats.
//       setActiveChats([...activeChats, friend])
//     }

//     setCurrentChatFriend(friend)
//     console.log('Current Chat Friend: ', currentChatFriend)
//     setChatDrawerOpen(true)
//   }
//   const closeChat = () => {
//     setCurrentChatFriend(null)
//     setChatDrawerOpen(false)
//   }
//   const logInfo = (context, message) => {
//     console.info(`[INFO][${context}] ${message}`)
//   }

//   const logError = (context, message) => {
//     console.error(`[ERROR][${context}] ${message}`)
//   }
//   const addMessageToState = useCallback(message => {
//     const context = 'addMessageToState'
//     logInfo(
//       context,
//       `Received message from ${message.sender} to ${message.recipient}`
//     )

//     // Update this line to use both sender and recipient from the message
//     const chatId = getChatId(message.sender, message.recipient)
//     logInfo(context, `Generated chatId: ${chatId}`)

//     setChatMessages(prev => {
//       logInfo(
//         context,
//         `Previous messages for chatId ${chatId}: ${JSON.stringify(
//           prev[chatId]
//         )}`
//       )

//       const newMessagesForChatId = [...(prev[chatId] || []), message]
//       logInfo(
//         context,
//         `New messages for chatId ${chatId}: ${JSON.stringify(
//           newMessagesForChatId
//         )}`
//       )
//       const newChatMessages = {
//         ...prev,
//         [chatId]: newMessagesForChatId,
//       }
//       logInfo(
//         context,
//         `Updated chatMessages state: ${JSON.stringify(newChatMessages)}`
//       )

//       return newChatMessages
//     })
//   }, [])

//   // const socket = useSocket(addMessageToState)
//   useEffect(() => {
//     if (!socket) return
//     if (socket) {
//       const handleUserOnline = userId => {
//         logInfo(context, `User online: ${userId}`)
//         const updatedFriends = friendList.map(friend =>
//           friend._id === userId ? { ...friend, isOnline: true } : friend
//         )
//         logInfo(
//           context,
//           `Updated Friends List after user came online: ${JSON.stringify(
//             updatedFriends
//           )}`
//         )
//         setFriendList(updatedFriends)
//       }

//       const handleUserOffline = userId => {
//         logInfo(context, `User offline: ${userId}`)
//         const updatedFriends = friendList.map(friend =>
//           friend._id === userId ? { ...friend, isOnline: false } : friend
//         )
//         setFriendList(updatedFriends)
//       }

//       socket.on('user-online', handleUserOnline)
//       socket.on('user-offline', handleUserOffline)

//       return () => {
//         socket.off('user-online', handleUserOnline)
//         socket.off('user-offline', handleUserOffline)
//       }
//     }
//   }, [socket, friends])

//   const UserIcon = ({ friend, onClick }) => {
//     return (
//       <TouchableOpacity style={styles.bubble} onPress={() => onClick(friend)}>
//         {friend.photoUrl ? (
//           <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
//         ) : (
//           <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
//         )}
//       </TouchableOpacity>
//     )
//   }

//   return (
//     <View style={styles.container}>
//       {/* Friends List */}
//       <View style={styles.friendsListContainer}>
//         <Text>Your Friends</Text>
//         <FlatList
//           data={friendList}
//           keyExtractor={item => item._id}
//           renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => openChat(item)}>
//               <View style={styles.friendItem}>
//                 <View style={styles.statusIndicator(item.isOnline)} />
//                 <Text style={{ fontSize: 14 }}>
//                   {item.username} - {item.isOnline ? 'Online' : 'Offline'}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       </View>

//       {/* Chat Section */}
//       <View style={styles.chatSection}>
//         {/* Chat Drawer */}
//         <View style={styles.chatContainer}>
//           {isChatDrawerOpen && currentChatFriend && (
//             <ChatDrawer
//               friend={currentChatFriend}
//               onClose={closeChat}
//               setCurrentChatFriend={setCurrentChatFriend}
//               activeChats={activeChats}
//               chatMessages={chatMessages}
//               addMessageToState={addMessageToState}
//             />
//           )}
//         </View>

//         {/* Active Chat Icons */}
//         <View style={styles.activeChatsContainer}>
//           {activeChats.map(friend => (
//             <UserIcon
//               key={friend._id}
//               friend={friend}
//               onClick={setCurrentChatFriend}
//             />
//           ))}
//         </View>
//       </View>
//     </View>
//   )
// }
// ChatGPT
// The OnlineOfflineFriends component is essentially a list of friends and a chat interface that allows a user to initiate and carry on chat sessions with those friends. Let's break down the functionality of this component step by step:

// Imports and State Initialization:

// Various modules from react-native and other libraries are imported.
// Contexts (SocketContext) and hooks (useUser and useFriends) are imported.
// Multiple useState hooks are initialized to manage state for the component, such as isChatDrawerOpen, currentChatFriend, activeChats, chatMessages, and friendList.
// Friend List Initialization:

// When the friends data is available, the component updates its friendList state with the list of friends.
// Chat Opening and Closing:

// The openChat function, when invoked with a friend as its argument, will show a toast message and checks if the current friend is already in the active chat list. If not, it adds the friend to the active chats. It then opens the chat drawer for the selected friend.
// The closeChat function resets the current chat friend and closes the chat drawer.
// Logging Utility Functions:

// logInfo and logError functions provide a uniform way to log messages to the console.
// Message Handling:

// The addMessageToState function is a callback that adds a new message to the state. It uses the utility function getChatId to get a unique chat identifier based on the sender and recipient. It then updates the chatMessages state with the new message.
// Socket Event Handling:

// The component listens to user-online and user-offline events from the socket. When a user comes online, the friend list is updated to mark that user as online. Similarly, when a user goes offline, the friend list is updated to mark that user as offline.
// UI Rendering:

// The component renders a list of friends. For each friend, the online/offline status is displayed.
// When a user clicks on a friend from the list, the chat drawer is opened for that friend.
// At the bottom, icons for active chats are shown. Users can click on these icons to switch between active chats.
// Styling:

// React Native StyleSheet is used for styling, but the actual styles are not provided in the given code.
// Utility Components:

// UserIcon is a small functional component within this component. It displays the profile picture of the friend if available, otherwise, a default chat icon. When clicked, it sets the selected friend as the current chat friend.
// This component effectively integrates the concepts of a chat interface with a list of online/offline friends, making it easier for users to interact with their friends and keep track of who's online. The use of socket events ensures that the online/offline status is updated in real-time.

// User
// can you see why the handleUserOnline error was displayed after looking at this code though?
// ChatGPT
// Upon inspecting the provided code, the most likely cause of the "handleUserOnline error" seems to be related to the socket event listeners.

// One notable omission is that the context variable, which is used within the handleUserOnline and handleUserOffline functions for logging, is not defined within the scope of those functions or the parent component. This can cause a ReferenceError when the functions attempt to call the logInfo function with the context variable.

// javascript
// Copy code
// const handleUserOnline = userId => {
//     logInfo(context, `User online: ${userId}`) // <-- "context" is not defined
//     ...
// }
// To fix this issue, you should either:

// Define a context variable in the scope where the handleUserOnline and handleUserOffline functions are defined.
// javascript
// Copy code
// const context = 'OnlineOfflineFriends';
// OR

// Directly provide a string as the context when calling the logInfo function within the handleUserOnline and handleUserOffline functions.
// javascript
// Copy code
// logInfo('OnlineOfflineFriends', `User online: ${userId}`)
// Make sure to apply this change in both handleUserOnline and handleUserOffline functions.

// After making this change, the "handleUserOnline error" related to the missing context should be resolved. If there are other issues or errors, you'd likely need to provide more details or more specific error messages to diagnose them.

// User
// If instead of having a ChatDrawer, I wanted to test having a message bubble appear on the home screen to the right when a user messages another user, How can I implement this in my current setup?  I could comment out the ChatDrawer and Navigation in App.tsx for this particular test.  I just think my navigation has become way over the top in complexity when really it hasnt made the app any easier to navigate.  It may be simpler to keep single components in icons like I was referring to earlier.  To start I'd like the chat bubble icon to be in the home screen to the right.  I guess instead of popping up a new bubble with each active chat or new message from a user it would just hold the count of new messages in this bubble.  when clicking the bubble it would take you to active chats.  The icon would toggle the active chats component and also toggle back to the home screen. So you can then navigate to other users with the people icon if you want to start a new chat yourself.  I believe I've started the implementation of this in ChatDrawer but want to try and simplify things a bit to start and expand a little slower this time, working with the user experience as I go.  Here is the current ChatDrawer:
// import React, { useState, useEffect, useContext } from 'react'
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Image,
//   ToastAndroid,
// } from 'react-native'
// // import useSocket from '../Socket/useSocket'
// import { useUser } from '../API/AuthService'
// import { getChatId } from '../utility/utility'
// import DefaultIcon from 'react-native-vector-icons/Ionicons'
// import SocketContext from '../API/SocketContext'

// {
//   /* Keep this ChatBubble component for possible group messages later, it will display the user photo in line with the text so its easier to see who sent it*/
// }
// // const ChatBubble = ({ friend }) => {
// //   return (
// //     <TouchableOpacity style={styles.bubble}>
// //       {friend.photoUrl ? (
// //         <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
// //       ) : (
// //         <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
// //       )}
// //     </TouchableOpacity>
// //   )
// // }

// const ChatDrawer = ({
//   activeChats,
//   setCurrentChatFriend,
//   friend,
//   onClose,
//   chatMessages,
//   addMessageToState,
// }) => {
//   console.log('Render ChatDrawer Component')
//   console.log('Chat Messages', chatMessages)
//   const [message, setMessage] = useState('')
//   // const [chatMessages, setChatMessages] = useState([])
//   const { user } = useUser()
//   const userId = user?.userId
//   const chatId = getChatId(userId, friend._id)
//   const currentMessages = chatMessages[chatId] || []

//   // const socket = useSocket(addMessageToState)
//   const socket = useContext(SocketContext)

//   const sendMessage = () => {
//     const newMessage = {
//       sender: userId,
//       recipient: friend._id,
//       content: message,
//     }

//     // Check if the recipient is online before sending the message
//     if (friend.isOnline) {
//       console.log(`Sending message: ${message} to ${friend.username}`)
//       if (socket) {
//         socket.emit('new-message', newMessage)
//       }
//     } else {
//       // Handle the case where the recipient is offline (e.g., display a notification).
//       console.log(`Recipient ${friend.username} is offline. Message not sent.`)
//       // You can implement logic to store the message and send it later when the recipient is online.
//       // addMessageToQueue(newMessage); // Example: Store the message in a queue.
//     }

//     addMessageToState(newMessage) // Use the function to organize the message
//     setMessage('') // Resetting the input after sending.
//   }
//   const [notifications, setNotifications] = useState({})

//   // Function to handle received messages
//   function handleMessageReceived(message) {
//     if (message.sender !== friend._id) {
//       setNotifications(prev => ({
//         ...prev,
//         [message.sender]: (prev[message.sender] || 0) + 1,
//       }))
//     }
//   }
//   // Receiving a message
//   useEffect(() => {
//     if (socket) {
//       socket.on('receive-message', message => {
//         console.log('Received message:', message)

//         // Handle the incoming message
//         addMessageToState(message)
//         handleMessageReceived(message)

//         ToastAndroid.showWithGravity(
//           `New message from ${message.sender}`,
//           ToastAndroid.SHORT,
//           ToastAndroid.CENTER
//         )
//       })

//       return () => {
//         socket.off('receive-message')
//       }
//     }
//   }, [socket])

//   useEffect(() => {
//     console.log('chatMessages changed:', chatMessages)
//   }, [chatMessages])

//   console.log('Current Messages:', currentMessages)
//   return (
//     <View style={styles.chatDrawerContainer}>
//       <TouchableOpacity
//         onPress={onClose}
//         style={{ position: 'absolute', top: 10, right: 10 }}
//       >
//         <Text>X</Text>
//       </TouchableOpacity>

//       {/* <ScrollView horizontal={true} style={styles.bubbleContainer}>
//         {activeChats.map(friend => (
//           <ChatBubble
//             key={friend._id}
//             friend={friend}
//             onClick={setCurrentChatFriend}
//           />
//         ))}
//       </ScrollView> */}
//       <ScrollView>
//         {activeChats.map(chatFriend => (
//           <TouchableOpacity
//             key={chatFriend._id}
//             onPress={() => {
//               setCurrentChatFriend(chatFriend)
//               handleChatOpened(chatFriend._id)
//             }}
//           >
//             {/* Your ChatBubble component here */}
//             {notifications[chatFriend._id] && (
//               <Text style={{ color: 'red' }}>
//                 {notifications[chatFriend._id]}
//               </Text>
//             )}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <Text>Chat with {friend.username}</Text>
//       <ScrollView>
//         {currentMessages.map((msg, index) => (
//           <View
//             key={index}
//             style={{ flexDirection: 'row', alignItems: 'center' }}
//           >
//             {msg.sender === userId ? (
//               <Text>You: {msg.content}</Text>
//             ) : (
//               <React.Fragment>
//                 {friend.photoUrl ? (
//                   <Image
//                     source={{ uri: friend.photoUrl }}
//                     style={styles.profilePic}
//                   />
//                 ) : (
//                   <DefaultIcon
//                     name='chatbubble-outline'
//                     size={30}
//                     color={'blue'}
//                   />
//                 )}
//                 <Text>
//                   {friend.username}: {msg.content}
//                 </Text>
//               </React.Fragment>
//             )}
//           </View>
//         ))}
//       </ScrollView>
//       <TextInput
//         value={message}
//         onChangeText={setMessage}
//         style={styles.textInput}
//         placeholder='Type a message...'
//       />
//       <Button title='Send' onPress={sendMessage} />
//     </View>
//   )
// }
// ChatGPT
// To transition from a ChatDrawer to a message bubble that appears on the home screen, you'll need to create a few new components and modify the logic of your application. I'll provide a step-by-step guide:

// 1. Message Bubble Component:
// Create a new MessageBubble component that represents the message bubble with the count of unread messages.

// jsx
// Copy code
// const MessageBubble = ({ unreadCount, onClick }) => {
//   return (
//     <TouchableOpacity onPress={onClick} style={styles.messageBubble}>
//       <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
//       {unreadCount > 0 && (
//         <Text style={styles.unreadCount}>{unreadCount}</Text>
//       )}
//     </TouchableOpacity>
//   );
// };
// Styles for the MessageBubble:

// javascript
// Copy code
// const styles = StyleSheet.create({
//   messageBubble: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10, // Adjust as per your design
//   },
//   unreadCount: {
//     marginLeft: 5,
//     color: 'red',
//   },
// });
// 2. Implement the Bubble on the Home Screen:
// In your HomeScreen component (or similar), integrate the MessageBubble:

// jsx
// Copy code
// const HomeScreen = () => {
//   const [activeChats, setActiveChats] = useState([]); // List of active chats
//   const [unreadCount, setUnreadCount] = useState(0); // Total unread messages
//   const [showChats, setShowChats] = useState(false); // State to toggle the chat list

//   // Calculate total unread messages. You can refine this logic.
//   useEffect(() => {
//     const totalUnread = Object.values(notifications).reduce((a, b) => a + b, 0);
//     setUnreadCount(totalUnread);
//   }, [notifications]);

//   return (
//     <View style={styles.container}>
//       {/* Other HomeScreen content here */}

//       <View style={styles.bottomRightCorner}>
//         <MessageBubble
//           unreadCount={unreadCount}
//           onClick={() => setShowChats(!showChats)}
//         />
//       </View>

//       {showChats && <ChatDrawer /* props here */ />}
//     </View>
//   );
// };
// Styles for positioning the MessageBubble:

// javascript
// Copy code
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // ... other styles
//   },
//   bottomRightCorner: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//   },
// });
// 3. ChatDrawer Modifications:
// Since you no longer want the drawer to cover the entire screen, you may want to style the ChatDrawer component to appear as a floating chat list. Adjust its styles, like setting a specific height, background color, and maybe some rounded corners. For example:

// javascript
// Copy code
// const styles = StyleSheet.create({
//   chatDrawerContainer: {
//     position: 'absolute',
//     bottom: 60,  // To position it just above the message bubble
//     right: 10,
//     width: 300,
//     height: 400,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     // ... other styles
//   },
// });
// 4. Transition Logic:
// You've already handled the toggling of the chat drawer through the showChats state in the HomeScreen. Ensure that the logic is complete and no other overlays interfere.

// Summary:
// The main idea here is to:

// Create a new bubble component that shows the unread message count.
// Position this bubble on your home screen.
// Modify the appearance of the ChatDrawer to be a floating chat list.
// Toggle the appearance of the ChatDrawer when the message bubble is clicked.
// Remember to thoroughly test the app after making these changes, especially the transitions and interactions, to ensure smooth user experience.

// User
// getting this error:
// notifications doesnt exist

// just added this code:
// import { View, Text, Image, StyleSheet } from 'react-native'
// import { useState, useEffect } from 'react'
// import EventsContainer from '../Events/EventsContainer'
// import EventsItem from '../Events/EventsItem'
// import MessageBubble from '../Messages/MessageBubble'
// import ChatDrawer from '../Social/ChatDrawer'

// const Home = () => {
//   const [activeChats, setActiveChats] = useState([]) // List of active chats
//   const [unreadCount, setUnreadCount] = useState(0) // Total unread messages
//   const [showChats, setShowChats] = useState(false) // State to toggle the chat list

//   useEffect(() => {
//     const totalUnread = Object.values(notifications).reduce((a, b) => a + b, 0)
//     setUnreadCount(totalUnread)
//   }, [notifications])

//   return (
//     <View style={styles.welcomeXmas}>
//       <Text style={styles.welcome}>Welcome to your Home Page!</Text>
//       <Text>Please navigate using the menu in the top right</Text>
//       <EventsContainer />
//       <EventsItem />
//       <View style={styles.bottomRightCorner}>
//         <MessageBubble
//           unreadCount={unreadCount}
//           onClick={() => setShowChats(!showChats)}
//         />
//       </View>

//       {showChats && (
//         <ChatDrawer
//           activeChats={activeChats}
//           setCurrentChatFriend={setCurrentChatFriend}
//           friend={friend}
//           onclose={onClose}
//           chatMessages={chatMessages}
//           addMessageToState={addMessageToState}
//         />
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   welcomeXmas: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   welcome: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//   },
// })
// export default Home

// import { Text, TouchableOpacity, StyleSheet } from 'react-native'
// import DefaultIcon from 'react-native-vector-icons/Ionicons'

// const MessageBubble = ({ unreadCount, onClick }) => {
//   return (
//     <TouchableOpacity onPress={onClick} style={styles.messageBubble}>
//       <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
//       {unreadCount > 0 && <Text style={styles.unreadCount}>{unreadCount}</Text>}
//     </TouchableOpacity>
//   )
// }

// const styles = StyleSheet.create({
//   messageBubble: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10, // Adjust as per your design
//   },
//   unreadCount: {
//     marginLeft: 5,
//     color: 'red',
//   },
// })
// export default MessageBubble
// ChatGPT
// The error you're seeing is due to the notifications variable, which you're trying to use inside the useEffect but it hasn't been defined in the scope of your Home component.

// Remember, the notifications object is supposed to keep track of unread messages for each chat. You would update this object every time a new message arrives. If you've implemented this logic inside the ChatDrawer, you might need to lift this state up to the Home component or find another way to share this data between components.

// Let's fix it:

// Define the notifications state
// Add the notifications state in your Home component:

// jsx
// Copy code
// const [notifications, setNotifications] = useState({});
// Update notifications when a new message arrives
// You'll need a mechanism to update the notifications state whenever a new message is received. If your socket logic for receiving messages is inside the ChatDrawer component, consider lifting it to the Home component or using Context to share the notifications state between Home and ChatDrawer.

// Pass down the necessary props
// If you lift up the socket logic to the Home component, you might need to pass down some props to the ChatDrawer. This depends on how you've structured the rest of your app.

// Here's a simplified version:

// jsx
// Copy code
// const Home = () => {
//   const [notifications, setNotifications] = useState({});

//   // ... other state and logic

//   function handleMessageReceived(message) {
//     if (message.sender !== friend._id) {
//       setNotifications(prev => ({
//         ...prev,
//         [message.sender]: (prev[message.sender] || 0) + 1,
//       }));
//     }
//   }

//   // ... rest of your component

//   return (
//     <View style={styles.welcomeXmas}>
//       {/* ... other elements */}
//       {showChats && (
//         <ChatDrawer
//           onMessageReceived={handleMessageReceived}
//           // ... other props
//         />
//       )}
//     </View>
//   );
// }
// In the above code:

// We defined the handleMessageReceived function which updates the notifications state.
// We pass handleMessageReceived to ChatDrawer as the onMessageReceived prop.
// Inside ChatDrawer, you would call onMessageReceived every time a new message is received through the socket.

// Remember, the structure and logic might vary based on your app's complexity and requirements. The key takeaway is to ensure that the notifications state is properly initialized and updated when new messages arrive.

// User
// which props would home and chat drawer need to have passed to each other? i think I added all of them but might not need all like it was before
// ChatGPT
// Given the provided code snippets and the new Home and MessageBubble components, let's break down the communication and see which props might be needed for both components.

// For ChatDrawer:
// activeChats:

// This is a list of active chats. ChatDrawer uses this to display each active chat, so it's necessary.
// setCurrentChatFriend:

// Not present in the Home component code you've shared, but it's required by ChatDrawer. This prop is likely a function that updates the currently selected chat friend. If you're going to lift it to the Home component, you'd need to define the state and its updater in Home and then pass down the updater function as this prop.
// friend:

// This is the current friend a user is chatting with. Again, this state might need to be lifted up to the Home component, and passed down to ChatDrawer as a prop.
// onClose:

// A function to close the chat drawer. This seems equivalent to the setShowChats(false) in your Home component, so it's necessary. However, ensure you pass it correctly with the name onClose and not onclose (notice the capital 'C').
// chatMessages:

// It's the log of chat messages. If you want ChatDrawer to be responsible only for displaying the messages and not managing the state, you might want to lift the state to Home and then pass it down.
// addMessageToState:

// A function to add a new message to the state. You'd need this if you're lifting the chatMessages state to Home. ChatDrawer will call this function whenever a new message is sent or received.
// onMessageReceived (Newly suggested):

// A function that is called whenever a new message is received to update the notifications in the Home component. If you implement this, you'd need to add it.
// For Home:
// unreadCount:

// It represents the total number of unread messages, which is passed to MessageBubble to be displayed.
// onClick for MessageBubble:

// Toggles the display of the ChatDrawer. This is necessary.
// Given the above analysis, here are some steps to simplify:

// Consolidate state management in Home:

// Lift the states like friend, chatMessages, etc., to the Home component. This will make ChatDrawer a "dumb" component that simply displays data and notifies Home of user interactions. This centralized approach might make state management easier.
// Eliminate redundant state:

// If two components are sharing and using the same piece of state, consider having that state reside in their closest common ancestor and pass it down as props.
// Use Context for global state:

// If many components need access to the same state, consider using the React Context API. For instance, user-related information might be a good candidate for this.
// Remember, while this is a guide to simplify your component communication, always think of the user experience and the maintainability of your code when making design decisions.

// User
// unfortunately it seems like the states were mostly being handled in the OnlineOffline component.  However, this would be another icon that would be displayed in home to view OnlineOffline users, which would then give the user access to press a current online user to start another active chat
// ChatGPT
// Alright, I understand. If OnlineOffline (or whatever component you have that handles online and offline users) is handling most of the states, it seems like you have another layer of complexity to consider.

// To break it down:

// Home: The main component where you'd show MessageBubble to indicate chats and their unread counts, and potentially OnlineOffline to indicate online users.

// ChatDrawer: A component that slides in or becomes visible when a user wants to engage in a chat.

// OnlineOffline: A component or screen that shows users who are online/offline and allows the current user to initiate chats.

// Given this understanding, here's a suggested prop and state structure:

// Home
// States:

// activeChats: To keep track of ongoing chats.
// unreadCount: To keep track of unread messages.
// showChats: To decide whether to show the ChatDrawer.
// onlineUsers: A list of users who are currently online (this can be fetched regularly or updated via sockets, etc.).
// Props for Child Components:

// Pass activeChats, unreadCount, and showChats (and their setters if necessary) to both ChatDrawer and OnlineOffline as necessary.
// ChatDrawer
// Props:

// activeChats: List of active chats.
// setCurrentChatFriend: Function to set the current chat friend.
// friend: The friend currently being chatted with.
// onClose: Function to close the chat drawer.
// chatMessages: Messages log.
// addMessageToState: Function to add a new message.
// ... And any other props that control its behavior and appearance.
// OnlineOffline
// States:

// onlineUsers: A list of users who are online.
// Props:

// startChat: A function to initiate a new chat. This function would likely update the activeChats in Home.
// To implement your requirement:

// Displaying OnlineOffline in Home: You'd probably want an icon or button in the Home component that, when clicked, displays the OnlineOffline component or navigates to the OnlineOffline screen.

// Starting a Chat from OnlineOffline: When a user in the OnlineOffline component is clicked, it should trigger the startChat function (passed as a prop) that would update the activeChats in the Home component.

// Reflect Active Chats in MessageBubble: Once activeChats in the Home component is updated, it should reflect on the MessageBubble (indicating a new active chat).

// For better separation of concerns, maintainability, and performance:

// Context API: If states like online users, active chats, etc., are required across several components, consider using the React Context API or some state management libraries like Redux or MobX.

// Optimized Rendering: Ensure components re-render only when necessary, especially in lists of users or messages. Consider using React's memo, useMemo, and useCallback for this.

// Remember, these are guidelines based on the information provided. Adjust as per your specific requirements and application architecture.

// User
// this is my current OnlineOffline component, can you help me refactor this component and home to achieve this functionality?
// import React, { useState, useEffect, useCallback, useContext } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ToastAndroid,
//   StyleSheet,
//   Image,
// } from 'react-native' // Imported Alert
// import { useUser } from '../API/AuthService.js'
// import { useFriends } from './UseFriends.js'
// import ChatDrawer from '../Social/ChatDrawer.js'
// import DefaultIcon from 'react-native-vector-icons/Ionicons'
// // import useSocket from '../Socket/useSocket.js'
// import { getChatId } from '../utility/utility.js'
// import SocketContext from '../API/SocketContext.js'

// const OnlineOfflineFriends = () => {
//   const { user } = useUser()
//   const userId = user?.userId
//   const { friends } = useFriends(userId)

//   const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)
//   const [currentChatFriend, setCurrentChatFriend] = useState(null)
//   const [activeChats, setActiveChats] = useState([])
//   const [chatMessages, setChatMessages] = useState({})
//   const [friendList, setFriendList] = useState([])
//   const socket = useContext(SocketContext)

//   useEffect(() => {
//     if (friends && friends.length > 0) {
//       setFriendList(friends)
//     }
//   }, [friends])
//   const openChat = friend => {
//     // Alert.alert('Chat Opened', `Now chatting with ${friend.username}`)
//     ToastAndroid.showWithGravity(
//       `Chat Opened with ${friend.username}`,
//       ToastAndroid.SHORT,
//       ToastAndroid.CENTER
//     )
//     console.log('Friend Pressed: ', friend)
//     const isChatActive = activeChats.find(chat => chat._id === friend._id)

//     if (!isChatActive) {
//       // If not, add the friend to the active chats.
//       setActiveChats([...activeChats, friend])
//     }

//     setCurrentChatFriend(friend)
//     console.log('Current Chat Friend: ', currentChatFriend)
//     setChatDrawerOpen(true)
//   }
//   const closeChat = () => {
//     setCurrentChatFriend(null)
//     setChatDrawerOpen(false)
//   }
//   const logInfo = (context, message) => {
//     console.info(`[INFO][${context}] ${message}`)
//   }

//   const logError = (context, message) => {
//     console.error(`[ERROR][${context}] ${message}`)
//   }
//   const addMessageToState = useCallback(message => {
//     const context = 'addMessageToState'
//     logInfo(
//       context,
//       `Received message from ${message.sender} to ${message.recipient}`
//     )

//     // Update this line to use both sender and recipient from the message
//     const chatId = getChatId(message.sender, message.recipient)
//     logInfo(context, `Generated chatId: ${chatId}`)

//     setChatMessages(prev => {
//       logInfo(
//         context,
//         `Previous messages for chatId ${chatId}: ${JSON.stringify(
//           prev[chatId]
//         )}`
//       )

//       const newMessagesForChatId = [...(prev[chatId] || []), message]
//       logInfo(
//         context,
//         `New messages for chatId ${chatId}: ${JSON.stringify(
//           newMessagesForChatId
//         )}`
//       )
//       const newChatMessages = {
//         ...prev,
//         [chatId]: newMessagesForChatId,
//       }
//       logInfo(
//         context,
//         `Updated chatMessages state: ${JSON.stringify(newChatMessages)}`
//       )

//       return newChatMessages
//     })
//   }, [])

//   // const socket = useSocket(addMessageToState)
//   useEffect(() => {
//     if (!socket) return
//     if (socket) {
//       const handleUserOnline = userId => {
//         logInfo(context, `User online: ${userId}`)
//         const updatedFriends = friendList.map(friend =>
//           friend._id === userId ? { ...friend, isOnline: true } : friend
//         )
//         logInfo(
//           'Handle User Online',
//           `Updated Friends List after user came online: ${JSON.stringify(
//             updatedFriends
//           )}`
//         )
//         setFriendList(updatedFriends)
//       }

//       const handleUserOffline = userId => {
//         logInfo('Handle User Offline', `User offline: ${userId}`)
//         const updatedFriends = friendList.map(friend =>
//           friend._id === userId ? { ...friend, isOnline: false } : friend
//         )
//         setFriendList(updatedFriends)
//       }

//       socket.on('user-online', handleUserOnline)
//       socket.on('user-offline', handleUserOffline)

//       return () => {
//         socket.off('user-online', handleUserOnline)
//         socket.off('user-offline', handleUserOffline)
//       }
//     }
//   }, [socket, friends])

//   const UserIcon = ({ friend, onClick }) => {
//     return (
//       <TouchableOpacity style={styles.bubble} onPress={() => onClick(friend)}>
//         {friend.photoUrl ? (
//           <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
//         ) : (
//           <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
//         )}
//       </TouchableOpacity>
//     )
//   }

//   return (
//     <View style={styles.container}>
//       {/* Friends List */}
//       <View style={styles.friendsListContainer}>
//         <Text>Your Friends</Text>
//         <FlatList
//           data={friendList}
//           keyExtractor={item => item._id}
//           renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => openChat(item)}>
//               <View style={styles.friendItem}>
//                 <View style={styles.statusIndicator(item.isOnline)} />
//                 <Text style={{ fontSize: 14 }}>
//                   {item.username} - {item.isOnline ? 'Online' : 'Offline'}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       </View>

//       {/* Chat Section */}
//       <View style={styles.chatSection}>
//         {/* Chat Drawer */}
//         <View style={styles.chatContainer}>
//           {isChatDrawerOpen && currentChatFriend && (
//             <ChatDrawer
//               friend={currentChatFriend}
//               onClose={closeChat}
//               setCurrentChatFriend={setCurrentChatFriend}
//               activeChats={activeChats}
//               chatMessages={chatMessages}
//               addMessageToState={addMessageToState}
//             />
//           )}
//         </View>

//         {/* Active Chat Icons */}
//         <View style={styles.activeChatsContainer}>
//           {activeChats.map(friend => (
//             <UserIcon
//               key={friend._id}
//               friend={friend}
//               onClick={setCurrentChatFriend}
//             />
//           ))}
//         </View>
//       </View>
//     </View>
//   )
// }

// here is home:
// import { View, Text, Image, StyleSheet } from 'react-native'
// import { useState, useEffect } from 'react'
// import EventsContainer from '../Events/EventsContainer'
// import EventsItem from '../Events/EventsItem'
// import MessageBubble from '../Messages/MessageBubble'
// import ChatDrawer from '../Social/ChatDrawer'

// const Home = () => {
//   const [activeChats, setActiveChats] = useState([]) // List of active chats
//   const [unreadCount, setUnreadCount] = useState(0) // Total unread messages
//   const [showChats, setShowChats] = useState(false) // State to toggle the chat list
//   const [notifications, setNotifications] = useState({})

//   useEffect(() => {
//     const totalUnread = Object.values(notifications).reduce((a, b) => a + b, 0)
//     setUnreadCount(totalUnread)
//   }, [notifications])

//   return (
//     <View style={styles.welcomeXmas}>
//       <Text style={styles.welcome}>Welcome to your Home Page!</Text>
//       <Text>Please navigate using the menu in the top right</Text>
//       <EventsContainer />
//       <EventsItem />
//       <View style={styles.bottomRightCorner}>
//         <MessageBubble
//           unreadCount={unreadCount}
//           onClick={() => setShowChats(!showChats)}
//         />
//       </View>

//       {showChats && (
//         <ChatDrawer
//           onMessageReceived={handleMessageReceived}
//           activeChats={activeChats}
//           setCurrentChatFriend={setCurrentChatFriend}
//           friend={friend}
//           onclose={onClose}
//           chatMessages={chatMessages}
//           addMessageToState={addMessageToState}
//         />
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   welcomeXmas: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   welcome: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//   },
// })
// export default Home
// ChatGPT
// To achieve the desired functionality, you'll need to refactor both the OnlineOfflineFriends and Home components. Let's start with the high-level flow of what you're trying to achieve:

// The Home component should show the MessageBubble and, when clicked, should either:

// Show the list of activeChats in a drawer.
// Or navigate to the OnlineOfflineFriends component.
// In the OnlineOfflineFriends component, users can see their friends and their online/offline status.

// Clicking on a friend will initiate a chat.
// The chat should be visible in the Home component's chat drawer.
// Let's refactor both components step by step:

// 1. OnlineOfflineFriends Refactoring
// Changes:
// Removed states that will be lifted to Home, such as activeChats, isChatDrawerOpen, chatMessages, and currentChatFriend.
// Added required props to OnlineOfflineFriends.
// javascript
// Copy code
// const OnlineOfflineFriends = ({
//   activeChats,
//   setActiveChats,
//   setCurrentChatFriend,
//   setChatDrawerOpen,
//   chatMessages,
//   setChatMessages
// }) => {
//   // ... keep other existing states and effects ...

//   // (Keep your existing functions: openChat, closeChat, logInfo, logError, addMessageToState)

//   return (
//     <View style={styles.container}>
//       {/* Friends List */}
//       <View style={styles.friendsListContainer}>
//         // ... unchanged ...
//       </View>

//       {/* Chat Section */}
//       <View style={styles.chatSection}>
//         {/* Chat Drawer (Moved to Home Component, so removing from here) */}

//         {/* Active Chat Icons */}
//         <View style={styles.activeChatsContainer}>
//           {activeChats.map(friend => (
//             <UserIcon
//               key={friend._id}
//               friend={friend}
//               onClick={setCurrentChatFriend}
//             />
//           ))}
//         </View>
//       </View>
//     </View>
//   )
// }
// 2. Home Refactoring
// Changes:
// Added all the necessary states (activeChats, chatMessages, etc.).
// Added handlers (handleMessageReceived, setCurrentChatFriend, etc.) required by ChatDrawer.
// javascript
// Copy code
// const Home = () => {
//   const [activeChats, setActiveChats] = useState([])
//   const [chatMessages, setChatMessages] = useState({})
//   const [currentChatFriend, setCurrentChatFriend] = useState(null)
//   const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)
//   // ... other states ...

//   const handleMessageReceived = (message) => {
//     // Handle the incoming message here
//     // Probably update the chatMessages state
//   }

//   const onClose = () => {
//     setCurrentChatFriend(null)
//     setChatDrawerOpen(false)
//   }

//   useEffect(() => {
//     const totalUnread = Object.values(notifications).reduce((a, b) => a + b, 0)
//     setUnreadCount(totalUnread)
//   }, [notifications])

//   return (
//     <View style={styles.welcomeXmas}>
//       {/* ... other components ... */}

//       {isChatDrawerOpen && (
//         <ChatDrawer
//           onMessageReceived={handleMessageReceived}
//           activeChats={activeChats}
//           setCurrentChatFriend={setCurrentChatFriend}
//           friend={currentChatFriend}
//           onClose={onClose}
//           chatMessages={chatMessages}
//           addMessageToState={addMessageToState} // This might need refactoring
//         />
//       )}

//       <OnlineOfflineFriends
//         activeChats={activeChats}
//         setActiveChats={setActiveChats}
//         setCurrentChatFriend={setCurrentChatFriend}
//         setChatDrawerOpen={setChatDrawerOpen}
//         chatMessages={chatMessages}
//         setChatMessages={setChatMessages}
//       />
//     </View>
//   )
// }
// This refactoring is a high-level guide to help you achieve the desired functionality. You might need to make further adjustments depending on your full application architecture and any additional functionality you might need.

// User
// ok with this new implementation the chat bubble when pressed is technically supposed to do what? sorry
// ChatGPT
// In the revised implementation I've provided, pressing the chat bubble (MessageBubble component in the Home component) should toggle the isChatDrawerOpen state, which controls whether the ChatDrawer is displayed or hidden.

// However, I noticed I missed that specific functionality in the refactored Home component. My apologies for that oversight. Let's correct it:

// Update the state of isChatDrawerOpen when the MessageBubble is clicked:
// javascript
// Copy code
// // Within the Home component...

// const toggleChatDrawer = () => {
//   setChatDrawerOpen(prevState => !prevState);
// }

// // ...

// <MessageBubble
//   unreadCount={unreadCount}
//   onClick={toggleChatDrawer}
// />
// Now, with this adjustment:

// When the MessageBubble is clicked, it will toggle (show/hide) the ChatDrawer.
// The ChatDrawer shows the active chat with the currently selected friend (currentChatFriend).
// The OnlineOfflineFriends component lets users click on a friend to start a chat. When this happens, the friend becomes the currentChatFriend, and the ChatDrawer should open to show the chat with that friend.

// User
// ok here is Home.js:
// import { View, Text, Image, StyleSheet } from 'react-native'
// import { useState, useEffect } from 'react'
// import EventsContainer from '../Events/EventsContainer'
// import EventsItem from '../Events/EventsItem'
// import MessageBubble from '../Messages/MessageBubble'
// import ChatDrawer from '../Social/ChatDrawer'
// import OnlineOfflineFriends from '../Friends/OnlineOffline'

// const Home = () => {
//   const [activeChats, setActiveChats] = useState([]) // List of active chats
//   const [unreadCount, setUnreadCount] = useState(0) // Total unread messages
//   const [showChats, setShowChats] = useState(false) // State to toggle the chat list
//   const [notifications, setNotifications] = useState({})
//   const [chatMessages, setChatMessages] = useState({})
//   const [currentChatFriend, setCurrentChatFriend] = useState(null)
//   const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)

//   const handleMessageReceived = message => {
//     // Handle the incoming message here
//     // Probably update the chatMessages state
//   }
//   const toggleChatDrawer = () => {
//     setChatDrawerOpen(prevState => !prevState)
//   }
//   const onClose = () => {
//     setCurrentChatFriend(null)
//     setChatDrawerOpen(false)
//   }

//   useEffect(() => {
//     const totalUnread = Object.values(notifications).reduce((a, b) => a + b, 0)
//     setUnreadCount(totalUnread)
//   }, [notifications])

//   return (
//     <View style={styles.welcomeXmas}>
//       <Text style={styles.welcome}>Welcome to your Home Page!</Text>
//       <Text>Please navigate using the menu in the top right</Text>
//       <EventsContainer />
//       <EventsItem />
//       <View style={styles.bottomRightCorner}>
//         <MessageBubble unreadCount={unreadCount} onClick={toggleChatDrawer} />
//       </View>

//       {isChatDrawerOpen && (
//         <ChatDrawer
//           onMessageReceived={handleMessageReceived}
//           activeChats={activeChats}
//           setCurrentChatFriend={setCurrentChatFriend}
//           friend={currentChatFriend}
//           onClose={onClose}
//           chatMessages={chatMessages}
//           addMessageToState={addMessageToState} // This might need refactoring
//         />
//       )}

//       <OnlineOfflineFriends
//         activeChats={activeChats}
//         setActiveChats={setActiveChats}
//         setCurrentChatFriend={setCurrentChatFriend}
//         setChatDrawerOpen={setChatDrawerOpen}
//         chatMessages={chatMessages}
//         setChatMessages={setChatMessages}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   welcomeXmas: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   welcome: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//   },
// })
// export default Home

// getting addMessageToState doesnt exist

// here is the OnlineOffline refactored:
// import React, { useState, useEffect, useCallback, useContext } from 'react'
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   ToastAndroid,
//   StyleSheet,
//   Image,
// } from 'react-native' // Imported Alert
// import { useUser } from '../API/AuthService.js'
// import { useFriends } from './UseFriends.js'
// import ChatDrawer from '../Social/ChatDrawer.js'
// import DefaultIcon from 'react-native-vector-icons/Ionicons'
// // import useSocket from '../Socket/useSocket.js'
// import { getChatId } from '../utility/utility.js'
// import SocketContext from '../API/SocketContext.js'

// const OnlineOfflineFriends = ({
//   activeChats,
//   setActiveChats,
//   setCurrentChatFriend,
//   setChatDrawerOpen,
//   chatMessages,
//   setChatMessages,
// }) => {
//   const { user } = useUser()
//   const userId = user?.userId
//   const { friends } = useFriends(userId)

//   // const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)
//   // const [currentChatFriend, setCurrentChatFriend] = useState(null)
//   // const [activeChats, setActiveChats] = useState([])
//   // const [chatMessages, setChatMessages] = useState({})
//   const [friendList, setFriendList] = useState([])
//   const socket = useContext(SocketContext)

//   useEffect(() => {
//     if (friends && friends.length > 0) {
//       setFriendList(friends)
//     }
//   }, [friends])
//   const openChat = friend => {
//     // Alert.alert('Chat Opened', `Now chatting with ${friend.username}`)
//     ToastAndroid.showWithGravity(
//       `Chat Opened with ${friend.username}`,
//       ToastAndroid.SHORT,
//       ToastAndroid.CENTER
//     )
//     console.log('Friend Pressed: ', friend)
//     const isChatActive = activeChats.find(chat => chat._id === friend._id)

//     if (!isChatActive) {
//       // If not, add the friend to the active chats.
//       setActiveChats([...activeChats, friend])
//     }

//     setCurrentChatFriend(friend)
//     console.log('Current Chat Friend: ', currentChatFriend)
//     setChatDrawerOpen(true)
//   }
//   const closeChat = () => {
//     setCurrentChatFriend(null)
//     setChatDrawerOpen(false)
//   }
//   const logInfo = (context, message) => {
//     console.info(`[INFO][${context}] ${message}`)
//   }

//   const logError = (context, message) => {
//     console.error(`[ERROR][${context}] ${message}`)
//   }
//   const addMessageToState = useCallback(message => {
//     const context = 'addMessageToState'
//     logInfo(
//       context,
//       `Received message from ${message.sender} to ${message.recipient}`
//     )

//     // Update this line to use both sender and recipient from the message
//     const chatId = getChatId(message.sender, message.recipient)
//     logInfo(context, `Generated chatId: ${chatId}`)

//     setChatMessages(prev => {
//       logInfo(
//         context,
//         `Previous messages for chatId ${chatId}: ${JSON.stringify(
//           prev[chatId]
//         )}`
//       )

//       const newMessagesForChatId = [...(prev[chatId] || []), message]
//       logInfo(
//         context,
//         `New messages for chatId ${chatId}: ${JSON.stringify(
//           newMessagesForChatId
//         )}`
//       )
//       const newChatMessages = {
//         ...prev,
//         [chatId]: newMessagesForChatId,
//       }
//       logInfo(
//         context,
//         `Updated chatMessages state: ${JSON.stringify(newChatMessages)}`
//       )

//       return newChatMessages
//     })
//   }, [])

//   // const socket = useSocket(addMessageToState)
//   useEffect(() => {
//     if (!socket) return
//     if (socket) {
//       const handleUserOnline = userId => {
//         logInfo(context, `User online: ${userId}`)
//         const updatedFriends = friendList.map(friend =>
//           friend._id === userId ? { ...friend, isOnline: true } : friend
//         )
//         logInfo(
//           'Handle User Online',
//           `Updated Friends List after user came online: ${JSON.stringify(
//             updatedFriends
//           )}`
//         )
//         setFriendList(updatedFriends)
//       }

//       const handleUserOffline = userId => {
//         logInfo('Handle User Offline', `User offline: ${userId}`)
//         const updatedFriends = friendList.map(friend =>
//           friend._id === userId ? { ...friend, isOnline: false } : friend
//         )
//         setFriendList(updatedFriends)
//       }

//       socket.on('user-online', handleUserOnline)
//       socket.on('user-offline', handleUserOffline)

//       return () => {
//         socket.off('user-online', handleUserOnline)
//         socket.off('user-offline', handleUserOffline)
//       }
//     }
//   }, [socket, friends])

//   const UserIcon = ({ friend, onClick }) => {
//     return (
//       <TouchableOpacity style={styles.bubble} onPress={() => onClick(friend)}>
//         {friend.photoUrl ? (
//           <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
//         ) : (
//           <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
//         )}
//       </TouchableOpacity>
//     )
//   }

//   return (
//     <View style={styles.container}>
//       {/* Friends List */}
//       <View style={styles.friendsListContainer}>
//         <Text>Your Friends</Text>
//         <FlatList
//           data={friendList}
//           keyExtractor={item => item._id}
//           renderItem={({ item }) => (
//             <TouchableOpacity onPress={() => openChat(item)}>
//               <View style={styles.friendItem}>
//                 <View style={styles.statusIndicator(item.isOnline)} />
//                 <Text style={{ fontSize: 14 }}>
//                   {item.username} - {item.isOnline ? 'Online' : 'Offline'}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       </View>

//       {/* Chat Section */}
//       <View style={styles.chatSection}>
//         {/* Chat Drawer (Moved to Home Component, so removing from here) */}

//         {/* Active Chat Icons */}
//         <View style={styles.activeChatsContainer}>
//           {activeChats.map(friend => (
//             <UserIcon
//               key={friend._id}
//               friend={friend}
//               onClick={setCurrentChatFriend}
//             />
//           ))}
//         </View>
//       </View>
//     </View>
//   )
// }
// ChatGPT
// Alright, let's tackle the addMessageToState issue. The addMessageToState function is indeed defined in your OnlineOfflineFriends component but you are referencing it in your Home component.

// There are a few ways you can go about fixing this:

// Move the addMessageToState function to the Home component and pass it down to both OnlineOfflineFriends and ChatDrawer.

// Centralize your chat messages state in a context or redux store so that any component can directly update or read from it.

// For this solution, I'll implement the first method:

// Step 1: Move addMessageToState to Home
// In your Home component, add the addMessageToState function:

// javascript
// Copy code
// const addMessageToState = useCallback(message => {
//     const context = 'addMessageToState'
//     console.info(`[INFO][${context}] Received message from ${message.sender} to ${message.recipient}`);

//     const chatId = getChatId(message.sender, message.recipient);
//     console.info(context, `Generated chatId: ${chatId}`);

//     setChatMessages(prev => {
//         console.info(context, `Previous messages for chatId ${chatId}: ${JSON.stringify(prev[chatId])}`);

//         const newMessagesForChatId = [...(prev[chatId] || []), message];
//         console.info(context, `New messages for chatId ${chatId}: ${JSON.stringify(newMessagesForChatId)}`);
//         const newChatMessages = {
//             ...prev,
//             [chatId]: newMessagesForChatId,
//         };
//         console.info(context, `Updated chatMessages state: ${JSON.stringify(newChatMessages)}`);

//         return newChatMessages;
//     });
// }, []);
// You would need to import useCallback at the top:

// javascript
// Copy code
// import { View, Text, Image, StyleSheet, useCallback } from 'react-native';
// Step 2: Pass addMessageToState down
// Ensure you're passing addMessageToState to ChatDrawer and OnlineOfflineFriends:

// In Home:

// javascript
// Copy code
// <ChatDrawer
//     ...
//     addMessageToState={addMessageToState}
// />
// javascript
// Copy code
// <OnlineOfflineFriends
//     ...
//     addMessageToState={addMessageToState}
// />
// Step 3: Remove addMessageToState from OnlineOfflineFriends
// Since you're passing addMessageToState from Home, you don't need to re-declare it in OnlineOfflineFriends. Remove the addMessageToState function and the useCallback import.

// Other Considerations
// Make sure getChatId is accessible within Home. If not, you might need to import it.

// You might want to review where you handle the socket events for messages. The current setup hints at OnlineOfflineFriends listening to socket events, but if message handling occurs in Home, consider moving or consolidating the socket logic.

// Ensure that addMessageToState works correctly, handling incoming messages and updating the chat messages state.

// With these changes, you should have a smoother setup for chat message handling across components.

// User
// ok gettin gthis now:
// TypeError: Cannot read property '_id' of null

// This error is located at:
//     in ChatDrawer (created by Home)
//     in RCTView (created by View)
//     in View (created by Home)
//     in Home (created by SceneView)
//     in StaticContainer
//     in EnsureSingleNavigator (created by SceneView)
//     in SceneView (created by Drawer)
//     in RCTView (created by View)
//     in View (created by Screen)
//     in RCTView (created by View)
//     in View (created by Background)
//     in Background (created by Screen)
//     in Screen (created by Drawer)
//     in RNSScreen
//     in Unknown (created by InnerScreen)
//     in Suspender (created by Freeze)
//     in Suspense (created by Freeze)
//     in Freeze (created by DelayedFreeze)
//     in DelayedFreeze (created by InnerScreen)
//     in InnerScreen (created by Screen)
//     in Screen (created by MaybeScreen)
//     in MaybeScreen (created by Drawer)
//     in RNSScreenContainer (created by ScreenContainer)
//     in ScreenContainer (created by MaybeScreenContainer)
//     in MaybeScreenContainer (created by Drawer)
//     in RCTView (created by View)
//     in View (created by Drawer)
//     in RCTView (created by View)
//     in View (created by AnimatedComponent(View))
//     in AnimatedComponent(View)
//     in Unknown (created by Drawer)
//     in RCTView (created by View)
//     in View (created by AnimatedComponent(View))
//     in AnimatedComponent(View)
//     in Unknown (created by PanGestureHandler)
//     in PanGestureHandler (created by Drawer)
//     in Drawer (created by DrawerViewBase)
//     in DrawerViewBase (created by DrawerView)
//     in RNGestureHandlerRootView (created by GestureHandlerRootView)
//     in GestureHandlerRootView (created by DrawerView)
//     in RCTView (created by View)
//     in View (created by SafeAreaInsetsContext)
//     in SafeAreaProviderCompat (created by DrawerView)
//     in DrawerView (created by DrawerNavigator)
//     in PreventRemoveProvider (created by NavigationContent)
//     in NavigationContent
//     in Unknown (created by DrawerNavigator)
//     in DrawerNavigator (created by MainSideDrawer)
//     in MainSideDrawer (created by SceneView)
//     in StaticContainer
//     in EnsureSingleNavigator (created by SceneView)
//     in SceneView (created by CardContainer)
//     in RCTView (created by View)
//     in View (created by CardContainer)
//     in RCTView (created by View)
//     in View (created by CardContainer)
//     in RCTView (created by View)
//     in View
//     in CardSheet (created by Card)
//     in RCTView (created by View)
//     in View
//     in Unknown (created by PanGestureHandler)
//     in PanGestureHandler (created by PanGestureHandler)
//     in PanGestureHandler (created by Card)
//     in RCTView (created by View)
//     in View
//     in Unknown (created by Card)
//     in RCTView (created by View)
//     in View (created by Card)
//     in Card (created by CardContainer)
//     in CardContainer (created by CardStack)
//     in RNSScreen
//     in Unknown (created by InnerScreen)
//     in Suspender (created by Freeze)
//     in Suspense (created by Freeze)
//     in Freeze (created by DelayedFreeze)
//     in DelayedFreeze (created by InnerScreen)
//     in InnerScreen (created by Screen)
//     in Screen (created by MaybeScreen)
//     in MaybeScreen (created by CardStack)
//     in RNSScreenContainer (created by ScreenContainer)
//     in ScreenContainer (created by MaybeScreenContainer)
//     in MaybeScreenContainer (created by CardStack)
//     in RCTView (created by View)
//     in View (created by Background)
//     in Background (created by CardStack)
//     in CardStack (created by HeaderShownContext)
//     in RNCSafeAreaProvider (created by SafeAreaProvider)
//     in SafeAreaProvider (created by SafeAreaInsetsContext)
//     in SafeAreaProviderCompat (created by StackView)
//     in RNGestureHandlerRootView (created by GestureHandlerRootView)
//     in GestureHandlerRootView (created by StackView)
//     in StackView (created by StackNavigator)
//     in PreventRemoveProvider (created by NavigationContent)
//     in NavigationContent
//     in Unknown (created by StackNavigator)
//     in StackNavigator (created by App)
//     in EnsureSingleNavigator
//     in BaseNavigationContainer
//     in ThemeProvider
//     in NavigationContainerInner (created by App)
//     in App (created by AppWithProvider)
//     in UserProvider (created by AppWithProvider)
//     in SocketProvider (created by AppWithProvider)
//     in AppWithProvider
//     in RCTView (created by View)
//     in View (created by AppContainer)
//     in RCTView (created by View)
//     in View (created by AppContainer)
//     in AppContainer
//     in colinMobileXmas(RootComponent), js engine: her
// ChatGPT
// You've provided the component stack trace when an error occurred in your React (or React Native) application. The error message is TypeError: Cannot read property '_id' of null.

// From the stack trace, the error originates from a component named ChatDrawer which was created by the Home component.

// Here's a step-by-step way to tackle this:

// Locate the Origin of the Error: The error originates from the ChatDrawer component. Start by inspecting the ChatDrawer component to see if there's any place where you're trying to access an _id property of an object.

// Check the Data Source: Typically, when you get a "Cannot read property of null" error, it's because the object you're trying to access hasn't been initialized or has been set to null. Make sure that the object or data source where _id is coming from is being properly initialized and populated.

// Data Fetching: If the data is fetched asynchronously (e.g., from an API), ensure that you have appropriate checks in place before trying to access properties of the data.

// Defensive Programming: Always ensure that the object exists before trying to access its properties:

// javascript
// Copy code
// if (object && object._id) {
//   // Access object._id or do something with it
// }
// Use PropTypes or TypeScript: If you're passing this object as a prop, consider using PropTypes (in the case of React) or TypeScript to enforce type checking. This can help in catching issues related to incorrect or missing data early on.

// Debugging: Use debugging tools like Chrome DevTools (for React) or React Native Debugger (for React Native) to set breakpoints and inspect the object or variable in question to understand its state at the point of error.

// Reproducibility: If the error doesn't always occur, try to identify specific scenarios or conditions under which it does. This can give clues about its origin.

// Redux or Global State: If you're using Redux or any other state management solution, ensure that the initial state is correctly set up, and any reducers or actions that modify this object are functioning as expected.

// Component Hierarchy: Use the stack trace to see the parent components (Home in this case) and verify if the prop or data passed down is being sourced correctly.

// Logging: If the bug is elusive, consider adding logs at different points in your application to trace the data flow and its state at various stages.

// By following these steps and focusing primarily on the ChatDrawer component, you should be able to identify and fix the issue causing the error.

// User
// error is originating from the ChatDrawer component:
// const ChatDrawer = ({
//   activeChats,
//   setCurrentChatFriend,
//   friend,
//   onClose,
//   chatMessages,
//   addMessageToState,
// }) => {
//   console.log('Render ChatDrawer Component')
//   console.log('Chat Messages', chatMessages)
//   const [message, setMessage] = useState('')
//   // const [chatMessages, setChatMessages] = useState([])
//   const { user } = useUser()
//   const userId = user?.userId
//   const chatId = getChatId(userId, friend._id)
//   const currentMessages = chatMessages[chatId] || []

//   // const socket = useSocket(addMessageToState)
//   const socket = useContext(SocketContext)

//   const sendMessage = () => {
//     const newMessage = {
//       sender: userId,
//       recipient: friend._id,
//       content: message,
//     }

//     // Check if the recipient is online before sending the message
//     if (friend.isOnline) {
//       console.log(`Sending message: ${message} to ${friend.username}`)
//       if (socket) {
//         socket.emit('new-message', newMessage)
//       }
//     } else {
//       // Handle the case where the recipient is offline (e.g., display a notification).
//       console.log(`Recipient ${friend.username} is offline. Message not sent.`)
//       // You can implement logic to store the message and send it later when the recipient is online.
//       // addMessageToQueue(newMessage); // Example: Store the message in a queue.
//     }

//     addMessageToState(newMessage) // Use the function to organize the message
//     setMessage('') // Resetting the input after sending.
//   }
//   const [notifications, setNotifications] = useState({})

//   // Function to handle received messages
//   function handleMessageReceived(message) {
//     if (message.sender !== friend._id) {
//       setNotifications(prev => ({
//         ...prev,
//         [message.sender]: (prev[message.sender] || 0) + 1,
//       }))
//     }
//   }
//   // Receiving a message
//   useEffect(() => {
//     if (socket) {
//       socket.on('receive-message', message => {
//         console.log('Received message:', message)

//         // Handle the incoming message
//         addMessageToState(message)
//         handleMessageReceived(message)

//         ToastAndroid.showWithGravity(
//           `New message from ${message.sender}`,
//           ToastAndroid.SHORT,
//           ToastAndroid.CENTER
//         )
//       })

//       return () => {
//         socket.off('receive-message')
//       }
//     }
//   }, [socket])

//   useEffect(() => {
//     console.log('chatMessages changed:', chatMessages)
//   }, [chatMessages])

//   console.log('Current Messages:', currentMessages)
//   return (
//     <View style={styles.chatDrawerContainer}>
//       <TouchableOpacity
//         onPress={onClose}
//         style={{ position: 'absolute', top: 10, right: 10 }}
//       >
//         <Text>X</Text>
//       </TouchableOpacity>

//       {/* <ScrollView horizontal={true} style={styles.bubbleContainer}>
//         {activeChats.map(friend => (
//           <ChatBubble
//             key={friend._id}
//             friend={friend}
//             onClick={setCurrentChatFriend}
//           />
//         ))}
//       </ScrollView> */}
//       <ScrollView>
//         {activeChats.map(chatFriend => (
//           <TouchableOpacity
//             key={chatFriend._id}
//             onPress={() => {
//               setCurrentChatFriend(chatFriend)
//               handleChatOpened(chatFriend._id)
//             }}
//           >
//             {/* Your ChatBubble component here */}
//             {notifications[chatFriend._id] && (
//               <Text style={{ color: 'red' }}>
//                 {notifications[chatFriend._id]}
//               </Text>
//             )}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <Text>Chat with {friend.username}</Text>
//       <ScrollView>
//         {currentMessages.map((msg, index) => (
//           <View
//             key={index}
//             style={{ flexDirection: 'row', alignItems: 'center' }}
//           >
//             {msg.sender === userId ? (
//               <Text>You: {msg.content}</Text>
//             ) : (
//               <React.Fragment>
//                 {friend.photoUrl ? (
//                   <Image
//                     source={{ uri: friend.photoUrl }}
//                     style={styles.profilePic}
//                   />
//                 ) : (
//                   <DefaultIcon
//                     name='chatbubble-outline'
//                     size={30}
//                     color={'blue'}
//                   />
//                 )}
//                 <Text>
//                   {friend.username}: {msg.content}
//                 </Text>
//               </React.Fragment>
//             )}
//           </View>
//         ))}
//       </ScrollView>
//       <TextInput
//         value={message}
//         onChangeText={setMessage}
//         style={styles.textInput}
//         placeholder='Type a message...'
//       />
//       <Button title='Send' onPress={sendMessage} />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   // chatDrawerContainer: {
//   //   flex: 1,
//   //   flexDirection: 'column',
//   //   width: '100%',
//   //   backgroundColor: 'white',
//   //   padding: 10,
//   //   borderTopLeftRadius: 10,
//   //   borderTopRightRadius: 10,
//   // },
//   chatDrawerContainer: {
//     position: 'absolute',
//     bottom: 60, // To position it just above the message bubble
//     right: 10,
//     width: 300,
//     height: 400,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     // ... other styles
//   },
//   textInput: {
//     padding: 10,
//     borderColor: 'black',
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   bubbleContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#e1e8ee',
//   },
//   bubble: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   chatBubble: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//     // ... other styles as needed
//   },
//   profilePic: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
// })

// export default ChatDrawer
// ChatGPT
// Thank you for sharing the ChatDrawer component code. Your error is TypeError: Cannot read property '_id' of null, which means that somewhere in this component, you're trying to access an _id property of an object that is null.

// Let's look at all the places where _id is accessed:

// const chatId = getChatId(userId, friend._id);
// const newMessage = { sender: userId, recipient: friend._id, content: message, }
// Various instances where friend._id and chatFriend._id are used in JSX rendering.
// It appears that the friend prop might be the potential cause of the problem. If friend is null or undefined when the component is rendered, you'll encounter the mentioned error.

// To fix this:

// Guard Clauses: Before using the friend object, check if it exists.

// javascript
// Copy code
// if (!friend) {
//     return null; // or some placeholder component or JSX.
// }
// Default Props: If the ChatDrawer is expected to always receive a friend prop, then you might want to ensure it's being passed to the component in all instances. If not, consider providing default props:

// javascript
// Copy code
// ChatDrawer.defaultProps = {
//     friend: {}, // default empty object
//     // ... other defaultProps
// };
// PropTypes: As previously suggested, use PropTypes to ensure type safety:

// javascript
// Copy code
// ChatDrawer.propTypes = {
//     friend: PropTypes.shape({
//         _id: PropTypes.string.isRequired,
//         username: PropTypes.string,
//         // ... other properties
//     }).isRequired,
//     // ... other propTypes
// };
// Parent Component: Check the parent component (in this case, the Home component) that's rendering the ChatDrawer. Ensure that the friend object is correctly passed as a prop to ChatDrawer.

// Logging: Add some logs to check the value of friend when ChatDrawer is rendered. This will give more insight into the problem.

// javascript
// Copy code
// console.log('Friend prop:', friend);
// Consider Use Cases: Ensure there are no use-cases or paths in your application where ChatDrawer is rendered without the friend prop or where the friend prop might be null.

// Once you've checked and implemented the above steps, you should be able to identify the root cause of the error and fix it.

// User
// it is being passed as currentChatFriend in home:
// import { View, Text, Image, StyleSheet } from 'react-native'
// import { useState, useEffect, useCallback } from 'react'
// import EventsContainer from '../Events/EventsContainer'
// import EventsItem from '../Events/EventsItem'
// import MessageBubble from '../Messages/MessageBubble'
// import ChatDrawer from '../Social/ChatDrawer'
// import OnlineOfflineFriends from '../Friends/OnlineOffline'

// const Home = () => {
//   const [activeChats, setActiveChats] = useState([]) // List of active chats
//   const [unreadCount, setUnreadCount] = useState(0) // Total unread messages
//   const [showChats, setShowChats] = useState(false) // State to toggle the chat list
//   const [notifications, setNotifications] = useState({})
//   const [chatMessages, setChatMessages] = useState({})
//   const [currentChatFriend, setCurrentChatFriend] = useState(null)
//   const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)

//   const addMessageToState = useCallback(message => {
//     const context = 'addMessageToState'
//     console.info(
//       `[INFO][${context}] Received message from ${message.sender} to ${message.recipient}`
//     )

//     const chatId = getChatId(message.sender, message.recipient)
//     console.info(context, `Generated chatId: ${chatId}`)

//     setChatMessages(prev => {
//       console.info(
//         context,
//         `Previous messages for chatId ${chatId}: ${JSON.stringify(
//           prev[chatId]
//         )}`
//       )

//       const newMessagesForChatId = [...(prev[chatId] || []), message]
//       console.info(
//         context,
//         `New messages for chatId ${chatId}: ${JSON.stringify(
//           newMessagesForChatId
//         )}`
//       )
//       const newChatMessages = {
//         ...prev,
//         [chatId]: newMessagesForChatId,
//       }
//       console.info(
//         context,
//         `Updated chatMessages state: ${JSON.stringify(newChatMessages)}`
//       )

//       return newChatMessages
//     })
//   }, [])

//   const handleMessageReceived = message => {
//     // Handle the incoming message here
//     // Probably update the chatMessages state
//   }
//   const toggleChatDrawer = () => {
//     setChatDrawerOpen(prevState => !prevState)
//   }
//   const onClose = () => {
//     setCurrentChatFriend(null)
//     setChatDrawerOpen(false)
//   }

//   useEffect(() => {
//     const totalUnread = Object.values(notifications).reduce((a, b) => a + b, 0)
//     setUnreadCount(totalUnread)
//   }, [notifications])

//   return (
//     <View style={styles.welcomeXmas}>
//       <Text style={styles.welcome}>Welcome to your Home Page!</Text>
//       <Text>Please navigate using the menu in the top right</Text>
//       <EventsContainer />
//       <EventsItem />
//       <View style={styles.bottomRightCorner}>
//         <MessageBubble unreadCount={unreadCount} onClick={toggleChatDrawer} />
//       </View>

//       {isChatDrawerOpen && (
//         <ChatDrawer
//           onMessageReceived={handleMessageReceived}
//           activeChats={activeChats}
//           setCurrentChatFriend={setCurrentChatFriend}
//           friend={currentChatFriend}
//           onClose={onClose}
//           chatMessages={chatMessages}
//           addMessageToState={addMessageToState} // This might need refactoring
//         />
//       )}

//       <OnlineOfflineFriends
//         activeChats={activeChats}
//         setActiveChats={setActiveChats}
//         setCurrentChatFriend={setCurrentChatFriend}
//         setChatDrawerOpen={setChatDrawerOpen}
//         chatMessages={chatMessages}
//         setChatMessages={setChatMessages}
//         addMessageToState={addMessageToState}
//       />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   welcomeXmas: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     resizeMode: 'contain',
//   },
//   welcome: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 10,
//   },
// })
// export default Home
// ChatGPT
// Alright, in the Home component, the ChatDrawer component is conditionally rendered based on the value of isChatDrawerOpen.

// From the code you provided, the initial value of currentChatFriend is null. It's only when you interact with OnlineOfflineFriends that you probably select a friend to chat with and update the currentChatFriend state.

// However, there are a couple of potential issues that could arise:

// Rendering the ChatDrawer Without a Selected Friend: If for some reason isChatDrawerOpen is set to true before a friend is selected via setCurrentChatFriend, then the ChatDrawer would be rendered with currentChatFriend being null, leading to the error you encountered.

// The onClose Function: The function onClose sets currentChatFriend to null, which could lead to an issue if the ChatDrawer is re-rendered before it's removed from the view.

// Suggestions to Resolve the Error:

// Check Before Rendering: Ensure that both isChatDrawerOpen is true and currentChatFriend is not null before rendering the ChatDrawer.

// Replace:

// javascript
// Copy code
// {isChatDrawerOpen && (
//    <ChatDrawer
//      ...
//    />
// )}
// With:

// javascript
// Copy code
// {isChatDrawerOpen && currentChatFriend && (
//    <ChatDrawer
//      ...
//    />
// )}
// Modify onClose: Modify the onClose function so that it first sets isChatDrawerOpen to false and only after a short delay, reset the currentChatFriend:

// javascript
// Copy code
// const onClose = () => {
//     setChatDrawerOpen(false);
//     setTimeout(() => {
//         setCurrentChatFriend(null);
//     }, 100);
// }
// This will ensure that even if ChatDrawer rerenders due to other state/props changes, it won't run into issues as it's getting removed, since the currentChatFriend will only be reset after a slight delay.

// Guard Clause in ChatDrawer: As suggested earlier, add a guard clause at the start of the ChatDrawer component:

// javascript
// Copy code
// if (!friend) {
//     return null;
// }
// This will be an extra precaution to ensure that the component doesn't proceed to render if the friend prop is not available.

// With these changes, the error you're seeing should be mitigated. However, always test thoroughly after making these modifications to ensure that no new issues arise and the app behaves as expected.

// User
// shouldnt this also display a message on click like 'No active Chats or something instead of just rendering nothing?
// ChatGPT
// Absolutely! If you want to provide a more user-friendly experience, showing a message when no active chats are available is a great idea.

// Here's how you can achieve this:

// In the ChatDrawer component:
// Add a check at the beginning to see if there's no friend provided:

// javascript
// Copy code
// if (!friend) {
//     return (
//         <View style={styles.noActiveChatContainer}>
//             <Text>No active chats</Text>
//         </View>
//     );
// }
// For styling, you might want to add this to your styles:

// javascript
// Copy code
// noActiveChatContainer: {
//     position: 'absolute',
//     bottom: 60,
//     right: 10,
//     width: 300,
//     height: 400,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     justifyContent: 'center', // To center the text vertically
//     alignItems: 'center', // To center the text horizontally
// },
// In the Home component:
// When you're rendering the ChatDrawer, you don't need to check for currentChatFriend anymore, since the ChatDrawer component will now handle the scenario where no friend is selected:

// javascript
// Copy code
// {isChatDrawerOpen && (
//     <ChatDrawer
//         ...
//     />
// )}
// With this setup, when the user opens the chat drawer without selecting a friend or if for any reason the friend isn't provided to the ChatDrawer, they'll see a "No active chats" message, providing a clearer indication of the state of the application.

// User
// import React, { useState, useEffect, useContext } from 'react'
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Image,
//   ToastAndroid,
// } from 'react-native'
// // import useSocket from '../Socket/useSocket'
// import { useUser } from '../API/AuthService'
// import { getChatId } from '../utility/utility'
// import DefaultIcon from 'react-native-vector-icons/Ionicons'
// import SocketContext from '../API/SocketContext'

// {
//   /* Keep this ChatBubble component for possible group messages later, it will display the user photo in line with the text so its easier to see who sent it*/
// }
// // const ChatBubble = ({ friend }) => {
// //   return (
// //     <TouchableOpacity style={styles.bubble}>
// //       {friend.photoUrl ? (
// //         <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
// //       ) : (
// //         <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
// //       )}
// //     </TouchableOpacity>
// //   )
// // }

// const ChatDrawer = ({
//   activeChats,
//   setCurrentChatFriend,
//   friend,
//   onClose,
//   chatMessages,
//   addMessageToState,
// }) => {
//   console.log('Render ChatDrawer Component')
//   console.log('Chat Messages', chatMessages)
//   const [message, setMessage] = useState('')
//   // const [chatMessages, setChatMessages] = useState([])
//   const { user } = useUser()
//   const userId = user?.userId
//   const chatId = getChatId(userId, friend._id)
//   const currentMessages = chatMessages[chatId] || []

//   // const socket = useSocket(addMessageToState)
//   const socket = useContext(SocketContext)

//   const sendMessage = () => {
//     const newMessage = {
//       sender: userId,
//       recipient: friend._id,
//       content: message,
//     }

//     // Check if the recipient is online before sending the message
//     if (friend.isOnline) {
//       console.log(`Sending message: ${message} to ${friend.username}`)
//       if (socket) {
//         socket.emit('new-message', newMessage)
//       }
//     } else {
//       // Handle the case where the recipient is offline (e.g., display a notification).
//       console.log(`Recipient ${friend.username} is offline. Message not sent.`)
//       // You can implement logic to store the message and send it later when the recipient is online.
//       // addMessageToQueue(newMessage); // Example: Store the message in a queue.
//     }

//     addMessageToState(newMessage) // Use the function to organize the message
//     setMessage('') // Resetting the input after sending.
//   }
//   const [notifications, setNotifications] = useState({})

//   // Function to handle received messages
//   function handleMessageReceived(message) {
//     if (message.sender !== friend._id) {
//       setNotifications(prev => ({
//         ...prev,
//         [message.sender]: (prev[message.sender] || 0) + 1,
//       }))
//     }
//   }
//   // Receiving a message
//   useEffect(() => {
//     if (socket) {
//       socket.on('receive-message', message => {
//         console.log('Received message:', message)

//         // Handle the incoming message
//         addMessageToState(message)
//         handleMessageReceived(message)

//         ToastAndroid.showWithGravity(
//           `New message from ${message.sender}`,
//           ToastAndroid.SHORT,
//           ToastAndroid.CENTER
//         )
//       })

//       return () => {
//         socket.off('receive-message')
//       }
//     }
//   }, [socket])

//   useEffect(() => {
//     console.log('chatMessages changed:', chatMessages)
//   }, [chatMessages])

//   console.log('Current Messages:', currentMessages)
//   if (!friend) {
//     return (
//       <View style={styles.noActiveChatContainer}>
//         <Text>No active chats</Text>
//       </View>
//     )
//   }
//   return (
//     <View style={styles.chatDrawerContainer}>
//       <TouchableOpacity
//         onPress={onClose}
//         style={{ position: 'absolute', top: 10, right: 10 }}
//       >
//         <Text>X</Text>
//       </TouchableOpacity>

//       {/* <ScrollView horizontal={true} style={styles.bubbleContainer}>
//         {activeChats.map(friend => (
//           <ChatBubble
//             key={friend._id}
//             friend={friend}
//             onClick={setCurrentChatFriend}
//           />
//         ))}
//       </ScrollView> */}
//       <ScrollView>
//         {activeChats.map(chatFriend => (
//           <TouchableOpacity
//             key={chatFriend._id}
//             onPress={() => {
//               setCurrentChatFriend(chatFriend)
//               handleChatOpened(chatFriend._id)
//             }}
//           >
//             {/* Your ChatBubble component here */}
//             {notifications[chatFriend._id] && (
//               <Text style={{ color: 'red' }}>
//                 {notifications[chatFriend._id]}
//               </Text>
//             )}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <Text>Chat with {friend.username}</Text>
//       <ScrollView>
//         {currentMessages.map((msg, index) => (
//           <View
//             key={index}
//             style={{ flexDirection: 'row', alignItems: 'center' }}
//           >
//             {msg.sender === userId ? (
//               <Text>You: {msg.content}</Text>
//             ) : (
//               <React.Fragment>
//                 {friend.photoUrl ? (
//                   <Image
//                     source={{ uri: friend.photoUrl }}
//                     style={styles.profilePic}
//                   />
//                 ) : (
//                   <DefaultIcon
//                     name='chatbubble-outline'
//                     size={30}
//                     color={'blue'}
//                   />
//                 )}
//                 <Text>
//                   {friend.username}: {msg.content}
//                 </Text>
//               </React.Fragment>
//             )}
//           </View>
//         ))}
//       </ScrollView>
//       <TextInput
//         value={message}
//         onChangeText={setMessage}
//         style={styles.textInput}
//         placeholder='Type a message...'
//       />
//       <Button title='Send' onPress={sendMessage} />
//     </View>
//   )
// }
