import React from 'react'
import { View, Dimensions } from 'react-native'
import Snowflake from './Snowflake'

const Snowfall: React.FC = () => {
  const windowWidth = Dimensions.get('window').width
  const snowflakes = Array.from({ length: 30 }).map(() => ({
    size: Math.random() * 10 + 5,
    left: Math.random() * windowWidth,
    duration: Math.random() * 5000 + 3000,
  }))

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}
    >
      {snowflakes.map((flake, index) => (
        <Snowflake
          key={index}
          size={flake.size}
          left={flake.left}
          duration={flake.duration}
        />
      ))}
    </View>
  )
}

export default Snowfall
