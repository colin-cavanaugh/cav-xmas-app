import React from 'react'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { UserProvider } from './components/API/AuthService'
import SocketProvider from './components/API/SocketProvider'

const AppWithProvider = () => {
  return (
    <SocketProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </SocketProvider>
  )
}

AppRegistry.registerComponent(appName, () => AppWithProvider)
