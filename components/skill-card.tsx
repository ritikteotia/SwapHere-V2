"use client"

import { Heart, MessageSquare, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SkillCardProps {
  skillName: string
  description: string
  deliveredBy: {
    name: string
    avatar: string
    profession: string
  }
  duration: string
  likes: number
  comments: number
  shares: number
  onUserClick: (user: any) => void
}

export default function SkillCard({
  skillName,
  description,
  deliveredBy,
  duration,
  likes,
  comments,
  shares,
  onUserClick,
}: SkillCardProps) {
  return (
    <Card className="mb-4 overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
            {skillName}
          </Badge>
          <Badge variant="outline" className="bg-gray-50">
            {duration}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4">{description}</p>
        <div
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 cursor-pointer transition-all"
          onClick={() => onUserClick(deliveredBy)}
        >
          <Avatar>
            <AvatarImage src={deliveredBy.avatar} alt={deliveredBy.name} />
            <AvatarFallback>{deliveredBy.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm">Delivered by {deliveredBy.name}</h3>
            <p className="text-xs text-muted-foreground">{deliveredBy.profession}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between border-t p-2">
        <div className="flex">
          <Button variant="ghost" size="sm" className="gap-1 transition-all hover:bg-purple-50">
            <Heart className="h-4 w-4" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 transition-all hover:bg-purple-50">
            <MessageSquare className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 transition-all hover:bg-purple-50">
            <Share2 className="h-4 w-4" />
            <span>{shares}</span>
          </Button>
        </div>
        <div className="flex mt-2 sm:mt-0">
          <Button variant="outline" size="sm" className="text-xs h-8 transition-all hover:bg-purple-50">
            Connect
          </Button>
          <Button size="sm" className="ml-2 text-xs h-8 bg-purple-600 hover:bg-purple-700">
            SwapHere
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
