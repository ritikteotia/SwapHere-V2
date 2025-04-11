"use client"

import { useEffect, useState } from "react"
import SkillCard from "@/components/skill-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"

export default function MiddleSection({ onUserClick, onStartVideoCall }) {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const { user } = useAuth()

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true)
        let url = "/api/skills"

        if (activeTab === "following" && user) {
          url = "/api/skills/following"
        }

        if (categoryFilter !== "all") {
          url += `?category=${categoryFilter}`
        }

        const response = await fetch(url)
        const data = await response.json()
        setSkills(data)
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [activeTab, categoryFilter, user])

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
      </div>
    </div>
  )
}
