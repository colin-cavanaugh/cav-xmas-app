import React from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native'
import { ThemeProvider, useTheme } from '@material-native-ui/theme-provider'
// import { useTheme } from '@material-native-ui/material/styles'

const DATA = [
  { id: '1', text: 'Event 1' },
  { id: '2', text: 'Event 2' },
  { id: '3', text: 'Event 3' },
  { id: '4', text: 'Event 4' },
]

const Item = ({ text }) => {
  ;<View>
    <Text>{text}</Text>
  </View>
}
const defaultTheme = {
  spacing: spacing => 8 * spacing,
}

const themes = {
  light: {
    ...defaultTheme,
    name: 'light',
    palette: {
      default: 'rgba(100, 100, 100, .5)',
      primary: '#e1e8ee',
      secondary: '#40A3D0',
    },
  },
  dark: {
    ...defaultTheme,
    name: 'dark',
    palette: {
      default: 'rgba(200, 200, 200, .5)',
      primary: '#ffbb00',
      secondary: '#303337',
    },
  },
}

const ThemeContainer = () => {
  const theme = useTheme()

  return (
    <View
      style={[styles.container, { backgroundColor: theme.palette.default }]}
    >
      <Text style={{ color: theme.palette.primary }}>View Element</Text>
      <Button title='button' color={theme.palette.secondary}></Button>
      <TouchableOpacity></TouchableOpacity>
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
    padding: 16,
  },
  item: {
    width: Dimensions.get('window').width * 0.7, // for example, 70% of screen width
    height: 200,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
})

const WrappedEventsContainer = () => {
  return (
    <ThemeProvider theme={themes.light}>
      <ThemeContainer />
    </ThemeProvider>
  )
}

export default WrappedEventsContainer
