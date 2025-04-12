"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useAuth } from "./auth-context"

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        // Connect to socket server
        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
          query: { userId: user.id },
          withCredentials: true,
        })

        socketInstance.on("connect", () => {
          console.log("Socket connected")
        })

        socketInstance.on("disconnect", () => {
          console.log("Socket disconnected")
        })

        socketInstance.on("connect_error", (error) => {
          console.error("Socket connection error:", error)
          // Create a mock socket for demo purposes
          const mockSocket = {
            on: (event, callback) => {
              // Store event listeners but don't do anything with them
              return mockSocket
            },
            emit: (event, data) => {
              console.log(`Mock socket emitting ${event}:`, data)
              return mockSocket
            },
            off: () => {
              return mockSocket
            },
            disconnect: () => {
              console.log("Mock socket disconnected")
            },
          }
          setSocket(mockSocket)
        })

        setSocket(socketInstance)

        return () => {
          socketInstance.disconnect()
        }
      } catch (error) {
        console.error("Socket initialization error:", error)
        // Create a mock socket for demo purposes
        const mockSocket = {
          on: (event, callback) => {
            // Store event listeners but don't do anything with them
            return mockSocket
          },
          emit: (event, data) => {
            console.log(`Mock socket emitting ${event}:`, data)
            return mockSocket
          },
          off: () => {
            return mockSocket
          },
          disconnect: () => {
            console.log("Mock socket disconnected")
          },
        }
        setSocket(mockSocket)
      }
    }
  }, [isAuthenticated, user])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}
