import React, { useEffect, useState } from 'react'
import { createContext, useContext } from 'react'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'
import axios from 'axios'
import { socket } from '../Socket/useSocket.js'

const UserContext = createContext()
const USER_TOKEN_KEY = 'userToken' // To ensure consistent use of AsyncStorage key.
const REFRESH_TOKEN_KEY = 'refreshTokenKey'
const USER_ID_KEY = 'userId'
const refreshToken = async () => {
  console.log('refreshToken function called ', refreshToken)
  try {
    const refreshTokenFromStorage = await AsyncStorage.getItem(
      REFRESH_TOKEN_KEY
    )
    console.log('Stored refreshToken:', refreshTokenFromStorage)

    const response = await axios.post('http://192.168.0.12:8000/api/token', {
      refreshToken: refreshTokenFromStorage,
    })
    console.log('Response from /api/token:', response.data)
    const newAccessToken = response.data.accessToken
    await AsyncStorage.setItem(USER_TOKEN_KEY, newAccessToken)
    return newAccessToken
  } catch (error) {
    console.error('Error refreshing token:', error.response.status)
    throw error
  }
}
async error => {
  console.log('Interceptor triggered for error: ', error)
  axios.interceptors.response.use(
    response => response, // if response is successful, just return it
    async error => {
      const originalRequest = error.config
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true // mark the request as retried
        const newToken = await refreshToken() // refresh the token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}` // set the new token on the request
        return axios(originalRequest) // retry the request with the new token
      }
      return Promise.reject(error) // if the response is anything other than a 401, or if we've already retried, reject the promise
    }
  )
}

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
  const login = async (token, refreshToken) => {
    try {
      const decodedToken = jwtDecode(token)
      const { userId } = decodedToken
      console.log('Decoded Token: ', decodedToken)
      await AsyncStorage.setItem(USER_TOKEN_KEY, token)
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken) // Store the refreshToken
      await AsyncStorage.setItem(USER_ID_KEY, userId) // Store userId

      const userProfile = await fetchUserProfile(userId)
      console.log('Fetched User Profile: ', userProfile)
      if (userProfile) {
        // Merging the userProfile data with the userId
        setUser({ ...userProfile, userId })
        console.log('Updated User State: ', user)
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
      let token = await AsyncStorage.getItem(USER_TOKEN_KEY)
      const decodedToken = jwtDecode(token)
      const currentTime = new Date().getTime() / 1000
      if (decodedToken.exp < currentTime) {
        token = await refreshToken() // Refresh the token if it's expired
      }

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
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY) // also remove the refresh token
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
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
