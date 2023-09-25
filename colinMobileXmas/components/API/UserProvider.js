import React, { useState, useEffect, createContext, useCallback } from 'react'
import { USER_TOKEN_KEY } from './AuthService'
import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import { ToastAndroid, Text } from 'react-native'
import { fetchUserProfile } from './AuthService'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const initialUserState = {
    userId: null,
    username: null,
    sentRequests: [],
    friendRequests: [],
    isOnline: false,
  }
  const [user, setUser] = useState(initialUserState)

  const showToast = message => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    )
  }

  const refreshUserProfile = useCallback(async () => {
    if (!user || !user.userId) {
      // User or userId is not available, skip the profile refresh.
      return
    }
    console.log('userId', user.userId)
    try {
      const userProfile = await fetchUserProfile(user.userId)
      if (userProfile) {
        setUser({ ...userProfile, userId: user.userId })
        showToast('Profile updated.')
      }
    } catch (error) {
      console.error('Error during profile refresh:', error)
      showToast('Could not refresh profile.')
    }
  }, [])

  useEffect(() => {
    const getTokenAndDecode = async () => {
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY)
      let newUserState = initialUserState

      if (token) {
        const decodedToken = jwtDecode(token)
        const currentTime = new Date().getTime() / 1000
        if (decodedToken.exp > currentTime) {
          try {
            const userProfile = await fetchUserProfile(decodedToken.userId)
            if (userProfile) {
              newUserState = { ...userProfile, userId: decodedToken.userId }
            }
          } catch (error) {
            console.error('Error during token decode:', error)
          }
        } else {
          await AsyncStorage.removeItem(USER_TOKEN_KEY)
        }
      }
      if (JSON.stringify(newUserState) !== JSON.stringify(user)) {
        setUser(newUserState)
      }
    }

    getTokenAndDecode()
  }, [refreshUserProfile])

  return (
    <UserContext.Provider
      value={{ user, setUser, refreshUserProfile, showToast }}
    >
      {children}
    </UserContext.Provider>
  )
}
