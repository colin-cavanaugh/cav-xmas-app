import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import DefaultIcon from 'react-native-vector-icons/Ionicons'
// Make sure to provide the correct path.

const OpenChat = ({ friend, onClick }) => {
  const openChat = friend => {
    onClick(friend)
  }

  return (
    <TouchableOpacity style={styles.bubble} onPress={() => openChat(friend)}>
      {friend.photoUrl ? (
        <Image source={{ uri: friend.photoUrl }} style={styles.profilePic} />
      ) : (
        <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    // ... other chat styles
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
})

export default OpenChat
