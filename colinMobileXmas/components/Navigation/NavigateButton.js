import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons.js'
const NavigateButton = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
      onPress={() => {
        navigation.navigate('FriendsNav')
      }}
    >
      <Icon name='people' size={30} color='#607D8B' />
    </TouchableOpacity>
  )
}

export default NavigateButton
