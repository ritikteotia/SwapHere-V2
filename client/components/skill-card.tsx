"use client"

import { Heart, MessageSquare, Share2, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

interface SkillCardProps {
  id: string
  skillName: string
  category: string
  description: string
  deliveredBy: {
    id: string
    name: string
    avatar: string
    profession: string
  }
  duration: string
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  onUserClick: (user: any) => void
  onStartVideoCall: (user: any) => void
}

export default function SkillCard({
  id,
  skillName,
  category,
  description,
  deliveredBy,
  duration,
  likes: initialLikes,
  comments,
  shares,
  isLiked: initialIsLiked = false,
  onUserClick,
  onStartVideoCall,
}: SkillCardProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/skills/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikes(isLiked ? likes - 1 : likes + 1)
      }
    } catch (error) {
      console.error("Error liking skill:", error)
    }
  }

  const handleConnect = async () => {
    try {
      const response = await fetch(`/api/users/${deliveredBy.id}/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        toast({
          title: "Connection request sent",
          description: `You've sent a connection request to ${deliveredBy.name}`,
        })
      }
    } catch (error) {
      console.error("Error connecting with user:", error)
    }
  }

  const handleSwap = () => {
    if (user?.id === deliveredBy.id) {
      toast({
        title: "Cannot swap with yourself",
        description: "You cannot initiate a swap with your own skill",
        variant: "destructive",
      })
      return
    }

    onStartVideoCall(deliveredBy)
  }

  return (
    <Card className="mb-4 overflow-hidden transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950/50">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
              {skillName}
            </Badge>
            <Badge variant="outline" className="w-fit">
              {category}
            </Badge>
          </div>
          <Badge variant="outline" className="bg-card">
            {duration}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="mb-4">{description}</p>
        <div
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-all"
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
          <Button variant="ghost" size="sm" className="gap-1 transition-all hover:bg-accent" onClick={handleLike}>
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 transition-all hover:bg-accent">
            <MessageSquare className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 transition-all hover:bg-accent">
            <Share2 className="h-4 w-4" />
            <span>{shares}</span>
          </Button>
        </div>
        <div className="flex mt-2 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 transition-all hover:bg-accent"
            onClick={handleConnect}
          >
            Connect
          </Button>
          <Button
            size="sm"
            className="ml-2 text-xs h-8 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            onClick={handleSwap}
          >
            <Video className="mr-1 h-3 w-3" />
            SwapHere
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
