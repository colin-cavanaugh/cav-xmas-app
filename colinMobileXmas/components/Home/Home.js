import { useContext, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import EventsContainer from '../Events/EventsContainer'
import { useSocket } from '../API/SocketProvider'
import { UserContext } from '../API/UserProvider'
import LoadingSpinner from '../utility/LoadingSpinner'

const Home = () => {
  // Websocket
  const { socket, loading } = useSocket()
  const { user, showToast } = useContext(UserContext)

  // useEffect(() => {
  //   console.log('User state in useSocket:', user)
  //   console.log('Socket state in useSocket:', socket)
  //   if (!socket || !user || !user.userId) return
  //   socket.on('user-online', userId => {
  //     console.log('User Online: ', userId)
  //     showToast('User Online: ', user.username)
  //   })

  //   socket.on('user-offline', userId => {
  //     console.log('User Offline: ', userId)
  //     showToast('User Offline: ', user.username)
  //   })
  //   return () => {
  //     // Disconnect the socket when the component unmounts
  //     socket.disconnect()
  //   }
  // }, [socket, user])

  if (loading) {
    return <LoadingSpinner /> // Show spinner if socket is loading
  }

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
