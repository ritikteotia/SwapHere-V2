const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Skill = require("../models/Skill")
const { authenticate } = require("../middleware/auth")

// Search for skills and users
router.get("/", authenticate, async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.length < 2) {
      return res.status(400).json({ message: "Search query too short" })
    }

    // Search for skills
    const skills = await Skill.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    }).limit(5)

    // Search for users
    const users = await User.find({
      $or: [{ name: { $regex: q, $options: "i" } }, { profession: { $regex: q, $options: "i" } }],
    }).limit(5)

    // Format results
    const results = [
      ...skills.map((skill) => ({
        id: skill._id,
        name: skill.name,
        category: skill.category,
        type: "skill",
      })),
      ...users.map((user) => ({
        id: user._id,
        name: user.name,
        avatar: user.avatar,
        profession: user.profession,
        type: "user",
      })),
    ]

    res.status(200).json(results)
  } catch (error) {
    console.error("Search error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
