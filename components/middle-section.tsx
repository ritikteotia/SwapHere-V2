"use client"

import { useEffect, useState } from "react"
import SkillCard from "@/components/skill-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { useInView } from "react-intersection-observer"
import FeaturedCard from "@/components/featured-card"

export default function MiddleSection({ onUserClick, onStartVideoCall }) {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { user } = useAuth()

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        if (!loading) {
          setLoading(true)
          let url = `${process.env.NEXT_PUBLIC_API_URL}/api/skills?page=${page}`

          if (activeTab === "following" && user) {
            url = `${process.env.NEXT_PUBLIC_API_URL}/api/skills/following?page=${page}`
          }

          if (categoryFilter !== "all") {
            url += `&category=${categoryFilter}`
          }

          const response = await fetch(url, {
            credentials: "include",
          })

          if (!response.ok) {
            throw new Error("Failed to fetch skills")
          }

          const data = await response.json()

          if (page === 1) {
            setSkills(data)
          } else {
            setSkills((prevSkills) => [...prevSkills, ...data])
          }

          // If we received fewer items than expected, we've reached the end
          setHasMore(data.length > 0)
        }
      } catch (error) {
        console.error("Error fetching skills:", error)
        // If API fails, use mock data
        if (page === 1) {
          setSkills(getMockSkills())
        } else {
          // For infinite scroll, duplicate the mock data with different IDs
          const moreSkills = getMockSkills().map((skill) => ({
            ...skill,
            id: `${skill.id}-${page}`,
          }))
          setSkills((prevSkills) => [...prevSkills, ...moreSkills])
        }
        setHasMore(true) // Always allow more scrolling in mock mode
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [activeTab, categoryFilter, user, page])

  // Add effect for infinite scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [inView, hasMore, loading])

  // Mock data in case the API is not available
  const getMockSkills = () => {
    return [
      {
        id: "1",
        name: "UI/UX Design",
        category: "design",
        description:
          "Learn the fundamentals of user interface and experience design. This skill covers wireframing, prototyping, and user testing methodologies to create intuitive digital experiences.",
        deliveredBy: {
          id: "u1",
          name: "Ritik Kumar",
          avatar: "/placeholder.svg?height=40&width=40",
          profession: "Senior UX Designer",
        },
        duration: "4 weeks",
        likes: 95,
        comments: 18,
        shares: 12,
      },
      {
        id: "2",
        name: "React Development",
        category: "development",
        description:
          "Master React.js from basics to advanced concepts. Build responsive web applications with modern JavaScript frameworks and learn state management techniques.",
        deliveredBy: {
          id: "u2",
          name: "Subhadip Dawn",
          avatar: "/placeholder.svg?height=40&width=40",
          profession: "Frontend Developer",
        },
        duration: "6 weeks",
        likes: 78,
        comments: 23,
        shares: 15,
      },
      {
        id: "3",
        name: "Data Science",
        category: "development",
        description:
          "Introduction to data analysis and machine learning algorithms. Learn how to extract insights from large datasets and build predictive models using Python.",
        deliveredBy: {
          id: "u3",
          name: "Avni Saxena",
          avatar: "/placeholder.svg?height=40&width=40",
          profession: "Data Scientist",
        },
        duration: "8 weeks",
        likes: 112,
        comments: 34,
        shares: 27,
      },
      {
        id: "4",
        name: "Culinary Arts",
        category: "cooking",
        description:
          "Learn professional cooking techniques and recipes from around the world. This skill covers knife skills, flavor combinations, and presentation techniques.",
        deliveredBy: {
          id: "u4",
          name: "Rahul Sharma",
          avatar: "/placeholder.svg?height=40&width=40",
          profession: "Executive Chef",
        },
        duration: "5 weeks",
        likes: 67,
        comments: 15,
        shares: 9,
      },
      {
        id: "5",
        name: "Mechanical Engineering",
        category: "mechanical",
        description:
          "Fundamentals of mechanical systems design and analysis. Learn about material properties, stress analysis, and CAD modeling for engineering applications.",
        deliveredBy: {
          id: "u5",
          name: "Priya Patel",
          avatar: "/placeholder.svg?height=40&width=40",
          profession: "Mechanical Engineer",
        },
        duration: "10 weeks",
        likes: 45,
        comments: 12,
        shares: 8,
      },
    ]
  }

  return (
    <div className="flex-1 space-y-4 pb-16 md:pb-0">
      <div className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-lg font-semibold">Available Skills</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="cooking">Cooking</SelectItem>
                <SelectItem value="mechanical">Mechanical</SelectItem>
              </SelectContent>
            </Select>
            <Input type="search" placeholder="Search skills..." className="w-full sm:w-auto" />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Skills</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
        </Tabs>

        <FeaturedCard />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : skills.length > 0 ? (
          skills.map((skill) => (
            <SkillCard
              key={skill.id}
              id={skill.id}
              skillName={skill.name}
              category={skill.category}
              description={skill.description}
              deliveredBy={skill.deliveredBy}
              duration={skill.duration}
              likes={skill.likes}
              comments={skill.comments}
              shares={skill.shares}
              isLiked={skill.isLiked}
              onUserClick={onUserClick}
              onStartVideoCall={onStartVideoCall}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No skills found</p>
            <Button>Explore More Skills</Button>
          </div>
        )}
        {hasMore && (
          <div ref={ref} className="flex justify-center py-4">
            {loading && (
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
