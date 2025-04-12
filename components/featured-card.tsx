"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function FeaturedCard() {
  const featuredUsers = [
    {
      id: "u1",
      name: "Ritik Kumar",
      avatar: "/placeholder.svg?height=80&width=80",
      profession: "Senior UX Designer",
      skills: ["UI/UX Design", "Wireframing", "User Research"],
    },
    {
      id: "u2",
      name: "Subhadip Dawn",
      avatar: "/placeholder.svg?height=80&width=80",
      profession: "Frontend Developer",
      skills: ["React", "Next.js", "TypeScript"],
    },
    {
      id: "u3",
      name: "Avni Saxena",
      avatar: "/placeholder.svg?height=80&width=80",
      profession: "Data Scientist",
      skills: ["Python", "Machine Learning", "Data Analysis"],
    },
  ]

  return (
    <Card className="mb-6 overflow-hidden transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50">
      <CardContent className="p-0">
        <div className="relative h-40 bg-gradient-to-r from-purple-600 to-blue-500">
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">Featured Experts</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {featuredUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col items-center p-4 rounded-lg border bg-card hover:bg-accent transition-all"
            >
              <Avatar className="h-16 w-16 mb-2">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-center">{user.name}</h3>
              <p className="text-xs text-muted-foreground text-center mb-2">{user.profession}</p>
              <div className="flex flex-wrap gap-1 justify-center mb-3">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Profile <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
