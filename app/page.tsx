"use client"

import { useState } from "react"
import AppBar from "@/components/app-bar"
import LeftSection from "@/components/left-section"
import MiddleSection from "@/components/middle-section"
import RightSection from "@/components/right-section"
import MobileNav from "@/components/mobile-nav"
import UserProfile from "@/components/user-profile"

export default function Home() {
  const [showProfile, setShowProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const handleUserClick = (user) => {
    setSelectedUser(user)
    setShowProfile(true)
  }

  const handleBackToFeed = () => {
    setShowProfile(false)
  }

  return (
    <main className="min-h-screen bg-white">
      <AppBar />
      <div className="container mx-auto flex flex-col md:flex-row gap-4 p-4">
        <LeftSection className="hidden md:block" />

        {!showProfile ? (
          <>
            <MiddleSection onUserClick={handleUserClick} />
            <RightSection className="hidden md:block" />
          </>
        ) : (
          <UserProfile user={selectedUser} onBack={handleBackToFeed} />
        )}
      </div>
      <MobileNav className="md:hidden" />
    </main>
  )
}
