import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_TOKEN_KEY } from './AuthService'

export const api = axios.create({
  baseURL: 'http://192.168.0.12:8000',
})

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(USER_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error during API request:', error)
    if (error.response) {
      console.error('Error data:', error.response.data)
    }
    return Promise.reject(error)
  }
)

export default api
