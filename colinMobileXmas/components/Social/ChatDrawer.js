// import React, { useState, useEffect, useContext } from 'react'
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Image,
//   ToastAndroid,
// } from 'react-native'
// // import useSocket from '../Socket/useSocket'
// import { useUser } from '../API/AuthService'
// import { getChatId } from '../utility/utility'
// import DefaultIcon from 'react-native-vector-icons/Ionicons'
// import { SocketContext } from '../API/SocketContext'

// const ChatDrawer = ({
//   activeChats,
//   setCurrentChatFriend,
//   friend,
//   onClose,
//   chatMessages,
//   addMessageToState,
// }) => {
//   console.log('Render ChatDrawer Component')
//   console.log('Chat Messages', chatMessages)
//   const [message, setMessage] = useState('')
//   // const [chatMessages, setChatMessages] = useState([])
//   const { user } = useUser()
//   const userId = user?.userId
//   const chatId = getChatId(userId, friend._id)
//   const currentMessages = chatMessages[chatId] || []
//   if (!friend) {
//     return (
//       <View style={styles.noActiveChatContainer}>
//         <Text>No active chats</Text>
//       </View>
//     )
//   }
//   // const socket = useSocket(addMessageToState)
//   const socket = useContext(SocketContext)

//   const sendMessage = () => {
//     const newMessage = {
//       sender: userId,
//       recipient: friend._id,
//       content: message,
//     }

//     // Check if the recipient is online before sending the message
//     if (friend.isOnline) {
//       console.log(`Sending message: ${message} to ${friend.username}`)
//       if (socket) {
//         socket.emit('new-message', newMessage)
//       }
//     } else {
//       // Handle the case where the recipient is offline (e.g., display a notification).
//       console.log(`Recipient ${friend.username} is offline. Message not sent.`)
//       // You can implement logic to store the message and send it later when the recipient is online.
//       // addMessageToQueue(newMessage); // Example: Store the message in a queue.
//     }

//     addMessageToState(newMessage) // Use the function to organize the message
//     setMessage('') // Resetting the input after sending.
//   }
//   const [notifications, setNotifications] = useState({})

//   // Function to handle received messages
//   function handleMessageReceived(message) {
//     if (message.sender !== friend._id) {
//       setNotifications(prev => ({
//         ...prev,
//         [message.sender]: (prev[message.sender] || 0) + 1,
//       }))
//     }
//   }
//   // Receiving a message
//   useEffect(() => {
//     if (socket) {
//       socket.on('receive-message', message => {
//         console.log('Received message:', message)

//         // Handle the incoming message
//         addMessageToState(message)
//         handleMessageReceived(message)

//         ToastAndroid.showWithGravity(
//           `New message from ${message.sender}`,
//           ToastAndroid.SHORT,
//           ToastAndroid.CENTER
//         )
//       })

//       return () => {
//         socket.off('receive-message')
//       }
//     }
//   }, [socket])

//   useEffect(() => {
//     console.log('chatMessages changed:', chatMessages)
//   }, [chatMessages])

//   console.log('Current Messages:', currentMessages)

//   return (
//     <View style={styles.chatDrawerContainer}>
//       <TouchableOpacity
//         onPress={onClose}
//         style={{ position: 'absolute', top: 10, right: 10 }}
//       >
//         <Text>X</Text>
//       </TouchableOpacity>

//       {/* <ScrollView horizontal={true} style={styles.bubbleContainer}>
//         {activeChats.map(friend => (
//           <ChatBubble
//             key={friend._id}
//             friend={friend}
//             onClick={setCurrentChatFriend}
//           />
//         ))}
//       </ScrollView> */}
//       <ScrollView>
//         {activeChats.map(chatFriend => (
//           <TouchableOpacity
//             key={chatFriend._id}
//             onPress={() => {
//               setCurrentChatFriend(chatFriend)
//               handleChatOpened(chatFriend._id)
//             }}
//           >
//             {/* Your ChatBubble component here */}
//             {notifications[chatFriend._id] && (
//               <Text style={{ color: 'red' }}>
//                 {notifications[chatFriend._id]}
//               </Text>
//             )}
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       <Text>Chat with {friend.username}</Text>
//       <ScrollView>
//         {currentMessages.map((msg, index) => (
//           <View
//             key={index}
//             style={{ flexDirection: 'row', alignItems: 'center' }}
//           >
//             {msg.sender === userId ? (
//               <Text>You: {msg.content}</Text>
//             ) : (
//               <React.Fragment>
//                 {friend.photoUrl ? (
//                   <Image
//                     source={{ uri: friend.photoUrl }}
//                     style={styles.profilePic}
//                   />
//                 ) : (
//                   <DefaultIcon
//                     name='chatbubble-outline'
//                     size={30}
//                     color={'blue'}
//                   />
//                 )}
//                 <Text>
//                   {friend.username}: {msg.content}
//                 </Text>
//               </React.Fragment>
//             )}
//           </View>
//         ))}
//       </ScrollView>
//       <TextInput
//         value={message}
//         onChangeText={setMessage}
//         style={styles.textInput}
//         placeholder='Type a message...'
//       />
//       <Button title='Send' onPress={sendMessage} />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   // chatDrawerContainer: {
//   //   flex: 1,
//   //   flexDirection: 'column',
//   //   width: '100%',
//   //   backgroundColor: 'white',
//   //   padding: 10,
//   //   borderTopLeftRadius: 10,
//   //   borderTopRightRadius: 10,
//   // },
//   chatDrawerContainer: {
//     position: 'absolute',
//     bottom: 60, // To position it just above the message bubble
//     right: 10,
//     width: 300,
//     height: 400,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     // ... other styles
//   },
//   textInput: {
//     padding: 10,
//     borderColor: 'black',
//     borderWidth: 1,
//     borderRadius: 5,
//   },
//   bubbleContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#e1e8ee',
//   },
//   bubble: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   chatBubble: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//     // ... other styles as needed
//   },
//   profilePic: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
// })

// export default ChatDrawer
