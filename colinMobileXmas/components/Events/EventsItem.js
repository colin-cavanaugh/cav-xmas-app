import React from 'react'
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native'
import EventIcon from 'react-native-vector-icons/MaterialIcons'

const EventData = [
  { id: '1', name: 'Xmas 2023' },
  { id: '2', name: 'Birthday 2023' },
  { id: '3', name: 'New Years 2023' },
  { id: '4', name: 'Wedding 2023' },
]

const Event = ({ name }) => (
  <View style={styles.item}>
    <Text>{name}</Text>
    <EventIcon name='event' color={'blue'} size={35} />
  </View>
)
const EventsItem = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={EventData}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Event name={item.name} />}
        keyExtractor={name => name.id}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height * 0.3,
    paddingTop: 20,
  },
  item: {
    width: Dimensions.get('window').width * 0.3, // for example, 70% of screen width
    height: 100,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
})

export default EventsItem
