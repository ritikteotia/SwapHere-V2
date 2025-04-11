import { Home, Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MobileNav({ className }) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-10 border-t bg-white ${className}`}>
      <div className="flex items-center justify-around">
        <Button variant="ghost" className="flex-1 flex-col py-3 h-auto rounded-none">
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Home</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex-col py-3 h-auto rounded-none">
          <Search className="h-5 w-5 mb-1" />
          <span className="text-xs">Search</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex-col py-3 h-auto rounded-none">
          <Bell className="h-5 w-5 mb-1" />
          <span className="text-xs">Alerts</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex-col py-3 h-auto rounded-none">
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  )
}
