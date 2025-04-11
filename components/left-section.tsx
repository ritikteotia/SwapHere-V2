"use client"

import {
  Home,
  User,
  Briefcase,
  MessageSquare,
  Bell,
  Bookmark,
  Users,
  Calendar,
  Settings,
  PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function LeftSection({ className = "", onAddSkillClick }) {
  const { user } = useAuth()

  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: User, label: "Profile" },
    { icon: Briefcase, label: "Skills" },
    { icon: MessageSquare, label: "Messages" },
    { icon: Bell, label: "Notifications" },
    { icon: Bookmark, label: "Saved Skills" },
    { icon: Users, label: "Network" },
    { icon: Calendar, label: "Events" },
    { icon: Settings, label: "Settings" },
  ]

  return (
    <div
      className={cn(
        "sticky top-20 h-fit w-56 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="flex flex-col items-center mb-4 pb-4 border-b">
        <Avatar className="h-16 w-16 mb-2">
          <AvatarImage src={user?.avatar || "/placeholder.svg?height=64&width=64"} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="font-medium">{user?.name}</h3>
        <p className="text-xs text-muted-foreground">{user?.profession || "SwapHere Member"}</p>
      </div>

      <div className="space-y-1">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant={item.active ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 transition-all"
          >
            <item.icon className={cn("h-5 w-5", item.active ? "text-primary" : "text-muted-foreground")} />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <Button
          onClick={onAddSkillClick}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>
    </div>
  )
}
