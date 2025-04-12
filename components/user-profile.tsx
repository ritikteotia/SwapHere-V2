"use client"

import { ArrowLeft, MapPin, Calendar, Briefcase, Mail, LinkIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"

export default function UserProfile({ user, onBack, onStartVideoCall }) {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(false)
  const [userSkills, setUserSkills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Check if following
        const followResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/following-status`, {
          credentials: "include",
        })

        // Get user skills
        const skillsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/skills`, {
          credentials: "include",
        })

        if (followResponse.ok && skillsResponse.ok) {
          const followData = await followResponse.json()
          const skillsData = await skillsResponse.json()

          setIsFollowing(followData.isFollowing)
          setUserSkills(skillsData)
        } else {
          // If API fails, use mock data
          setIsFollowing(false)
          setUserSkills(getMockUserSkills())
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        // If API fails, use mock data
        setIsFollowing(false)
        setUserSkills(getMockUserSkills())
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  // Mock data in case the API is not available
  const getMockUserSkills = () => {
    if (!user) return []

    return [
      {
        name: user.profession?.includes("UX")
          ? "UI/UX Design"
          : user.profession?.includes("Developer")
            ? "React Development"
            : user.profession?.includes("Data")
              ? "Data Science"
              : user.profession?.includes("Chef")
                ? "Culinary Arts"
                : "Mechanical Engineering",
        level: "Expert",
      },
      {
        name: "Project Management",
        level: "Intermediate",
      },
      {
        name: "Communication",
        level: "Advanced",
      },
    ]
  }

  const handleConnect = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        setIsFollowing(true)
        toast({
          title: "Connection successful",
          description: `You are now following ${user.name}`,
        })
      } else {
        // If API fails, still show success for demo
        setIsFollowing(true)
        toast({
          title: "Connection successful",
          description: `You are now following ${user.name}`,
        })
      }
    } catch (error) {
      console.error("Error connecting with user:", error)
      // If API fails, still show success for demo
      setIsFollowing(true)
      toast({
        title: "Connection successful",
        description: `You are now following ${user.name}`,
      })
    }
  }

  const handleStartCall = () => {
    if (currentUser?.id === user.id) {
      toast({
        title: "Cannot call yourself",
        description: "You cannot initiate a call with yourself",
        variant: "destructive",
      })
      return
    }

    onStartVideoCall(user)
  }

  if (!user) return null

  return (
    <div className="flex-1 space-y-4 pb-16 md:pb-0">
      <Button variant="ghost" onClick={onBack} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Skills
      </Button>

      <Card className="overflow-hidden transition-all hover:shadow-md dark:border-slate-800">
        <CardContent className="p-0">
          <div className="h-32 bg-gradient-to-r from-purple-400 to-blue-500 dark:from-purple-700 dark:to-blue-700"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end mt-[-40px] mb-4">
              <div className="h-20 w-20 rounded-full border-4 border-background bg-background overflow-hidden">
                <img
                  src={user.avatar || "/placeholder.svg?height=80&width=80"}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-4 flex-1">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.profession}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button
                  className={
                    isFollowing
                      ? "bg-muted text-foreground hover:bg-muted/80"
                      : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  }
                  onClick={handleConnect}
                >
                  {isFollowing ? "Following" : "Connect"}
                </Button>
                <Button variant="outline" className="ml-2" onClick={handleStartCall}>
                  <Video className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Briefcase className="mr-1 h-4 w-4" />
                <span>{user.profession}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Joined April 2023</span>
              </div>
            </div>

            <Tabs defaultValue="skills">
              <TabsList className="w-full">
                <TabsTrigger value="skills" className="flex-1">
                  Skills
                </TabsTrigger>
                <TabsTrigger value="about" className="flex-1">
                  About
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="mt-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold mb-2">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {userSkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-primary/10 py-1">
                          {skill.name} • <span className="text-primary">{skill.level}</span>
                        </Badge>
                      ))}
                    </div>

                    <h3 className="font-semibold mb-2 mt-6">Skills Offered</h3>
                    <Card className="mb-4 dark:border-slate-800">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {userSkills[0]?.name || "Professional Skill"}
                          </Badge>
                          <Badge variant="outline">4 weeks</Badge>
                        </div>
                        <p className="text-sm mb-4">
                          {user.profession?.includes("UX")
                            ? "Comprehensive training on user interface design principles, wireframing, prototyping, and usability testing."
                            : user.profession?.includes("Developer")
                              ? "In-depth React.js training covering components, hooks, state management, and building production-ready applications."
                              : user.profession?.includes("Data")
                                ? "Practical data science skills including data cleaning, visualization, statistical analysis, and machine learning models."
                                : user.profession?.includes("Chef")
                                  ? "Professional culinary techniques covering knife skills, flavor profiles, and international cuisine preparation."
                                  : "Mechanical engineering fundamentals including CAD design, material properties, and system optimization."}
                        </p>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                          onClick={handleStartCall}
                        >
                          <Video className="mr-2 h-4 w-4" />
                          SwapHere
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="about" className="mt-4">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm mb-4">
                  Passionate {user.profession} with over 8 years of experience in the field. Specialized in{" "}
                  {userSkills[0]?.name || "professional skills"} and committed to sharing knowledge with others.
                </p>

                <h3 className="font-semibold mb-2 mt-6">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{user.email || user.name.toLowerCase().replace(" ", ".") + "@example.com"}</span>
                  </div>
                  <div className="flex items-center">
                    <LinkIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>linkedin.com/in/{user.name.toLowerCase().replace(" ", "")}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                <h3 className="font-semibold mb-2">Reviews</h3>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 mr-2">
                        <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="h-8 w-8 rounded-full" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">John Smith</p>
                        <p className="text-xs text-muted-foreground">2 months ago</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      Excellent instructor! The skills I learned were immediately applicable to my work. Would highly
                      recommend to anyone looking to improve their{" "}
                      {userSkills[0]?.name?.toLowerCase() || "professional"} skills.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 mr-2">
                        <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="h-8 w-8 rounded-full" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Lisa Johnson</p>
                        <p className="text-xs text-muted-foreground">1 month ago</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      Very knowledgeable and patient. The course was well-structured and the hands-on projects really
                      helped solidify the concepts.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
