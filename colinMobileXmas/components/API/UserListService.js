import React, { createContext, useState, useContext } from 'react'

// Create the context
export const UserListContext = createContext()

// Create a custom hook for easy access to the context
export const useUserList = () => {
  return useContext(UserListContext)
}

// Provider component
export const UserListProvider = ({ children }) => {
  const [userList, setUserList] = useState([])

  // Any additional logic related to the userList can be added here

  return (
    <UserListContext.Provider value={{ userList, setUserList }}>
      {children}
    </UserListContext.Provider>
  )
}
