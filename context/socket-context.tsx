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
      // Connect to socket server
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
        query: { userId: user.id },
      })

      socketInstance.on("connect", () => {
        console.log("Socket connected")
      })

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected")
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect()
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
