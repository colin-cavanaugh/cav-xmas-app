import React from 'react'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { UserProvider } from './components/API/UserProvider'
import SocketProvider from './components/API/SocketProvider'
// import ChatProvider from './components/API/ChatProvider'

const AppWithProvider = () => {
  return (
    <SocketProvider>
      <UserProvider>
        {/* <ChatProvider> */}
        <App />
        {/* </ChatProvider> */}
      </UserProvider>
    </SocketProvider>
  )
}

AppRegistry.registerComponent(appName, () => AppWithProvider)
