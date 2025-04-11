"use client"

import { useEffect, useRef, useState } from "react"
import { X, Mic, MicOff, VideoIcon, VideoOff, MessageSquare, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { useSocket } from "@/context/socket-context"
import { useToast } from "@/components/ui/use-toast"

export default function VideoCall({ recipient, onEndCall }) {
  const { user } = useAuth()
  const { socket } = useSocket()
  const { toast } = useToast()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [callStatus, setCallStatus] = useState("connecting") // connecting, active, ended
  const apiRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Load Jitsi Meet API
    const script = document.createElement("script")
    script.src = "https://meet.jit.si/external_api.js"
    script.async = true

    script.onload = () => {
      initializeJitsi()
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
      if (apiRef.current) {
        apiRef.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on("message", (message) => {
        if (message.roomId === `${user.id}-${recipient.id}` || message.roomId === `${recipient.id}-${user.id}`) {
          setMessages((prev) => [...prev, message])
        }
      })

      // Notify the other user about the call
      socket.emit("call-user", {
        from: user,
        to: recipient.id,
        roomId: `${user.id}-${recipient.id}`,
      })

      // Listen for call accepted
      socket.on("call-accepted", () => {
        setCallStatus("active")
        toast({
          title: "Call connected",
          description: `${recipient.name} joined the call`,
        })
      })

      // Listen for call ended
      socket.on("call-ended", () => {
        toast({
          title: "Call ended",
          description: `${recipient.name} has left the call`,
        })
        onEndCall()
      })
    }

    return () => {
      if (socket) {
        socket.off("message")
        socket.off("call-accepted")
        socket.off("call-ended")
        socket.emit("end-call", {
          from: user.id,
          to: recipient.id,
          roomId: `${user.id}-${recipient.id}`,
        })
      }
    }
  }, [socket, user, recipient])

  const initializeJitsi = () => {
    if (window.JitsiMeetExternalAPI && containerRef.current) {
      const domain = "meet.jit.si"
      const roomName = `swapHere-${user.id}-${recipient.id}`.replace(/[^a-zA-Z0-9]/g, "")

      const options = {
        roomName,
        width: "100%",
        height: "100%",
        parentNode: containerRef.current,
        userInfo: {
          displayName: user.name,
          email: user.email,
        },
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          DEFAULT_BACKGROUND: "#111827",
          DEFAULT_REMOTE_DISPLAY_NAME: recipient.name,
        },
      }

      apiRef.current = new window.JitsiMeetExternalAPI(domain, options)

      apiRef.current.addEventListeners({
        videoConferenceJoined: () => {
          setCallStatus("active")
          if (socket) {
            socket.emit("call-joined", {
              from: user.id,
              to: recipient.id,
              roomId: `${user.id}-${recipient.id}`,
            })
          }
        },
        participantLeft: () => {
          toast({
            title: "Call ended",
            description: `${recipient.name} has left the call`,
          })
          onEndCall()
        },
      })
    }
  }

  const toggleMute = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleAudio")
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("toggleVideo")
      setIsVideoOff(!isVideoOff)
    }
  }

  const handleEndCall = () => {
    if (socket) {
      socket.emit("end-call", {
        from: user.id,
        to: recipient.id,
        roomId: `${user.id}-${recipient.id}`,
      })
    }
    onEndCall()
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() && socket) {
      const message = {
        sender: user.id,
        senderName: user.name,
        text: newMessage,
        timestamp: new Date().toISOString(),
        roomId: `${user.id}-${recipient.id}`,
      }

      socket.emit("send-message", message)
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 z-50 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden rounded-lg border bg-background p-0 shadow-lg">
        <div className={`relative h-full ${showChat ? "md:col-span-2" : "md:col-span-3"}`}>
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${callStatus === "connecting" ? "bg-yellow-500" : "bg-green-500"}`}
              ></div>
              <span className="text-white text-sm">{callStatus === "connecting" ? "Connecting..." : "Connected"}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/50 border-0 text-white hover:bg-black/70"
            onClick={onEndCall}
          >
            <X className="h-4 w-4" />
          </Button>
          <div ref={containerRef} className="h-full w-full bg-black"></div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-12 w-12 ${isMuted ? "bg-red-500 text-white hover:bg-red-600" : "bg-black/50 text-white hover:bg-black/70"}`}
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-12 w-12 ${isVideoOff ? "bg-red-500 text-white hover:bg-red-600" : "bg-black/50 text-white hover:bg-black/70"}`}
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <VideoIcon className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 bg-red-500 text-white hover:bg-red-600"
              onClick={handleEndCall}
            >
              <Phone className="h-5 w-5 rotate-135" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full h-12 w-12 ${showChat ? "bg-primary text-primary-foreground" : "bg-black/50 text-white hover:bg-black/70"}`}
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {showChat && (
          <Card className="h-full flex flex-col overflow-hidden">
            <div className="p-4 border-b flex items-center gap-2">
              <Avatar>
                <AvatarImage src={recipient.avatar} alt={recipient.name} />
                <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{recipient.name}</h3>
                <p className="text-xs text-muted-foreground">{recipient.profession}</p>
              </div>
            </div>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-muted-foreground">No messages yet</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === user.id ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === user.id ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <div className="p-4 border-t">
              <form onSubmit={sendMessage} className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
