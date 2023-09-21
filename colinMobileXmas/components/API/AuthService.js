import React from 'react'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { UserContext } from './UserProvider'
export const USER_TOKEN_KEY = 'userToken'
export const REFRESH_TOKEN_KEY = 'refreshTokenKey'
export const USER_ID_KEY = 'userId'

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

export const fetchUserProfile = async userId => {
  let token = await AsyncStorage.getItem(USER_TOKEN_KEY)

  // If the token exists, decode it.
  if (token) {
    const decodedToken = jwtDecode(token)
    const currentTime = new Date().getTime() / 1000

    // If it's expired, refresh it.
    if (decodedToken.exp < currentTime) {
      token = await refreshToken()
      if (!token) {
        console.error('Failed to refresh token.')
        return
      }

      // Decode the new refreshed token.
      const newDecodedToken = jwtDecode(token)
      userId = newDecodedToken.userId // Update the userId from the new token.
    }
  } else {
    console.error('Token not found.')
    return
  }

  // Use the userId from the (possibly refreshed) token to fetch the user profile.
  try {
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
