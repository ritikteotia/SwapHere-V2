"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const { loginWithGoogle } = useAuth()

  useEffect(() => {
    // Load Google Sign-In API
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (window.google) {
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
  }, [window.google])

  const handleCredentialResponse = (response) => {
    loginWithGoogle(response.credential)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          swapHere
        </h1>
        <p className="text-muted-foreground mt-2">Connect, learn, and share skills with professionals worldwide</p>
      </div>

      <Card className="w-full max-w-md shadow-lg dark:shadow-purple-900/10">
        <CardHeader className="text-center">
          <CardTitle>Welcome to SwapHere</CardTitle>
          <CardDescription>Sign in to start sharing and discovering skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div id="google-signin-button" className="flex justify-center"></div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" disabled>
                GitHub
              </Button>
              <Button variant="outline" disabled>
                Twitter
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </a>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
