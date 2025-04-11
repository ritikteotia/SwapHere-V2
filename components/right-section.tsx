import GoogleSignIn from "@/components/google-sign-in"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RightSection({ className = "" }) {
  return (
    <div className={`sticky top-20 h-fit w-80 space-y-4 ${className}`}>
      <GoogleSignIn />

      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white p-4">
          <CardTitle className="text-sm font-medium text-purple-700">Popular Skills</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="space-y-2 text-sm">
            <li className="rounded-md p-2 transition-all hover:bg-purple-50">
              <span className="font-medium">#WebDevelopment</span>
              <p className="text-xs text-muted-foreground">982 skills available</p>
            </li>
            <li className="rounded-md p-2 transition-all hover:bg-purple-50">
              <span className="font-medium">#UXDesign</span>
              <p className="text-xs text-muted-foreground">754 skills available</p>
            </li>
            <li className="rounded-md p-2 transition-all hover:bg-purple-50">
              <span className="font-medium">#DataScience</span>
              <p className="text-xs text-muted-foreground">621 skills available</p>
            </li>
            <li className="rounded-md p-2 transition-all hover:bg-purple-50">
              <span className="font-medium">#CulinaryArts</span>
              <p className="text-xs text-muted-foreground">438 skills available</p>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white p-4">
          <CardTitle className="text-sm font-medium text-purple-700">Recommended Skills</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="rounded-lg border p-3 hover:bg-purple-50 transition-all">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Photography
                </Badge>
                <Badge variant="outline">3 weeks</Badge>
              </div>
              <p className="text-xs mb-2">Learn professional photography techniques from composition to editing.</p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-purple-100">
                  <img src="/placeholder.svg?height=24&width=24" alt="Profile" className="h-6 w-6 rounded-full" />
                </div>
                <p className="text-xs">By James Wilson</p>
              </div>
            </div>

            <div className="rounded-lg border p-3 hover:bg-purple-50 transition-all">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Digital Marketing
                </Badge>
                <Badge variant="outline">5 weeks</Badge>
              </div>
              <p className="text-xs mb-2">Master social media marketing, SEO, and content strategy.</p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-purple-100">
                  <img src="/placeholder.svg?height=24&width=24" alt="Profile" className="h-6 w-6 rounded-full" />
                </div>
                <p className="text-xs">By Emily Chen</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
