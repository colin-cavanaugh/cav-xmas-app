import { useContext, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import EventsContainer from '../Events/EventsContainer'
import { useSocket } from '../API/SocketProvider'
import { UserContext } from '../API/UserProvider'
import { useFriends } from '../Friends/UseFriends'
import LoadingSpinner from '../utility/LoadingSpinner'

const Home = () => {
  // Websocket
  const { socket, loading } = useSocket()
  const { user, showToast } = useContext(UserContext)
  const { setOnline, setOffline, setInitialOnlineList } = useFriends(
    user?.userId
  )
  useEffect(() => {
    if (socket && user && user.userId) {
      const handleConnect = () => {
        console.log(
          'Emitting go-online for user:',
          user.userId,
          'is socket connected?',
          socket.connected
        )
        socket.emit('go-online', user.userId)
        // ... rest of the code

        socket.on('online-friends-list', onlineFriends => {
          console.log('online-friends-list socket', onlineFriends)
          setInitialOnlineList(onlineFriends)
        })

        socket.on('friend-came-online', friendData => {
          console.log(friendData.username + ' is now online')
          setOnline(friendData.userId)
          showToast(`${friendData.username} is now online`)
        })

        socket.on('friend-went-offline', friendData => {
          console.log(friendData.username + ' is now offline')
          setOffline(friendData.userId)
          showToast(`${friendData.username} is now offline`)
        })
      }

      socket.on('connect', handleConnect)

      // Cleanup
      return () => {
        socket.off('connect', handleConnect)
        socket.off('online-friends-list')
        socket.off('friend-came-online')
        socket.off('friend-went-offline')
      }
    }
  }, [socket, user])

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
