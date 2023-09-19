import { View, Text, StyleSheet } from 'react-native'
import EventsContainer from '../Events/EventsContainer'

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to your Home Page!</Text>
      <Text>Please navigate using the menu in the top right</Text>
      <EventsContainer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  welcomeXmas: {
    alignItems: 'center',
    marginBottom: 0,
  },
  welcome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Home
