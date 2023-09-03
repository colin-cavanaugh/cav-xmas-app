import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { View, Text, Image, Button, TouchableOpacity } from 'react-native'
import { useUser } from '../API/AuthService.js'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
// import { BACKEND_URL } from '@env'

const Profile = () => {
  // const [userPhoto, setUserPhoto] = useState(null)
  const { user, setUser } = useUser()
  const userId = user?.userId

  useEffect(() => {
    console.log('User state changed Profile Component:', user)
  }, [user])

  const pickImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }

    launchImageLibrary(options, response => {
      console.log('Image picker response:', response)
      const imageDetails = response.assets && response.assets[0]
      if (imageDetails) {
        const { uri, type, fileName: name } = imageDetails
        uploadImage({ uri, type, name })
      } else {
        console.log('No image details found in the response')
      }
    })
  }
  async function uploadImageToFirebase(imageUri, userId) {
    try {
      const filename = `${userId}_${Date.now()}.jpg` // Create a unique filename
      const reference = storage().ref(filename)
      console.log('Image Filename:', filename)
      await reference.putFile(imageUri)

      const url = await reference.getDownloadURL()
      return url
    } catch (error) {
      console.error('Error in uploadImageToFirebase: ', error)
    }
  }

  const uploadImage = async image => {
    // API call to upload image
    if (!image || !image.uri) {
      console.error('Image or image URI is undefined:', image)
      return
    }

    try {
      const cleanUri = image.uri.startsWith('file://')
        ? image.uri.slice(7)
        : image.uri
      console.log('Original URI:', image.uri)
      console.log('Cleaned URI:', cleanUri)
      const downloadURL = await uploadImageToFirebase(image.uri, userId)
      console.log('Download URL:', downloadURL)

      // Once download URL is obtained, save it to mongoDB
      const response = await axios.put(
        `http://192.168.0.12:8000/api/user/${userId}/photo`,
        { photoUrl: downloadURL },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      console.log('Sent photoUrl:', { photoUrl: downloadURL })
      console.log(response.data)

      // Update the user context here
      setUser(prevState => ({
        ...prevState,
        photoUrl: downloadURL,
      }))
    } catch (error) {
      console.error('Error uploading the image: ', error)
      console.error('Error response from the server: ', error.response)
    }
  }

  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text>Profile Photo</Text>

      {user && user.photoUrl ? (
        <Image
          source={{ uri: user.photoUrl }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
          }}
        />
      ) : (
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#E0E0E0',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>No Image</Text>
        </View>
      )}
      {/* <TouchableOpacity onPress={pickImage}> */}
      <Button title='Upload Image' onPress={pickImage} />
      {/* </TouchableOpacity> */}
    </View>
  )
}

export default Profile
