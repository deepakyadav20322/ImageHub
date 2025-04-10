import { Link } from "react-router"
import { ImageIcon } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="border-t border-white/10 bg-[#0F172A] py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 text-white">
              <ImageIcon className="h-6 w-6 text-sky-400" />
              <span className="text-xl font-bold">ImageHub</span>
            </Link>
            <p className="mt-4 text-sm text-[#E4E4E7]/60">
              The complete solution for storing, transforming, and optimizing your media assets.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#features" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#pricing" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-[#E4E4E7]/60 transition-colors hover:text-white">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-[#E4E4E7]/60">© {new Date().getFullYear()} ImageHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
