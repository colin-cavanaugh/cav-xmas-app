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
  console.log('UserProvider Initialized AuthService Component')

  const initialState = {
    userId: null,
    username: null,
    sentRequests: [],
    friendRequests: [],
  }

  const [user, setUser] = useState(initialState)

  const login = async token => {
    try {
      const decodedToken = jwtDecode(token)
      console.log('decodedToken contains userId: ', 'userId' in decodedToken)
      const { userId } = decodedToken
      console.log('decodedToken: ', decodedToken)
      await AsyncStorage.setItem('userToken', token)
      await fetchUserProfile(userId)
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  const fetchUserProfile = async userId => {
    try {
      const token = await AsyncStorage.getItem('userToken')
      const response = await axios.get(
        `http://192.168.0.12:8000/api/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const userProfile = response.data
      console.log('Fetched User Profile:', userProfile)
      setUser(prevState => ({
        ...prevState,
        ...userProfile,
      }))
      console.log('userProfile AuthService Component: ', userProfile)
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
    setUser(null) // Set user to null upon logout
  }

  useEffect(() => {
    const getTokenAndDecode = async () => {
      const token = await AsyncStorage.getItem('userToken')
      if (token) {
        const decodedToken = jwtDecode(token)
        console.log(
          'decodedToken in useEffect contains userId: ',
          'userId' in decodedToken
        )
        const currentTime = new Date().getTime() / 1000
        if (decodedToken.exp < currentTime) {
          await AsyncStorage.removeItem('userToken')
          setUser(null) // Set to null if the token is expired
        } else {
          setUser(decodedToken) // or set to user info
          await fetchUserProfile(decodedToken.userId)
        }
      } else {
        setUser(null) // Set to null if the token doesn't exist
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
