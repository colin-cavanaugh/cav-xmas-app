import React, { useContext } from 'react'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { loginUser, registerUser } from '../Validations/apiService'
export const USER_TOKEN_KEY = 'userToken'
export const REFRESH_TOKEN_KEY = 'refreshTokenKey'
export const USER_ID_KEY = 'userId'

let logoutTimer = null

export const setLogoutTimer = expTime => {
  const currentTime = new Date().getTime() / 1000
  const delay = expTime - currentTime

  logoutTimer = setTimeout(() => {
    // Wrap it in an async IIFE if your logout is an async function
    ;(async () => {
      await logout()
    })()
  }, delay * 1000)
}
const refreshToken = async () => {
  try {
    const refreshTokenFromStorage = await AsyncStorage.getItem(
      REFRESH_TOKEN_KEY
    )

    const response = await axios.post('http://192.168.0.12:8000/api/token', {
      refreshToken: refreshTokenFromStorage,
    })
    const newAccessToken = response.data.data.accessToken
    console.log('newAccessToken', newAccessToken)
    await AsyncStorage.setItem(USER_TOKEN_KEY, newAccessToken)
    return newAccessToken
  } catch (error) {
    console.error('Error refreshing token:', error)
    throw error
  }
}
// ... (import statements and other constants remain the same)

export const login = async credentials => {
  try {
    const response = await axios.post(
      'http://192.168.0.12:8000/api/login',
      credentials
    )

    // Change this part to properly handle a 'success' status
    if (response.data && response.data.status === 'success') {
      const { accessToken, refreshToken } = response.data.data
      const decodedToken = jwtDecode(accessToken)

      await AsyncStorage.multiSet([
        [USER_TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken],
        [USER_ID_KEY, decodedToken.userId.toString()],
      ])

      return { userId: decodedToken.userId, accessToken, refreshToken }
    } else {
      throw new Error(response.data.message || 'Invalid login credentials')
    }
  } catch (error) {
    console.error('Error during login:', error)
    throw error
  }
}

export const logout = async () => {
  // Clear any logout timer to prevent it from running after manual logout
  if (logoutTimer) {
    clearTimeout(logoutTimer)
  }

  try {
    const accessTokenFromStorage = await AsyncStorage.getItem(USER_TOKEN_KEY)
    const refreshTokenFromStorage = await AsyncStorage.getItem(
      REFRESH_TOKEN_KEY
    )
    const response = await axios.post(
      'http://192.168.0.12:8000/api/logout',
      { refreshToken: refreshTokenFromStorage },
      {
        headers: {
          Authorization: `Bearer ${accessTokenFromStorage}`,
        },
      }
    )

    if (response && response.status !== 200) {
      throw new Error('Failed to logout')
    }

    await AsyncStorage.multiRemove([
      USER_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      USER_ID_KEY,
    ])
  } catch (error) {
    console.error('Error during logout:', error)
    throw error
  }
}

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response) {
      const originalRequest = error.config

      // Check if the status is 401 and this request has not been previously retried.
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true // Mark the request as retried

        try {
          // Refresh the token
          const newToken = await refreshToken()

          // Update the headers of the original request with the new token.
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`

          // Retry the original request with the new token.
          return axios(originalRequest)
        } catch (refreshError) {
          // Handle token refresh errors, such as showing a login page, etc.
          console.error('Failed to refresh token:', refreshError)
          return Promise.reject(refreshError)
        }
      }
    } else {
      // There was no response, handle accordingly
      console.error('No response:', error)
    }

    // For other errors, reject the promise to let it be handled by the calling function.
    return Promise.reject(error)
  }
)

const API_BASE_URL = 'http://192.168.0.12:8000/api' // Unified API base URL

export const fetchUserProfile = async userId => {
  let token = await AsyncStorage.getItem(USER_TOKEN_KEY)

  // If no token exists, throw an error.
  if (!token) {
    throw new Error('Token not found.')
  }

  // Decode the existing token.
  const decodedToken = jwtDecode(token)
  const currentTime = new Date().getTime() / 1000

  // If the token is expired, refresh it.
  if (decodedToken.exp < currentTime) {
    token = await refreshToken()

    // If the refresh fails, throw an error.
    if (!token) {
      throw new Error('Failed to refresh token.')
    }

    // Decode the new refreshed token.
    const newDecodedToken = jwtDecode(token)
    userId = newDecodedToken.userId // Update the userId from the new token.
  }

  // Fetch the user profile.
  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/${userId}`, // Using the unified API base URL
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
    throw new Error('Failed to fetch user profile') // Throwing meaningful error
  }
}
