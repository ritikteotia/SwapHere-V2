const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const http = require("http")
const { Server } = require("socket.io")
const dotenv = require("dotenv")
const path = require("path")
const authRoutes = require("./routes/auth")
const skillRoutes = require("./routes/skills")
const userRoutes = require("./routes/users")
const searchRoutes = require("./routes/search")
const { authenticateSocket } = require("./middleware/auth")

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const server = http.createServer(app)

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
})

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/swapHere")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/skills", skillRoutes)
app.use("/api/users", userRoutes)
app.use("/api/search", searchRoutes)

// Socket.io connection handling
const connectedUsers = new Map()

io.use(authenticateSocket)

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId
  console.log(`User connected: ${userId}`)

  // Store user connection
  connectedUsers.set(userId, socket.id)

  // Handle call requests
  socket.on("call-user", ({ from, to, roomId }) => {
    const toSocketId = connectedUsers.get(to)
    if (toSocketId) {
      io.to(toSocketId).emit("incoming-call", { from, roomId })
    }
  })

  socket.on("call-joined", ({ from, to, roomId }) => {
    const toSocketId = connectedUsers.get(to)
    if (toSocketId) {
      io.to(toSocketId).emit("call-accepted", { from, roomId })
    }
  })

  socket.on("end-call", ({ from, to, roomId }) => {
    const toSocketId = connectedUsers.get(to)
    if (toSocketId) {
      io.to(toSocketId).emit("call-ended", { from, roomId })
    }
  })

  // Handle messages
  socket.on("send-message", (message) => {
    const recipientId = message.roomId.split("-").find((id) => id !== userId)
    const recipientSocketId = connectedUsers.get(recipientId)

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("message", message)
    }
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`)
    connectedUsers.delete(userId)
  })
})

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
