import React, { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'

const UserContext = createContext()

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = async token => {
    await AsyncStorage.setItem('userToken', token)
    const decodedToken = jwtDecode(token)
    console.log('Decoded Token: ', decodedToken)
    setUser(decodedToken)
    console.log('Login Function Called (After setUser(decodedToken))')
  }

  const logout = async () => {
    ToastAndroid.showWithGravity(
      'Successfully Logged out',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    )
    await AsyncStorage.removeItem('userToken')
    setUser(null)
  }

  useEffect(() => {
    const getTokenAndDecode = async () => {
      console.log('useEffect getTokenAndDecode')
      const token = await AsyncStorage.getItem('userToken')
      if (token) {
        const decodedToken = jwtDecode(token)
        const currentTime = new Date().getTime() / 1000
        if (decodedToken.exp < currentTime) {
          await AsyncStorage.removeItem('userToken')
          setUser(null)
        } else {
          setUser(decodedToken)
        }
      }
    }

    getTokenAndDecode()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}
