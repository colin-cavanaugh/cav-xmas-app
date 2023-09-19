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

  // const leftPosition = useRef(Math.random() * (windowWidth - size)).current
  const opacityValue = useRef(Math.random() * (1 - 0.4) + 0.4).current

  const animateSnowflake = () => {
    // Reset the position of the snowflake to a random position above the screen
    translateY.setValue(-size - Math.random() * size)

    // Get a random duration for the animation to add some variability
    const randomDuration = duration + (Math.random() * 2000 - 1000) // This will give a duration between duration-1000 and duration+1000

    Animated.timing(translateY, {
      toValue: Dimensions.get('window').height + size,
      duration: randomDuration,
      useNativeDriver: true,
    }).start(() => animateSnowflake())
  }

  useEffect(() => {
    // Wait a random amount of time before starting the first animation
    const randomDelay = Math.random() * 5000

    const timerId = setTimeout(() => {
      animateSnowflake()
    }, randomDelay)

    return () => clearTimeout(timerId)
  }, [])

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: -size,
        left: left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'white',
        transform: [{ translateY }],
        opacity: opacityValue,
        pointerEvents: 'none',
      }}
    />
  )
}

export default Snowflake
// import React, { useEffect, useRef } from 'react'
// import { Animated, Dimensions } from 'react-native'

// const windowWidth = Dimensions.get('window').width

// interface SnowflakeProps {
//   size: number
//   left: number
//   duration: number
// }

// const Snowflake: React.FC<SnowflakeProps> = ({ size, left, duration }) => {
//   const translateY = useRef(new Animated.Value(-size)).current

//   useEffect(() => {
//     Animated.loop(
//       Animated.timing(translateY, {
//         toValue: Dimensions.get('window').height,
//         duration: duration,
//         useNativeDriver: true,
//       })
//     ).start()
//   }, [])

//   // console.log(translateY)
//   // console.log('Size:', size)
//   // console.log('Window Width:', windowWidth)
//   // console.log('Left:', Math.random() * (windowWidth - size))
//   // console.log('Opacity:', Math.random() * (1 - 0.4) + 0.4)
//   return (
//     <Animated.View
//       style={{
//         position: 'absolute',
//         top: -size, // Updated starting position
//         left: Math.random() * (windowWidth - size), // Random horizontal starting position
//         width: size, // Dynamic width
//         height: size, // Dynamic height
//         borderRadius: size / 2, // Dynamic borderRadius
//         backgroundColor: 'white',
//         transform: [{ translateY: translateY }],
//         opacity: Math.random() * (1 - 0.4) + 0.4,
//         pointerEvents: 'none',
//         zIndex: 1000,
//       }}
//     />
//   )
// }

// export default Snowflake
