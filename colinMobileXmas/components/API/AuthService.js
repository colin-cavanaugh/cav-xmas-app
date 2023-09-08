import React, { useEffect, useState } from 'react'
import { createContext, useContext } from 'react'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'
import axios from 'axios'
import { socket } from '../Socket/useSocket.js'

const UserContext = createContext()
const USER_TOKEN_KEY = 'userToken' // To ensure consistent use of AsyncStorage key.
const USER_ID_KEY = 'userId'

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const initialUserState = {
    userId: null,
    username: null,
    sentRequests: [],
    friendRequests: [],
  }

  const [user, setUser] = useState(initialUserState)
  const [userChangeSource, setUserChangeSource] = useState(null)
  useEffect(() => {
    console.log('User Object state change:', user)
    if (userChangeSource) {
      console.log('Change source:', userChangeSource)
      setUserChangeSource(null) // Reset after logging
    }
  }, [user])
  const login = async token => {
    try {
      const decodedToken = jwtDecode(token)
      const { userId } = decodedToken

      await AsyncStorage.setItem(USER_TOKEN_KEY, token)
      await AsyncStorage.setItem(USER_ID_KEY, userId) // Store userId

      const userProfile = await fetchUserProfile(userId)
      if (userProfile) {
        // Merging the userProfile data with the userId
        setUser({ ...userProfile, userId })
      }
      console.log(
        'User Object after Login and setUser({ ...userProfile, userId })',
        user
      )
      socket.emit('go-online', userId) // Notify server user is online
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  const fetchUserProfile = async userId => {
    try {
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY)
      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const logout = async () => {
    ToastAndroid.showWithGravity(
      'Successfully Logged out',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    )
    await AsyncStorage.removeItem(USER_TOKEN_KEY)
    await AsyncStorage.removeItem(USER_ID_KEY) // Remove userId
    setUserChangeSource('Logout function')
    setUser(null)
    socket.emit('go-offline', user?.userId) // Notify server user is offline
  }

  useEffect(() => {
    const getTokenAndDecode = async () => {
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY)
      let newUserState = initialUserState
      if (token) {
        const decodedToken = jwtDecode(token)
        const currentTime = new Date().getTime() / 1000
        if (decodedToken.exp >= currentTime) {
          const userProfile = await fetchUserProfile(decodedToken.userId)
          if (userProfile) {
            // Merging the userProfile data with the userId
            newUserState = { ...userProfile, userId: decodedToken.userId }
          }
        } else {
          await AsyncStorage.removeItem(USER_TOKEN_KEY)
        }
      }
      setUser(newUserState)
    }

    getTokenAndDecode()
  }, [])

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}
