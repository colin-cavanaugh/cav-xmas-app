import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions } from 'react-native'

const windowWidth = Dimensions.get('window').width

interface SnowflakeProps {
  size: number
  left: number
  duration: number
}

const Snowflake: React.FC<SnowflakeProps> = ({ size, left, duration }) => {
  const translateY = useRef(new Animated.Value(-size)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateY, {
        toValue: Dimensions.get('window').height,
        duration: duration,
        useNativeDriver: true,
      })
    ).start()
  }, [])
  // console.log(translateY)
  // console.log('Size:', size)
  // console.log('Window Width:', windowWidth)
  // console.log('Left:', Math.random() * (windowWidth - size))
  // console.log('Opacity:', Math.random() * (1 - 0.4) + 0.4)
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: -size, // Updated starting position
        left: Math.random() * (windowWidth - size), // Random horizontal starting position
        width: size, // Dynamic width
        height: size, // Dynamic height
        borderRadius: size / 2, // Dynamic borderRadius
        backgroundColor: 'white',
        transform: [{ translateY: translateY }],
        opacity: Math.random() * (1 - 0.4) + 0.4,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    />
  )
}

export default Snowflake
