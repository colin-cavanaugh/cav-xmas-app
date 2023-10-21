import React, { useState, useContext } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ToastAndroid,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../API/UserProvider.js'
import Snowfall from '../Snowflake/Snowfall.tsx'
import {
  validateUsername,
  validatePassword,
} from '../Validations/validations.js'
import { loginUser, registerUser } from '../Validations/apiService.js'
import { fetchUserProfile, login } from '../API/AuthService.js'

const Login = () => {
  const { user, setUser } = useContext(UserContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  const showToast = message => {
    // ToastAndroid.showWithGravity(
    //   message,
    //   ToastAndroid.SHORT,
    //   ToastAndroid.CENTER
    // )
    Toast.show({
      type: 'default',  // this can be 'default', 'success', 'error', 'info' based on the context
      position: 'bottom',
      text1: message,
      visibilityTime: 3000,  // duration in ms
    });
  }

  const handleLocalLogin = async () => {
    setIsLoading(true)
    try {
      const { accessToken, refreshToken, userId } = await login({
        username,
        password,
      })

      if (accessToken && refreshToken && userId) {
        const userProfile = await fetchUserProfile(userId)
        setUser({ ...userProfile, accessToken, refreshToken, userId })
        showToast('Successfully logged in!')
      } else {
        showToast(`Login Failed: Unable to retrieve access tokens and userId.`)
      }
    } catch (error) {
      showToast('Login Failed due to request error.')
      console.error(error)
    }
    setIsLoading(false)
  }

  const handleRegister = async () => {
    if (!validateUsername(username))
      return showToast('Username must include at least one number.')
    if (!validatePassword(password))
      return showToast(
        'Weak password. Min 8 chars, use upper/lowercase, numbers, and [!$#%-].'
      )

    try {
      const response = await registerUser(username, password)
      console.log('Response from registration:', response)

      if (response.data && response.data.status === 'success') {
        showToast(`Successfully Registered as ${username}!`)
        handleLocalLogin()
      } else {
        showToast(`Registration Failed: ${response.data.message}`)
      }
    } catch (error) {
      showToast('Registration Error.')
    }
  }

  return (
    <View style={styles.container}>
      <Snowfall />
      <View style={styles.centerAligned}>
        <Image
          source={require('../Images/xmas_tree_cartoon.png')}
          style={styles.image}
        />
        <Text style={styles.boldText}>
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
        <View style={styles.buttonMargin}>
          <Button
            title='Login'
            onPress={handleLocalLogin}
            disabled={isLoading}
          />
        </View>
        <View style={styles.buttonMargin}>
          <Button title='Register' onPress={handleRegister} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  centerAligned: { alignItems: 'center', marginBottom: 20 },
  image: { width: 100, height: 100, resizeMode: 'contain' },
  boldText: { fontSize: 16, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  buttonMargin: { marginBottom: 10 },
})

export default Login
