/**
 * @format
 */

import React from 'react'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { UserProvider } from './components/API/AuthService'

const AppWithProvider = () => {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  )
}

AppRegistry.registerComponent(appName, () => AppWithProvider)