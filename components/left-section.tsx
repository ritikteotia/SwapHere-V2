import { Home, User, Briefcase, MessageSquare, Bell, Bookmark, Users, Calendar, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LeftSection({ className = "" }) {
  const menuItems = [
    { icon: Home, label: "Home" },
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
      className={`sticky top-20 h-fit w-64 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="space-y-1">
        {menuItems.map((item, index) => (
          <Button key={index} variant="ghost" className="w-full justify-start gap-3 transition-all hover:bg-purple-50">
            <item.icon className="h-5 w-5 text-purple-600" />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <Button className="w-full bg-purple-600 transition-all hover:bg-purple-700">Add Skill</Button>
      </div>
    </div>
  )
}
