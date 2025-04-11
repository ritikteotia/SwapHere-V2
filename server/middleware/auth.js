const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Middleware to authenticate API requests
exports.authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth error:", error)
    return res.status(401).json({ message: "Invalid token" })
  }
}

// Middleware to authenticate socket connections
exports.authenticateSocket = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1]

    if (!token) {
      return next(new Error("Authentication required"))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      return next(new Error("User not found"))
    }

    socket.user = user
    next()
  } catch (error) {
    console.error("Socket auth error:", error)
    next(new Error("Invalid token"))
  }
}
