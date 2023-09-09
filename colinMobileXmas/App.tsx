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
import {
  NavigationContainer,
  useNavigation,
  useRoute,
  useNavigationState,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'

// import Icon from 'react-native-vector-icons/Ionicons.js'
import Icon from 'react-native-vector-icons/Octicons.js'
import Search from 'react-native-vector-icons/MaterialCommunityIcons.js'
import UserIcon from 'react-native-vector-icons/Feather.js'
import { useUser } from './components/API/AuthService.js'
import { StackNavigationProp } from '@react-navigation/stack'

// Components
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import Events from './components/Events/Events.js'
import OnlineOfflineFriends from './components/Friends/OnlineOfflineFriends.js'
import PendingRequests from './components/Friends/PendingRequests.js'
import SearchAddFriends from './components/Friends/SearchAddFriends.js'
// import AddFriends from './components/Friends/AddFriends.js'
import SocialDrawer from './components/Social/SocialDrawer.js'
import ChatDrawer from './components/Social/ChatDrawer.js'
// import BottomTabNavigator from './components/Social/BottomTabNavigator.js'
import { useFriends } from './components/Friends/UseFriends.js'
import useSocket from './components/Socket/useSocket.js'
import NavigateButton from './components/Navigation/NavigateButton.js'

type RootStackParamList = {
  Home: undefined
  Profile: undefined
  AddFriends: undefined
  Events: undefined
  Details: { itemId: number }
  Login: undefined
  FriendsNav: undefined
  Drawer: undefined
}
type MainStackParamList = {
  MainDrawer: undefined
  FriendsTabsModal: undefined
}
type FriendsButtonProps = {
  navigation: StackNavigationProp<MainStackParamList>
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
      {/* Add more DrawerItem here to add more custom items */}
    </DrawerContentScrollView>
  )
}

function MainSideDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      screenOptions={{
        drawerStyle: { width: Dimensions.get('window').width * 0.5 },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name='Home' component={Home} />
      <Drawer.Screen name='Profile' component={Profile} />
      <Drawer.Screen name='Events' component={Events} />
    </Drawer.Navigator>
  )
}

const FriendsTab = createBottomTabNavigator()

function FriendsTabNavigator() {
  return (
    <FriendsTab.Navigator
      screenOptions={{
        tabBarLabel: '',
        tabBarStyle: { height: 60, justifyContent: 'center' }, // Adjust the height as needed
        tabBarItemStyle: { justifyContent: 'center', alignItems: 'center' },
      }}
    >
      <FriendsTab.Screen
        name='Friends'
        component={OnlineOfflineFriends}
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserIcon
              name='user-check'
              color={color}
              size={35}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{ translateX: -15 }, { translateY: -15 }],
              }}
            />
          ),
        }}
      />
      <FriendsTab.Screen
        name='Requests'
        component={PendingRequests}
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserIcon
              name='user-plus'
              color={color}
              size={35}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{ translateX: -15 }, { translateY: -15 }],
              }}
            />
          ),
        }}
      />
      <FriendsTab.Screen
        name='Add'
        component={SearchAddFriends}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Search
              name='account-search'
              color={color}
              size={35}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{ translateX: -15 }, { translateY: -15 }],
              }}
            />
          ),
        }}
      />
    </FriendsTab.Navigator>
  )
}
function FriendsButton() {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>()

  const currentRouteName = useNavigationState(
    state => state?.routes?.[state.index]?.name
  )

  const handlePress = () => {
    if (currentRouteName === 'FriendsTabsModal') {
      navigation.goBack()
    } else {
      navigation.navigate('FriendsTabsModal')
    }
  }

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 100,
        right: 0,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
      onPress={handlePress}
    >
      <Icon name='people' size={30} color='#607D8B' />
    </TouchableOpacity>
  )
}
const MainStack = createStackNavigator<MainStackParamList>()
function App() {
  const { user, logout, loading } = useUser()
  const userId = user?.userId
  const { friends } = useFriends(userId) // Here we get the friends

  const [isSocialDrawerOpen, setSocialDrawerOpen] = useState(false) // state for SocialDrawer
  const [isChatDrawerOpen, setChatDrawerOpen] = useState(false)
  const [currentChatFriend, setCurrentChatFriend] = useState<Friend | null>(
    null
  )
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

  const toggleSocialDrawer = () => setSocialDrawerOpen(!isSocialDrawerOpen) // function to toggle SocialDrawer

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
      {user ? (
        <>
          <MainStack.Navigator
            screenOptions={{ presentation: 'modal' }}
            // headerMode='none'
          >
            <MainStack.Screen
              name='MainDrawer'
              component={MainSideDrawer}
              options={{ headerShown: false }}
            />
            <MainStack.Screen
              name='FriendsTabsModal'
              component={FriendsTabNavigator}
              options={{
                cardStyle: { backgroundColor: 'transparent' }, // This makes modal transparent
                cardOverlayEnabled: true, // This renders a semi-transparent overlay below the modal
              }}
            />
          </MainStack.Navigator>
          {/* <NavigateButton /> */}

          <FriendsButton />

          {isChatDrawerOpen && currentChatFriend && (
            <TouchableWithoutFeedback onPress={() => setChatDrawerOpen(false)}>
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

          {isSocialDrawerOpen && (
            <SocialDrawer friends={friends} openChat={openChat} />
          )}
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
    </NavigationContainer>
  )
}

export default App
