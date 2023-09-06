import { View, Text } from 'react-native'

const ChatDrawer = ({ friend }) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        right: 250,
        width: 150,
        backgroundColor: 'white',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <Text>Chat with {friend.username}</Text>
      {/* Add your chat messages and input box here */}
    </View>
  )
}

export default ChatDrawer
