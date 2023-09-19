import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import CustomDrawerContent from './CustomDrawerContent'
import { Dimensions } from 'react-native'
import BottomTabNavigator from './BottomTabNavigator'
import Profile from '../Profile/Profile'
import Events from '../Events/Events'
import { RootStackParamList } from '../../App'

const Drawer = createDrawerNavigator<RootStackParamList>()

function MainSideDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      screenOptions={{
        drawerStyle: { width: Dimensions.get('window').width * 0.7 },
        headerShown: false,
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name='Home' component={BottomTabNavigator} />
      <Drawer.Screen name='Profile' component={Profile} />
      <Drawer.Screen name='Events' component={Events} />
    </Drawer.Navigator>
  )
}

export default MainSideDrawer
