import SkillCard from "@/components/skill-card"

export default function MiddleSection({ onUserClick }) {
  const skills = [
    {
      skillName: "UI/UX Design",
      description:
        "Learn the fundamentals of user interface and experience design. This skill covers wireframing, prototyping, and user testing methodologies to create intuitive digital experiences.",
      deliveredBy: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        profession: "Senior UX Designer",
      },
      duration: "4 weeks",
      likes: 95,
      comments: 18,
      shares: 12,
    },
    {
      skillName: "React Development",
      description:
        "Master React.js from basics to advanced concepts. Build responsive web applications with modern JavaScript frameworks and learn state management techniques.",
      deliveredBy: {
        name: "Alex Morgan",
        avatar: "/placeholder.svg?height=40&width=40",
        profession: "Frontend Developer",
      },
      duration: "6 weeks",
      likes: 78,
      comments: 23,
      shares: 15,
    },
    {
      skillName: "Data Science",
      description:
        "Introduction to data analysis and machine learning algorithms. Learn how to extract insights from large datasets and build predictive models using Python.",
      deliveredBy: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        profession: "Data Scientist",
      },
      duration: "8 weeks",
      likes: 112,
      comments: 34,
      shares: 27,
    },
    {
      skillName: "Culinary Arts",
      description:
        "Learn professional cooking techniques and recipes from around the world. This skill covers knife skills, flavor combinations, and presentation techniques.",
      deliveredBy: {
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        profession: "Executive Chef",
      },
      duration: "5 weeks",
      likes: 67,
      comments: 15,
      shares: 9,
    },
    {
      skillName: "Mechanical Engineering",
      description:
        "Fundamentals of mechanical systems design and analysis. Learn about material properties, stress analysis, and CAD modeling for engineering applications.",
      deliveredBy: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        profession: "Mechanical Engineer",
      },
      duration: "10 weeks",
      likes: 45,
      comments: 12,
      shares: 8,
    },
  ]

  return (
    <div className="flex-1 space-y-4 pb-16 md:pb-0">
      <div className="rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Available Skills</h2>
        {skills.map((skill, index) => (
          <SkillCard key={index} {...skill} onUserClick={onUserClick} />
        ))}
      </div>
    </div>
  )
}
