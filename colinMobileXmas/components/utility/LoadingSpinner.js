import React from 'react'
import { View, ActivityIndicator } from 'react-native'

const LoadingSpinner = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large' color='#00ff00' />
    </View>
  )
}

export default LoadingSpinner
