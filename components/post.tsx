import { Heart, MessageSquare, Share2, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface PostProps {
  author: string
  avatar: string
  time: string
  content: string
  likes: number
  comments: number
  shares: number
}

export default function Post({ author, avatar, time, content, likes, comments, shares }: PostProps) {
  return (
    <Card className="mb-4 overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={avatar} alt={author} />
          <AvatarFallback>{author.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{author}</h3>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p>{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="ghost" size="sm" className="gap-2 transition-all hover:bg-purple-50">
          <Heart className="h-4 w-4" />
          <span>{likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 transition-all hover:bg-purple-50">
          <MessageSquare className="h-4 w-4" />
          <span>{comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 transition-all hover:bg-purple-50">
          <Share2 className="h-4 w-4" />
          <span>{shares}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2 transition-all hover:bg-purple-50">
          <UserPlus className="h-4 w-4" />
          <span>Connect</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
