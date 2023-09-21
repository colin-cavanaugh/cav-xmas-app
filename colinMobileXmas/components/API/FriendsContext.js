import React, { createContext, useContext } from 'react'
import { useUser } from './UserProvider'
import { useFriends } from '../Friends/UseFriends'

export const FriendsContext = createContext()

export const FriendsProvider = ({ children }) => {
  const { user } = useUser()
  const friendsData = useFriends(user?.userId)

  return (
    <FriendsContext.Provider value={friendsData}>
      {children}
    </FriendsContext.Provider>
  )
}

export const useFriendData = () => {
  return useContext(FriendsContext)
}
