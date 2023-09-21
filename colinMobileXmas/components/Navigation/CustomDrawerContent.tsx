import React from 'react'
import { useUser } from '../API/UserProvider'
import { useFriends } from '../Friends/UseFriends'
import { View, Image, Text } from 'react-native'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import DefaultPhoto from 'react-native-vector-icons/FontAwesome'

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, logout } = useUser()
  const userId = user?.userId
  // const { friends } = useFriends(userId)

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
          logout()
        }}
      />
      {/* Add more DrawerItem here to add more custom items */}
    </DrawerContentScrollView>
  )
}

export default CustomDrawerContent
