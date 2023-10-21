import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import DefaultIcon from 'react-native-vector-icons/Ionicons'

const MessageBubble = ({ unreadCount, onClick }) => {
  return (
    <TouchableOpacity onPress={onClick} style={styles.messageBubble}>
      <DefaultIcon name='chatbubble-outline' size={30} color={'blue'} />
      {unreadCount > 0 && <Text style={styles.unreadCount}>{unreadCount}</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10, // Adjust as per your design
  },
  unreadCount: {
    marginLeft: 5,
    color: 'red',
  },
})
export default MessageBubble
