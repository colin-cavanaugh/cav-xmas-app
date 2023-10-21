import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native'
import DefaultPhoto from 'react-native-vector-icons/FontAwesome'
import ChatIcon from 'react-native-vector-icons/SimpleLineIcons'
import { UserContext } from '../API/UserProvider'
import Snowfall from '../Snowflake/Snowfall'

const CustomHeader = () => {
  const navigation = useNavigation()
  const { user, setUser } = useContext(UserContext)

  //   const windowWidth = Dimensions.get('window').width
  //   const snowflakes = Array.from({ length: 100 }).map(() => ({
  //     size: Math.random() * 10 + 5,
  //     left: Math.random() * windowWidth,
  //     duration: Math.random() * 3000 + 2000,
  //   }))

  return (
    <View style={styles.view}>
      {/* <View style={styles.snowflakeContainer}>
        <Snowfall />
      </View> */}
      <TouchableOpacity
        onPress={() => navigation.toggleDrawer()}
        style={styles.iconContainer}
      >
        {user ? (
          <Image
            source={require('../Images/xmas_tree_cartoon.png')}
            style={{ width: 65, height: 65 }}
          />
        ) : (
          <DefaultPhoto name={'file-photo-o'} size={30} color='#000000' />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Chat', {
            exampleProp: 'Hello from navigator!',
          })
        }
        style={styles.chatIconContainer}
      >
        <ChatIcon name='bubble' size={30} color='#000' />
      </TouchableOpacity>
    </View>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // padding: 10,
    backgroundColor: '#afbedd',
    height: 75, // Adjust this value based on your header's desired height
  },
  snowflakeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  iconContainer: {
    zIndex: 3,
    justifyContent: 'left',
    alignItems: 'left',
    height: '100%',
  },
  chatIconContainer: {
    zIndex: 2,
    margin: 10,
  },
})
