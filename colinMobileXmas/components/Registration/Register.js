import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import Snowflake from '../Snowflake/Snowflake.tsx'

function Register(props) {
  const { setIsRegistered } = props
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()

  const handleSubmit = async () => {
    try {
      // const response = await axios.post('http://localhost:8000/api/register', {
      //   username,
      //   password,
      // })
      const response = await axios.post(
        'http://192.168.0.12:8000/api/register',
        {
          username,
          password,
        }
      )
      if (response.data && response.data.status === 'success') {
        navigation.navigate('Login') // Navigate to the login page.
      } else {
        console.error('Registration Failed:', response.data.message)
      }
    } catch (error) {
      console.error('Registration Error:', error)
    }
  }
  const windowWidth = Dimensions.get('window').width
  const snowflakes = Array.from({ length: 100 }).map(() => ({
    size: Math.random() * 10 + 5,
    left: Math.random() * windowWidth,
    duration: Math.random() * 3000 + 2000,
  }))

  return (
    <View style={styles.container}>
      {snowflakes.map((flake, index) => {
        return (
          <Snowflake
            key={index}
            size={flake.size}
            left={flake.left}
            duration={flake.duration}
          />
        )
      })}
      <View style={styles.welcomeXmas}>
        <Image
          source={require('../Images/xmas_tree_cartoon.png')}
          style={styles.image}
        />
        <Text style={styles.welcome}>
          Welcome to Cavanaugh Christmas List V1
        </Text>
        <Text>Please Register Below</Text>
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
        <Button title='Register' onPress={handleSubmit} />
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

export default Register
