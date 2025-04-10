
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-white">
          <ImageIcon className="h-6 w-6 text-sky-400" />
          <span className="text-xl font-bold">ImageHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="#features" className="text-sm text-white/70 transition-colors hover:text-white">
            Features
          </Link>
          <Link to="#use-cases" className="text-sm text-white/70 transition-colors hover:text-white">
            Use Cases
          </Link>
          <Link to="#pricing" className="text-sm text-white/70 transition-colors hover:text-white">
            Pricing
          </Link>
          <Link to="#" className="text-sm text-white/70 transition-colors hover:text-white">
            Documentation
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            Log In
          </Button>
          <Button className="bg-sky-500 text-white hover:bg-sky-600">Sign Up Free</Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="text-white md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-b border-white/10 bg-[#0F172A] px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              to="#features"
              className="text-white/70 transition-colors hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="#use-cases"
              className="text-white/70 transition-colors hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Use Cases
            </Link>
            <Link
              to="#pricing"
              className="text-white/70 transition-colors hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="#"
              className="text-white/70 transition-colors hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" className="justify-center text-white hover:bg-white/10 hover:text-white">
                Log In
              </Button>
              <Button className="justify-center bg-sky-500 text-white hover:bg-sky-600">Sign Up Free</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
