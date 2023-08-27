import React, { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
  }

  const logout = async () => {
    await AsyncStorage.removeItem('userToken')
    setUser(null)
  }

  useEffect(() => {
    const getTokenAndDecode = async () => {
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
