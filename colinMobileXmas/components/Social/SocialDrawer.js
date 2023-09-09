// SocialDrawer.tsx
import React from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'

const SocialDrawer = ({ friends, openChat }) => {
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}
              >
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: item.isOnline ? 'green' : 'grey',
                    marginRight: 5,
                  }}
                />
                <Text style={{ fontSize: 14 }}>
                  {item.username} - {item.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item._id}
        />
      </View>
    </View>
  )
}

export default SocialDrawer
