import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import LeftSection from "./left-section"

export default function AppBar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="py-4">
                <LeftSection />
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold text-purple-600">swapHere</h1>
        </div>
        <div className="relative hidden w-full max-w-sm md:block">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search skills..."
            className="w-full pl-8 transition-all hover:shadow-md focus:shadow-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex transition-all hover:bg-purple-100">
            Explore
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden transition-all hover:bg-purple-100">
            <Search className="h-5 w-5" />
          </Button>
          <Button size="sm" className="bg-purple-600 transition-all hover:bg-purple-700">
            Swap
          </Button>
        </div>
      </div>
    </header>
  )
}
