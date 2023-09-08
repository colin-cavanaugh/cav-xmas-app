import 'react-native-gesture-handler'
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/Ionicons.js'
import { useUser } from './components/API/AuthService.js'

// Components
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import Events from './components/Events/Events.js'
import AddFriends from './components/Friends/AddFriends.js'
import SocialDrawer from './components/Social/SocialDrawer.js'
import ChatDrawer from './components/Social/ChatDrawer.js'
import BottomTabNavigator from './components/Social/BottomTabNavigator.js'
import { useFriends } from './components/Friends/UseFriends.js'
import useSocket from './components/Socket/useSocket.js'

type RootStackParamList = {
  Home: undefined
  Profile: undefined
  AddFriends: undefined
  Events: undefined
  Details: { itemId: number }
  Login: undefined
}

const Stack = createStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator<RootStackParamList>()

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useUser()
  const userId = user?.userId
  const { friends } = useFriends(userId)

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
          Welcome!
        </Text>
        <Image
          source={require('./components/Images/xmas_tree_cartoon.png')} // Replace with the actual image path
          style={{ width: 80, height: 80, borderRadius: 50 }}
        />
        <Text style={{ fontSize: 18, marginTop: 5 }}>{user?.username}</Text>
      </View>
      <DrawerItemList {...props} />

      <DrawerItem
        label='Logout'
        onPress={() => {
          console.log('Logout pressed')
          logout()
        }}
      />
      {/* <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'blue' }}>
          Friends List
        </Text>
        <FlatList
          data={friends}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => <Text>{item.username}</Text>}
          scrollEnabled={false} // disable scrolling
        />
      </View> */}
      {/* Add more DrawerItem here to add more custom items */}
    </DrawerContentScrollView>
  )
}

function App() {
  // const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout, loading } = useUser()
  const userId = user?.userId
  const { friends } = useFriends(userId) // Here we get the friends

  // useEffect(() => {
  //   console.log('menuOpen', menuOpen)
  // }, [menuOpen])

  // const toggleMenu = () => {
  //   setMenuOpen(!menuOpen)
  // }

  const [isSocialDrawerOpen, setSocialDrawerOpen] = useState(false) // state for SocialDrawer
  const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)
  const [currentChatFriend, setCurrentChatFriend] = useState<Friend | null>(
    null
  )

  const toggleSocialDrawer = () => setSocialDrawerOpen(!isSocialDrawerOpen) // function to toggle SocialDrawer
  // Define the Friend interface
  interface Friend {
    _id: string
    username: string
    isOnline?: boolean // Assuming isOnline is optional
  }
  type SocialDrawerProps = {
    friends: Friend[]
    openChat: (friend: Friend) => void
  }
  const SocialDrawerWrapper = () => {
    // You can fetch friends or any required data here
    // You can also define any required handlers here

    return <SocialDrawer friends={someFriendsArray} openChat={someHandler} />
  }
  const openChat = (friend: Friend) => {
    Alert.alert('Chat Opened', `Now chatting with ${friend.username}`)
    setCurrentChatFriend(friend)
    setChatDrawerOpen(true)
  }

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {user ? (
          <>
            <Drawer.Navigator
              initialRouteName='Home'
              screenOptions={{
                drawerStyle: { width: Dimensions.get('window').width * 0.5 },
              }}
              drawerContent={props => <CustomDrawerContent {...props} />}
            >
              <Drawer.Screen name='Home' component={Home} />
              <Drawer.Screen name='Profile' component={Profile} />
              <Drawer.Screen name='AddFriends' component={AddFriends} />
              <Drawer.Screen name='Events' component={Events} />
              <Drawer.Screen name='Social' component={SocialDrawer} />
              <Drawer.Screen name='BottomTabs' component={BottomTabNavigator} />
            </Drawer.Navigator>
            {/* Button to toggle SocialDrawer */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'white',
                paddingHorizontal: 20,
                paddingVertical: 10,
                // borderRadius: 5,
              }}
              onPress={toggleSocialDrawer}
            >
              <Icon name='people' size={30} color='#607D8B' />
            </TouchableOpacity>

            {/* SocialDrawer */}
            {isSocialDrawerOpen && (
              <TouchableWithoutFeedback onPress={toggleSocialDrawer}>
                <View
                  style={{
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: -75,
                    bottom: 0,
                  }}
                >
                  <SocialDrawer friends={friends} openChat={openChat} />
                </View>
              </TouchableWithoutFeedback>
            )}
            {isChatDrawerOpen && currentChatFriend && (
              <TouchableWithoutFeedback
                onPress={() => setChatDrawerOpen(false)}
              >
                <View
                  style={{
                    flex: 1,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: -75,
                    bottom: 0,
                  }}
                >
                  <ChatDrawer friend={currentChatFriend} />
                </View>
              </TouchableWithoutFeedback>
            )}
            {/* <TouchableOpacity
              // ... position styling
              onPress={toggleActiveChatsDrawer} // You'd define this function
            >
              <Icon name='chatbubbles' size={30} color='#607D8B' />
            </TouchableOpacity> */}
          </>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name='Login'
              component={Login}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        )}
      </View>
    </NavigationContainer>
  )
}

export default App
