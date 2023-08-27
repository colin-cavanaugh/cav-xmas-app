import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native'

const Header = ({ navigation, user, logout, toggleMenu, menuOpen }) => {
  const [fadeValues, setFadeValues] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ])

  useEffect(() => {
    if (menuOpen) {
      fadeValues.forEach((value, index) => {
        Animated.sequence([
          Animated.delay(index * 60),
          Animated.timing(value, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start()
      })
    } else {
      fadeValues.forEach(value => {
        Animated.timing(value, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start()
      })
    }
  }, [menuOpen])

  if (!user) {
    return null
  }
  const handleLogout = () => {
    logout()
    toggleMenu()
  }
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoDiv}>
        <Image
          source={require('../Images/xmas_tree_cartoon.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.userInfo}>
        {user && user.username ? (
          <Text>Hello, {user.username}</Text>
        ) : (
          <Text>Welcome!</Text>
        )}
      </View>
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
        <Text style={styles.hamburgerText}>☰</Text>
      </TouchableOpacity>
      {menuOpen && (
        <View style={styles.menu}>
          <Animated.View style={{ opacity: fadeValues[0] }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Home')
                toggleMenu()
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ opacity: fadeValues[1] }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile')
                toggleMenu()
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ opacity: fadeValues[2] }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Lists')
                toggleMenu()
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Lists</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ opacity: fadeValues[3] }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Groups')
                toggleMenu()
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Groups</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ opacity: fadeValues[4] }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Gifts')
                toggleMenu()
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>Gifts</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ opacity: fadeValues[5] }}>
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  hamburgerButton: {
    padding: 10,
  },
  hamburgerText: {
    fontSize: 22,
  },
  menu: {
    position: 'absolute',
    top: 65,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
    zIndex: 1000,
  },
  menuText: {
    fontFamily: 'Roboto',
    fontSize: 18,
  },
  menuItem: {
    paddingVertical: 5,
  },
  image: {
    height: 65,
    width: 65,
  },
})

export default Header
