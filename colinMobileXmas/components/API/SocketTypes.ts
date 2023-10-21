import { Socket } from 'socket.io-client'

// Extend the Socket type for custom events.
type CustomSocketEvents = {
  emit(event: 'go-online' | 'go-offline', userId: string): boolean
  
  // ... you can add other custom events here if necessary
}

export type CustomSocket = Socket & CustomSocketEvents
