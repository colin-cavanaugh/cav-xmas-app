import { View, Text, Image, StyleSheet } from 'react-native'
import { useState } from 'react'
import Section from '../Section/Section'

const Home = () => {
  //   const [isLoggedIn, setLoggedIn] = useState(false)

  return (
    <View style={styles.welcomeXmas}>
      <Text style={styles.welcome}>Welcome to your Home Page!</Text>
      <Text>Please navigate using the menu in the top right</Text>
    </View>
  )
}

export default Home
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
