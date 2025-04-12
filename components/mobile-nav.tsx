"use client"

import { Home, Search, Bell, User, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function MobileNav({ className, onAddSkillClick }) {
  const [activeTab, setActiveTab] = useState("home")

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    if (tab === "add") {
      onAddSkillClick()
    }
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-10 border-t bg-background ${className}`}>
      <div className="flex items-center justify-around">
        <Button
          variant={activeTab === "home" ? "default" : "ghost"}
          className={`flex-1 flex-col py-3 h-auto rounded-none ${
            activeTab === "home" ? "bg-primary text-primary-foreground" : ""
          }`}
          onClick={() => handleTabClick("home")}
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Home</span>
        </Button>
        <Button
          variant={activeTab === "search" ? "default" : "ghost"}
          className={`flex-1 flex-col py-3 h-auto rounded-none ${
            activeTab === "search" ? "bg-primary text-primary-foreground" : ""
          }`}
          onClick={() => handleTabClick("search")}
        >
          <Search className="h-5 w-5 mb-1" />
          <span className="text-xs">Search</span>
        </Button>
        <Button
          onClick={() => handleTabClick("add")}
          className="flex-1 flex-col py-3 h-auto rounded-none bg-gradient-to-r from-purple-600 to-blue-500 text-white"
        >
          <PlusCircle className="h-5 w-5 mb-1" />
          <span className="text-xs">Add</span>
        </Button>
        <Button
          variant={activeTab === "alerts" ? "default" : "ghost"}
          className={`flex-1 flex-col py-3 h-auto rounded-none ${
            activeTab === "alerts" ? "bg-primary text-primary-foreground" : ""
          }`}
          onClick={() => handleTabClick("alerts")}
        >
          <Bell className="h-5 w-5 mb-1" />
          <span className="text-xs">Alerts</span>
        </Button>
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          className={`flex-1 flex-col py-3 h-auto rounded-none ${
            activeTab === "profile" ? "bg-primary text-primary-foreground" : ""
          }`}
          onClick={() => handleTabClick("profile")}
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  )
}
