import React, { useState } from 'react'
import axios from 'axios'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useUser } from '../API/AuthService.js'

const Profile = () => {
  const [userPhoto, setUserPhoto] = useState(null)
  const { user } = useUser()
  const userId = user?.userId

  return (
    <View>
      <Text>Profile Component</Text>
    </View>
  )
}

export default Profile
