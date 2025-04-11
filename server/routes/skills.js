const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Skill = require("../models/Skill")
const User = require("../models/User")
const { authenticate } = require("../middleware/auth")

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/skills"
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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

// Get all skills
router.get("/", authenticate, async (req, res) => {
  try {
    const { category } = req.query
    const query = category && category !== "all" ? { category } : {}

    const skills = await Skill.find(query).populate("user", "name avatar profession").sort({ createdAt: -1 })

    // Format skills for client
    const formattedSkills = skills.map((skill) => ({
      id: skill._id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      duration: skill.duration,
      image: skill.image,
      deliveredBy: {
        id: skill.user._id,
        name: skill.user.name,
        avatar: skill.user.avatar,
        profession: skill.user.profession,
      },
      likes: skill.likes.length,
      comments: skill.comments.length,
      shares: skill.shares,
      isLiked: skill.likes.includes(req.user._id),
    }))

    res.status(200).json(formattedSkills)
  } catch (error) {
    console.error("Get skills error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get skills from followed users
router.get("/following", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const skills = await Skill.find({
      user: { $in: user.connections },
    })
      .populate("user", "name avatar profession")
      .sort({ createdAt: -1 })

    // Format skills for client
    const formattedSkills = skills.map((skill) => ({
      id: skill._id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      duration: skill.duration,
      image: skill.image,
      deliveredBy: {
        id: skill.user._id,
        name: skill.user.name,
        avatar: skill.user.avatar,
        profession: skill.user.profession,
      },
      likes: skill.likes.length,
      comments: skill.comments.length,
      shares: skill.shares,
      isLiked: skill.likes.includes(req.user._id),
    }))

    res.status(200).json(formattedSkills)
  } catch (error) {
    console.error("Get following skills error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new skill
router.post("/", authenticate, upload.single("image"), async (req, res) => {
  try {
    const { name, category, description, duration } = req.body

    const skill = new Skill({
      name,
      category,
      description,
      duration,
      user: req.user._id,
      image: req.file ? `/uploads/skills/${req.file.filename}` : "/placeholder.svg?height=400&width=600",
    })

    await skill.save()

    // Add skill to user's skills
    await User.findByIdAndUpdate(req.user._id, {
      $push: { skills: skill._id },
    })

    res.status(201).json({
      id: skill._id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      duration: skill.duration,
      image: skill.image,
    })
  } catch (error) {
    console.error("Create skill error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Like a skill
router.post("/:id/like", authenticate, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" })
    }

    const isLiked = skill.likes.includes(req.user._id)

    if (isLiked) {
      // Unlike
      skill.likes = skill.likes.filter((id) => id.toString() !== req.user._id.toString())
    } else {
      // Like
      skill.likes.push(req.user._id)
    }

    await skill.save()

    res.status(200).json({
      likes: skill.likes.length,
      isLiked: !isLiked,
    })
  } catch (error) {
    console.error("Like skill error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Comment on a skill
router.post("/:id/comment", authenticate, async (req, res) => {
  try {
    const { text } = req.body

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" })
    }

    const skill = await Skill.findById(req.params.id)

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" })
    }

    skill.comments.push({
      user: req.user._id,
      text,
    })

    await skill.save()

    // Populate the new comment
    const populatedSkill = await Skill.findById(req.params.id).populate("comments.user", "name avatar")

    const newComment = populatedSkill.comments[populatedSkill.comments.length - 1]

    res.status(201).json({
      id: newComment._id,
      text: newComment.text,
      user: {
        id: newComment.user._id,
        name: newComment.user.name,
        avatar: newComment.user.avatar,
      },
      createdAt: newComment.createdAt,
    })
  } catch (error) {
    console.error("Comment skill error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
