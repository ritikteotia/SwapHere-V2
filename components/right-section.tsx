"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"

export default function RightSection({ className = "" }) {
  const { user } = useAuth()
  const [popularSkills, setPopularSkills] = useState([])
  const [recommendedSkills, setRecommendedSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [googleLoaded, setGoogleLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch popular skills
        const popularResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills/popular`, {
          credentials: "include",
        })

        // Fetch recommended skills
        const recommendedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills/recommended`, {
          credentials: "include",
        })

        if (popularResponse.ok && recommendedResponse.ok) {
          const popularData = await popularResponse.json()
          const recommendedData = await recommendedResponse.json()

          setPopularSkills(popularData)
          setRecommendedSkills(recommendedData)
        } else {
          // If API fails, use mock data
          setPopularSkills(getMockPopularSkills())
          setRecommendedSkills(getMockRecommendedSkills())
        }
      } catch (error) {
        console.error("Error fetching right section data:", error)
        // If API fails, use mock data
        setPopularSkills(getMockPopularSkills())
        setRecommendedSkills(getMockRecommendedSkills())
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Mock data in case the API is not available
  const getMockPopularSkills = () => {
    return [
      { id: "p1", name: "WebDevelopment", count: 982 },
      { id: "p2", name: "UXDesign", count: 754 },
      { id: "p3", name: "DataScience", count: 621 },
      { id: "p4", name: "CulinaryArts", count: 438 },
    ]
  }

  const getMockRecommendedSkills = () => {
    return [
      {
        id: "r1",
        name: "Photography",
        category: "Arts",
        duration: "3 weeks",
        description: "Learn professional photography techniques from composition to editing.",
        deliveredBy: {
          id: "u6",
          name: "James Wilson",
          avatar: "/placeholder.svg?height=24&width=24",
        },
      },
      {
        id: "r2",
        name: "Digital Marketing",
        category: "Marketing",
        duration: "5 weeks",
        description: "Master social media marketing, SEO, and content strategy.",
        deliveredBy: {
          id: "u7",
          name: "Emily Chen",
          avatar: "/placeholder.svg?height=24&width=24",
        },
      },
    ]
  }

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: (response) => {
            // Handle Google Sign-in
            if (response.credential) {
              window.location.reload()
            }
          },
        })
        window.google.accounts.id.renderButton(document.getElementById("google-profile-signin-button"), {
          theme: "outline",
          size: "medium",
          width: "100%",
        })
        setGoogleLoaded(true)
      }
    }

    if (!user && !googleLoaded) {
      // Check if the Google API is already loaded
      if (window.google) {
        initializeGoogleSignIn()
      } else {
        // Load the Google API script
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.onload = initializeGoogleSignIn
        script.async = true
        document.head.appendChild(script)
      }
    }
  }, [user, googleLoaded])

  return (
    <div className={`sticky top-20 h-fit w-80 space-y-4 ${className}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md dark:border-slate-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white p-4 dark:from-purple-900/20 dark:to-slate-900">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar || "/placeholder.svg?height=48&width=48"} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-xs text-muted-foreground">{user?.profession || "SwapHere Member"}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-md bg-muted p-2">
                  <p className="font-medium">12</p>
                  <p className="text-muted-foreground">Skills</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <p className="font-medium">48</p>
                  <p className="text-muted-foreground">Followers</p>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <p className="font-medium">36</p>
                  <p className="text-muted-foreground">Following</p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-center">Sign in to access your profile</p>
              <div id="google-profile-signin-button" className="flex justify-center"></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md dark:border-slate-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white p-4 dark:from-purple-900/20 dark:to-slate-900">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Popular Skills</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <ul className="space-y-2 text-sm">
              {popularSkills.map((skill) => (
                <li key={skill.id} className="rounded-md p-2 transition-all hover:bg-accent">
                  <span className="font-medium">#{skill.name}</span>
                  <p className="text-xs text-muted-foreground">{skill.count} skills available</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md dark:border-slate-800">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white p-4 dark:from-purple-900/20 dark:to-slate-900">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Recommended Skills</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedSkills.map((skill) => (
                <div key={skill.id} className="rounded-lg border p-3 hover:bg-accent transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {skill.name}
                    </Badge>
                    <Badge variant="outline">{skill.duration}</Badge>
                  </div>
                  <p className="text-xs mb-2">{skill.description}</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={skill.deliveredBy.avatar || "/placeholder.svg"} alt={skill.deliveredBy.name} />
                      <AvatarFallback>{skill.deliveredBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-xs">By {skill.deliveredBy.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
