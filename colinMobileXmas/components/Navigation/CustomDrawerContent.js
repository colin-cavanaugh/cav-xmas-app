import React, { useState, useContext } from 'react'
import { UserContext } from '../API/UserProvider'
import { logout } from '../API/AuthService'
// import { useFriends } from '../Friends/UseFriends'
import { View, Image, Text } from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import DefaultPhoto from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'

function CustomDrawerContent({ ...props }) {
  const { user, setUser, showToast } = useContext(UserContext)
  const userId = user?.userId
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      setUser(null) // Reset the UserContext to its initial state or any logged-out state
      showToast('Logged out successfully!')
      navigation.navigate('Login') // Navigate to Login screen or any initial screen
    } catch (error) {
      console.error('Logout failed', error)
      // Handle error. Maybe show a message to the user
    }
    setIsLoading(false)
  }
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        {user && user.photoUrl ? (
          <Image
            source={{ uri: user.photoUrl }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 50,
              margin: 5,
            }}
          />
        ) : (
          <DefaultPhoto name={'file-photo-o'} size={30} color='#000000' />
        )}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
          Welcome!
        </Text>
        <Text style={{ fontSize: 18, marginTop: 5 }}>{user?.username}</Text>
      </View>
      <DrawerItemList {...props} />

      <DrawerItem
        label='Logout'
        onPress={() => {
          console.log('Logout pressed')
          handleLogout()
          disabled = { isLoading }
        }}
      />
      {/* Add more DrawerItem here to add more custom items */}
    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent
