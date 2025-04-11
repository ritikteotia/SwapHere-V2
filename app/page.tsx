"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import AppBar from "@/components/app-bar"
import LeftSection from "@/components/left-section"
import MiddleSection from "@/components/middle-section"
import RightSection from "@/components/right-section"
import MobileNav from "@/components/mobile-nav"
import UserProfile from "@/components/user-profile"
import AddSkill from "@/components/add-skill"
import VideoCall from "@/components/video-call"
import LoginPage from "@/components/login-page"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const [showAddSkill, setShowAddSkill] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [activeVideoCall, setActiveVideoCall] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      toast({
        title: "Welcome back!",
        description: `You're logged in as ${user?.name}`,
      })
    }
  }, [isAuthenticated, user])

  const handleUserClick = (user) => {
    setSelectedUser(user)
    setShowProfile(true)
    setShowAddSkill(false)
  }

  const handleAddSkillClick = () => {
    setShowAddSkill(true)
    setShowProfile(false)
  }

  const handleBackToFeed = () => {
    setShowProfile(false)
    setShowAddSkill(false)
  }

  const handleStartVideoCall = (recipient) => {
    setActiveVideoCall(recipient)
  }

  const handleEndVideoCall = () => {
    setActiveVideoCall(null)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <main className="min-h-screen bg-background">
      <AppBar onAddSkillClick={handleAddSkillClick} />
      <div className="container mx-auto flex flex-col md:flex-row gap-4 p-4">
        <LeftSection className="hidden md:block" onAddSkillClick={handleAddSkillClick} />

        {!showProfile && !showAddSkill ? (
          <>
            <MiddleSection onUserClick={handleUserClick} onStartVideoCall={handleStartVideoCall} />
            <RightSection className="hidden md:block" />
          </>
        ) : showAddSkill ? (
          <AddSkill onBack={handleBackToFeed} />
        ) : (
          <UserProfile user={selectedUser} onBack={handleBackToFeed} onStartVideoCall={handleStartVideoCall} />
        )}
      </div>
      <MobileNav className="md:hidden" onAddSkillClick={handleAddSkillClick} />

      {activeVideoCall && <VideoCall recipient={activeVideoCall} onEndCall={handleEndVideoCall} />}
    </main>
  )
}
