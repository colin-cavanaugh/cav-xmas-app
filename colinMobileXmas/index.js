import React from 'react'
import { AppRegistry } from 'react-native'
import Main from './Main'
import { name as appName } from './app.json'
import { UserProvider } from './components/API/UserProvider'

const AppWithProvider = () => {
  return (
    <UserProvider>
      <Main />
    </UserProvider>
  )
}

AppRegistry.registerComponent(appName, () => AppWithProvider)
