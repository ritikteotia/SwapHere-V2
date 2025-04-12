"use client"

import { useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function AddSkill({ onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    duration: "",
    image: null,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create FormData for file upload
      const data = new FormData()

      data.append("name", formData.name)
      data.append("category", formData.category)
      data.append("description", formData.description)
      data.append("duration", formData.duration)
      if (formData.image) {
        data.append("image", formData.image)
      }

      const response = await fetch("/api/skills", {
        method: "POST",
        body: data,
      })

      if (response.ok) {
        toast({
          title: "Skill added successfully",
          description: "Your skill has been added to the platform",
        })
        onBack()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to add skill")
      }
    } catch (error) {
      toast({
        title: "Error adding skill",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 pb-16 md:pb-0">
      <Button variant="ghost" onClick={onBack} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Skills
      </Button>

      <Card className="overflow-hidden transition-all hover:shadow-md dark:border-slate-800">
        <CardHeader>
          <CardTitle>Add a New Skill</CardTitle>
          <CardDescription>Share your expertise with the SwapHere community</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., UI/UX Design"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="cooking">Cooking</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your skill in detail..."
                value={formData.description}
                onChange={handleChange}
                required
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleSelectChange("duration", value)}
                  required
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 week">1 week</SelectItem>
                    <SelectItem value="2 weeks">2 weeks</SelectItem>
                    <SelectItem value="3 weeks">3 weeks</SelectItem>
                    <SelectItem value="4 weeks">4 weeks</SelectItem>
                    <SelectItem value="6 weeks">6 weeks</SelectItem>
                    <SelectItem value="8 weeks">8 weeks</SelectItem>
                    <SelectItem value="12 weeks">12 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Skill Image (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("image").click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {formData.image ? "Change Image" : "Upload Image"}
                  </Button>
                </div>
                {formData.image && <p className="text-xs text-muted-foreground">{formData.image.name}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Adding Skill...
                </>
              ) : (
                "Add Skill"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
