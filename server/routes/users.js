const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const User = require("../models/User")
const Skill = require("../models/Skill")
const { authenticate } = require("../middleware/auth")

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/avatars"
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error("Only image files are allowed"))
  },
})

// Get user profile
router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-pendingConnections")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Get user's skills
    const skills = await Skill.find({ user: user._id })

    // Check if the current user is connected with this user
    const isConnected = user.connections.includes(req.user._id)
    const isPending = user.pendingConnections.includes(req.user._id)

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profession: user.profession,
      bio: user.bio,
      location: user.location,
      skills: skills.map((skill) => ({
        id: skill._id,
        name: skill.name,
        category: skill.category,
        description: skill.description,
        duration: skill.duration,
        image: skill.image,
        likes: skill.likes.length,
        comments: skill.comments.length,
      })),
      connectionStatus: isConnected ? "connected" : isPending ? "pending" : "none",
      connectionsCount: user.connections.length,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/profile", authenticate, upload.single("avatar"), async (req, res) => {
  try {
    const { name, profession, bio, location } = req.body

    const updateData = {
      name: name || req.user.name,
      profession: profession || req.user.profession,
      bio: bio || req.user.bio,
      location: location || req.user.location,
    }

    if (req.file) {
      updateData.avatar = `/uploads/avatars/${req.file.filename}`
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true })

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      profession: user.profession,
      bio: user.bio,
      location: user.location,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Send connection request
router.post("/:id/connect", authenticate, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot connect with yourself" })
    }

    const targetUser = await User.findById(req.params.id)

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if already connected
    if (targetUser.connections.includes(req.user._id)) {
      return res.status(400).json({ message: "Already connected" })
    }

    // Check if connection request is already pending
    if (targetUser.pendingConnections.includes(req.user._id)) {
      return res.status(400).json({ message: "Connection request already sent" })
    }

    // Add to pending connections
    targetUser.pendingConnections.push(req.user._id)
    await targetUser.save()

    res.status(200).json({ message: "Connection request sent" })
  } catch (error) {
    console.error("Connect error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Accept connection request
router.post("/connections/accept/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    // Check if request exists
    if (!user.pendingConnections.includes(req.params.id)) {
      return res.status(400).json({ message: "No pending request from this user" })
    }

    // Remove from pending and add to connections
    user.pendingConnections = user.pendingConnections.filter((id) => id.toString() !== req.params.id)
    user.connections.push(req.params.id)
    await user.save()

    // Add current user to the other user's connections
    await User.findByIdAndUpdate(req.params.id, {
      $push: { connections: req.user._id },
    })

    res.status(200).json({ message: "Connection accepted" })
  } catch (error) {
    console.error("Accept connection error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Reject connection request
router.post("/connections/reject/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    // Check if request exists
    if (!user.pendingConnections.includes(req.params.id)) {
      return res.status(400).json({ message: "No pending request from this user" })
    }

    // Remove from pending
    user.pendingConnections = user.pendingConnections.filter((id) => id.toString() !== req.params.id)
    await user.save()

    res.status(200).json({ message: "Connection rejected" })
  } catch (error) {
    console.error("Reject connection error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get pending connection requests
router.get("/connections/pending", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("pendingConnections", "name avatar profession")

    res.status(200).json(
      user.pendingConnections.map((connection) => ({
        id: connection._id,
        name: connection.name,
        avatar: connection.avatar,
        profession: connection.profession,
      })),
    )
  } catch (error) {
    console.error("Get pending connections error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
