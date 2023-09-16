// // RootNavigation.tsx
// import {
//   createStackNavigator,
//   StackNavigationProp,
// } from '@react-navigation/stack'
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { createDrawerNavigator } from '@react-navigation/drawer'
// import { NavigationContainer } from '@react-navigation/native'
// import { useUser } from '../API/AuthService'

// // Your imports ...
// type RootStackParamList = {
//   Home: undefined
//   Profile: undefined
//   AddFriends: undefined
//   Events: undefined
//   Details: { itemId: number }
//   Login: undefined
//   FriendsNav: undefined
//   Drawer: undefined
// }
// export type FriendsTabParamList = {
//   Friends: {
//     friends: any // Replace 'any' with the appropriate type if available
//   }
//   Requests: undefined
//   Add: undefined
//   // Add other screens' params here if needed
// }
// export const Stack = createStackNavigator<RootStackParamList>()
// export const Drawer = createDrawerNavigator<RootStackParamList>()
// export const FriendsTab = createBottomTabNavigator<FriendsTabParamList>()

// // ... Rest of your components related to navigation ...

// export default function RootNavigation() {
//   const { user, logout, loading } = useUser()

//   // Rest of your logic ...

//   return (
//     <NavigationContainer>{/* Your Navigator structure */}</NavigationContainer>
//   )
// }
