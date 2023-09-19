import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Dimensions,
  ToastAndroid,
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '../API/AuthService.js'
import Snowflake from '../Snowflake/Snowflake.tsx'
import Snowfall from '../Snowflake/Snowfall.tsx'
// import { BACKEND_URL } from '@env'

const Login = props => {
  const { setLoggedIn } = props
  const { user, setUser, login } = useUser()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()
  // Validate username and password
  function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z0-9_\-.$#@]+[0-9]+[a-zA-Z0-9_\-.$#@]*$/
    return usernameRegex.test(username)
  }

  // Validate password upon registration
  function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!$#%-])[a-zA-Z0-9!$#%-]{8,}$/
    return passwordRegex.test(password)
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post(`http://192.168.0.12:8000/api/login`, {
        username,
        password,
      })

      if (response.data && response.data.status === 'success') {
        const { accessToken, refreshToken } = response.data.data

        // Use the login function from the UserContext which should handle storage, etc.
        login(accessToken, refreshToken) // We're now passing the refreshToken too.

        ToastAndroid.showWithGravity(
          'Successfully logged in!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
      } else {
        console.error('Login Failed:', response.data.message)
        ToastAndroid.showWithGravity(
          'Login Failed: ' + response.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
      }
    } catch (error) {
      console.error('Login Request Failed', error)
      ToastAndroid.showWithGravity(
        'Login Failed due to request error.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      )
    }
  }

  const handleRegister = async () => {
    if (!validateUsername(username)) {
      ToastAndroid.showWithGravity(
        'Username must include at least one number.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      )
      return
    }
    if (!validatePassword(password)) {
      ToastAndroid.showWithGravity(
        'Weak password. Min 8 chars, use upper/lowercase, numbers, and [!$#%-].',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      )
      return
    }
    try {
      const response = await axios.post(
        `http://192.168.0.12:8000/api/register`,
        {
          username,
          password,
        }
      )
      if (response.data && response.data.status === 'success') {
        ToastAndroid.showWithGravity(
          `Successfully Registered as ${username}!`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
        handleLogin()
      } else {
        console.error('Registration Failed:', response.data.message)
      }
    } catch (error) {
      console.error('Registration Error:', error)
    }
  }
  // const windowWidth = Dimensions.get('window').width
  // const snowflakes = Array.from({ length: 100 }).map(() => ({
  //   size: Math.random() * 10 + 5,
  //   left: Math.random() * windowWidth,
  //   duration: Math.random() * 3000 + 2000,
  // }))
  return (
    <View style={styles.container}>
      <Snowfall />
      <View style={styles.welcomeXmas}>
        <Image
          source={require('../Images/xmas_tree_cartoon.png')}
          style={styles.image}
        />
        <Text style={styles.welcome}>
          Welcome to Cavanaugh Christmas List V1
        </Text>
        <Text>Please Login Below</Text>
      </View>
      <View>
        <Text>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder='Username'
        />
        <Text>Password:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder='Password'
        />
        <View style={{ marginBottom: 10 }}>
          <Button title='Login' onPress={handleLogin} />
        </View>
        <View style={{ marginBottom: 10 }}>
          <Button title='Register' onPress={handleRegister} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeXmas: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  welcome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
})

export default Login
