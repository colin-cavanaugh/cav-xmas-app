import React, { useEffect, useState } from 'react'
import { createContext, useContext } from 'react'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'
import axios from 'axios'

const UserContext = createContext()
const USER_TOKEN_KEY = 'userToken'
const REFRESH_TOKEN_KEY = 'refreshTokenKey'
const USER_ID_KEY = 'userId'

const refreshToken = async () => {
  try {
    const refreshTokenFromStorage = await AsyncStorage.getItem(
      REFRESH_TOKEN_KEY
    )

    const response = await axios.post('http://192.168.0.12:8000/api/token', {
      refreshToken: refreshTokenFromStorage,
    })

    const newAccessToken = response.data.accessToken
    await AsyncStorage.setItem(USER_TOKEN_KEY, newAccessToken)
    return newAccessToken
  } catch (error) {
    console.error('Error refreshing token:', error)
    throw error
  }
}

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const newToken = await refreshToken()
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`
      return axios(originalRequest)
    }
    return Promise.reject(error)
  }
)

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children, socket }) => {
  const initialUserState = {
    userId: null,
    username: null,
    sentRequests: [],
    friendRequests: [],
    isOnline: false,
  }

  const [user, setUser] = useState(initialUserState)

  const login = async (token, refreshToken) => {
    try {
      const decodedToken = jwtDecode(token)
      const { userId } = decodedToken

      await AsyncStorage.multiSet([
        [USER_TOKEN_KEY, token],
        [REFRESH_TOKEN_KEY, refreshToken],
        [USER_ID_KEY, userId],
      ])

      const userProfile = await fetchUserProfile(userId)
      if (userProfile) {
        setUser({ ...userProfile, userId, isOnline: true })
      }

      if (socket && socket.connected) {
        console.log('Socket is connected:', socket.connected)
        socket.emit('go-online', userId)
        console.log('Sent go-online event')
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

  const fetchUserProfile = async userId => {
    try {
      let token = await AsyncStorage.getItem(USER_TOKEN_KEY)
      const decodedToken = jwtDecode(token)
      const currentTime = new Date().getTime() / 1000
      if (decodedToken.exp < currentTime) {
        token = await refreshToken()
      }

      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = response.data
      return {
        ...data,
        isOnline: data.isOnline || false,
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const logout = async () => {
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
          socket.emit('go-offline', user.userId)
          socket.disconnect()
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
        if (decodedToken.exp >= currentTime) {
          const userProfile = await fetchUserProfile(decodedToken.userId)
          if (userProfile) {
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
