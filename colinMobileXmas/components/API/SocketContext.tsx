import { createContext } from 'react'
import { CustomSocket } from './SocketTypes' // Make sure you adjust the path

export const SocketContext = createContext<CustomSocket | null>(null)
// export const SocketContext = createContext(null)
