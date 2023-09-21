import React, { useState, useEffect, useContext, createContext } from 'react'
import { SocketContext } from './SocketContext'
import {
  fetchUserProfile,
  USER_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_ID_KEY,
  refreshToken,
} from './AuthService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { logEvent } from '../utility/utility'
import { ToastAndroid } from 'react-native'

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const socket = useContext(SocketContext)
  const initialUserState = {
    userId: null,
    username: null,
    sentRequests: [],
    friendRequests: [],
    isOnline: false,
  }
  const [user, setUser] = useState(initialUserState)
  let logoutTimer
  const setLogoutTimer = expTime => {
    const currentTime = new Date().getTime() / 1000
    const delay = expTime - currentTime

    // Automatically logout when the token expires
    setTimeout(logout, delay * 1000)
  }
  const login = async (token, refreshToken) => {
    console.log('Login function triggered')
    try {
      const decodedToken = jwtDecode(token)
      const { userId } = decodedToken
      if (!userId) {
        console.error('Decoded token does not contain userId.')
        return
      }
      await AsyncStorage.multiSet([
        [USER_TOKEN_KEY, token],
        [REFRESH_TOKEN_KEY, refreshToken],
        [USER_ID_KEY, userId.toString()],
      ])

      const userProfile = await fetchUserProfile(userId)
      if (userProfile) {
        setUser({ ...userProfile, userId, isOnline: true })
      }
      if (socket && socket.connected) {
        logEvent('go-online', 'authservice.js:login', userId)
        console.log(
          '[AuthService.js][1st go-online][go-online event triggered]'
        )
        console.log('Socket instance ID in AuthService go-online:', socket.id)
        socket.emit('go-online', userId)
        setLogoutTimer(decodedToken.exp)
      } else {
        console.log('Socket is not connected')
      }
    } catch (error) {
      console.error('Error during login:', error)
      if (error.response) {
        console.error('Error data:', error.response.data)
      }
    }
  }
  const logout = async () => {
    if (logoutTimer) clearTimeout(logoutTimer)
    try {
      const userToken = await AsyncStorage.getItem(USER_TOKEN_KEY)
      const refreshTokenFromStorage = await AsyncStorage.getItem(
        REFRESH_TOKEN_KEY
      )

      const response = await axios.post(
        'http://192.168.0.12:8000/api/logout',
        {
          refreshToken: refreshTokenFromStorage,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )

      if (response.data.status === 'success') {
        ToastAndroid.showWithGravity(
          'Successfully Logged out',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        )
        await AsyncStorage.multiRemove([
          USER_TOKEN_KEY,
          USER_ID_KEY,
          REFRESH_TOKEN_KEY,
        ])
        if (user && user.userId && socket) {
          logEvent('go-offline', '[UserProvider:logout]', user.userId)
          console.log('go-offline event triggered')
          socket.emit('go-offline', user.userId)
          setTimeout(() => {
            socket.disconnect()
          }, 1000) // add a delay before disconnecting
        }
        setUser(initialUserState)
      } else {
        console.error('Logout error:', response.data.message)
      }
    } catch (error) {
      console.error('Error during logout:', error)
      if (error.response) {
        console.error('Error data:', error.response.data)
      }
    }
  }

  useEffect(() => {
    const getTokenAndDecode = async () => {
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY)
      let newUserState = initialUserState

      if (token) {
        const decodedToken = jwtDecode(token)
        const currentTime = new Date().getTime() / 1000
        if (decodedToken.exp > currentTime) {
          const userProfile = await fetchUserProfile(decodedToken.userId)
          if (userProfile) {
            newUserState = { ...userProfile, userId: decodedToken.userId }
          }

          // Setting the timer after validating the token
          setLogoutTimer(decodedToken.exp)
        } else {
          await AsyncStorage.removeItem(USER_TOKEN_KEY)
        }
      }
      setUser(newUserState)
    }

    getTokenAndDecode()
  }, [])

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  )
}