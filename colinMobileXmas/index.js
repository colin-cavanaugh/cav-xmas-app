import React from 'react'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { UserProvider } from './components/API/AuthService'
import { UserListProvider } from './components/API/UserListService'

const AppWithProvider = () => {
  return (
    <UserProvider>
      <UserListProvider>
        <App />
      </UserListProvider>
    </UserProvider>
  )
}

AppRegistry.registerComponent(appName, () => AppWithProvider)
