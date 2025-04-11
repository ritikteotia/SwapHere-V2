const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const User = require("../models/User")
const { authenticate } = require("../middleware/auth")

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Google Sign-In
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const { sub: googleId, email, name, picture } = payload

    // Check if user exists
    let user = await User.findOne({ email })

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        avatar: picture,
      })
      await user.save()
    } else {
      // Update existing user
      user.googleId = googleId
      user.avatar = picture
      await user.save()
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // Return user data
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profession: user.profession,
    })
  } catch (error) {
    console.error("Google auth error:", error)
    res.status(500).json({ message: "Authentication failed" })
  }
})

// Get current user
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    profession: req.user.profession,
  })
})

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token")
  res.status(200).json({ message: "Logged out successfully" })
})

module.exports = router
