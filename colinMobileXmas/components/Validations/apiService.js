import axios from 'axios'

export const loginUser = async (username, password) => {
  return axios.post(`http://192.168.0.12:8000/api/login`, {
    username,
    password,
  })
}

export const registerUser = async (username, password) => {
  return axios.post(`http://192.168.0.12:8000/api/register`, {
    username,
    password,
  })
}
