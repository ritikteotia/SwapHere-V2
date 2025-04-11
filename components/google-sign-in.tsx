"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function GoogleSignIn() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)

  useEffect(() => {
    // Load Google Sign-In API
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => setIsGoogleLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (isGoogleLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: "742482579242-ii4ls7bhn45uut4pkcdvsa5fi7f0tk00.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      })
      window.google.accounts.id.renderButton(document.getElementById("google-signin-button"), {
        theme: "outline",
        size: "large",
        width: "100%",
      })
    }
  }, [isGoogleLoaded])

  const handleCredentialResponse = (response) => {
    console.log("Google Sign-In response:", response)
    // Here you would typically send the token to your backend
  }

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-white p-6 text-center">
        <CardTitle className="text-xl text-purple-700">Join swapHere</CardTitle>
        <CardDescription>Connect with professionals and share your skills</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div id="google-signin-button" className="flex justify-center"></div>
        {!isGoogleLoaded && (
          <Button className="w-full items-center justify-center gap-2 bg-white text-gray-700 shadow-sm hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
