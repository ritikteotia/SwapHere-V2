"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: "include",
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // If API fails, use mock user data for demo
        setUser({
          id: "u1",
          name: "Ritik Kumar",
          email: "ritik@swaphere.com",
          avatar: "/placeholder.svg?height=64&width=64",
          profession: "Senior UX Designer",
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const loginWithGoogle = async (credential) => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
        credentials: "include",
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}!`,
        })
      } else {
        // If API fails, use mock user data for demo
        const mockUser = {
          id: "u1",
          name: "Ritik Kumar",
          email: "ritik@swaphere.com",
          avatar: "/placeholder.svg?height=64&width=64",
          profession: "Senior UX Designer",
        }
        setUser(mockUser)
        toast({
          title: "Demo mode active",
          description: "Using mock data for demonstration",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      // If API fails, use mock user data for demo
      const mockUser = {
        id: "u1",
        name: "Ritik Kumar",
        email: "ritik@swaphere.com",
        avatar: "/placeholder.svg?height=64&width=64",
        profession: "Senior UX Designer",
      }
      setUser(mockUser)
      toast({
        title: "Demo mode active",
        description: "Using mock data for demonstration",
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        setUser(null)
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        })
      } else {
        // If API fails, still log out locally
        setUser(null)
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      // If API fails, still log out locally
      setUser(null)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
