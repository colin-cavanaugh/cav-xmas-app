import 'react-native-gesture-handler'
import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { useUser } from './components/API/AuthService.js'

// Components
import Header from './components/Header/Header'
import Login from './components/Login/Login'
import Home from './components/Home/Home'
import Profile from './components/Profile/Profile'
import Events from './components/Events/Events.js'
import AddFriends from './components/Friends/AddFriends.js'
import { useFriends } from './components/Friends/UseFriends.js'

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
  const friendsOnline = ['Chelsey', 'Lucy', 'Lola']
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
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ fontSize: 18, marginTop: 5 }}>{user?.username}</Text>
      </View>
      <DrawerItemList {...props} />

      <DrawerItem
        label='Logout'
        onPress={() => {
          logout()
        }}
      />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'blue' }}>
          Friends List
        </Text>
        <FlatList
          data={friends}
          keyExtractor={(item: any) => item._id}
          renderItem={({ item }) => <Text>{item.username}</Text>}
          scrollEnabled={false} // disable scrolling
        />
      </View>
      {/* Add more DrawerItem here to add more custom items */}
    </DrawerContentScrollView>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout, loading } = useUser()

  useEffect(() => {
    console.log('menuOpen', menuOpen)
  }, [menuOpen])

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <NavigationContainer>
      {user ? (
        <Drawer.Navigator
          initialRouteName='Home'
          drawerContent={props => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name='Home' component={Home} />
          <Drawer.Screen name='Profile' component={Profile} />
          <Drawer.Screen name='AddFriends' component={AddFriends} />
          <Drawer.Screen name='Events' component={Events} />
        </Drawer.Navigator>
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
