import React, { useState } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'

const SocialDrawer = ({ friends, openChat }) => {
  // Debugging line
  console.log('Friends Array: ', friends)
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 250,
        backgroundColor: 'white',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 16,
          marginBottom: 10,
          color: 'black',
        }}
      >
        Online Friends
      </Text>
      <FlatList
        data={friends}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openChat(item)}>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>
              {item.username} - {item.isOnline ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item._id}
      />
    </View>
  )
}

export default SocialDrawer
