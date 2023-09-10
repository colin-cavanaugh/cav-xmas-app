import React from 'react'
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native'

const DATA = [
  { id: '1', text: 'Box 1' },
  { id: '2', text: 'Box 2' },
  { id: '3', text: 'Box 3' },
  { id: '4', text: 'Box 4' },
]

const Item = ({ text }) => (
  <View style={styles.item}>
    <Text>{text}</Text>
  </View>
)

const EventsContainer = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Item text={item.text} />}
        keyExtractor={item => item.id}
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

export default EventsContainer
