import React, { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import jwtDecode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'
import axios from 'axios'

const UserContext = createContext()

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  console.log('UserProvider Initialized')
  const initialState = {
    userId: null,
    username: null,
    sentRequests: [],
    friendRequests: [],
  }
  const [user, setUser] = useState(initialState)

  const login = async token => {
    await AsyncStorage.setItem('userToken', token)
    const decodedToken = jwtDecode(token)

    // Set userId from decodedToken
    if (decodedToken.userId) {
      setUser({
        userId: decodedToken.userId,
        username: null,
        sentRequests: [],
        friendRequests: [],
      })
      await fetchUserProfile(decodedToken.userId) // Make sure to await it
    }
  }

  const fetchUserProfile = async userId => {
    try {
      const token = await AsyncStorage.getItem('userToken') // Fetch the token from AsyncStorage

      if (!token) {
        console.error("Token doesn't exist")
        return // Exit the function if there's no token
      }
      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const userProfile = response.data
      // Merge userProfile into current user state
      setUser(prevState => ({
        ...prevState,
        ...userProfile,
      }))
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
          await fetchUserProfile(decodedToken.userId) // fetch user profile also in useEffect
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
