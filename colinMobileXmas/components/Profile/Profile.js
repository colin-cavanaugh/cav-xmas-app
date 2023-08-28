import React, { useState } from 'react'
import axios from 'axios'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { useUser } from '../API/AuthService.js'
import ImagePicker from 'react-native-image-picker'

const Profile = () => {
  const [userPhoto, setUserPhoto] = useState(null)
  const { user } = useUser()
  const userId = user?.userId

  const pickImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }
  }

  ImagePicker.showImagePicker(options, response => {
    if (response.didCancel) {
      console.log('User cancelled image picker')
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error)
    } else {
      const { uri, type, fileName } = response
      uploadImage({ uri, type, name: fileName })
    }
  })

  const uploadImage = async image => {
    let formData = new FormData()
    formData.append('photo', image)

    // API call to upload image
    try {
      const response = await axios.post(
        'http://192.168.0.12:8000/api/user/:id/photo',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      console.log(response.data)
    } catch (error) {
      console.error('Error uploading the image: ', error)
    }
  }

  return (
    <View>
      <Text>Profile Component</Text>
      <TouchableOpacity onPress={pickImage}>
        <Text>Upload Image</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Profile
