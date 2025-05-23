import {Link} from "react-router"
import { ImageIcon } from "lucide-react"

export default function FooterSection() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white">
              <ImageIcon className="h-6 w-6 text-[#155dfc]" />
              <span className="text-xl font-bold">ImageHub</span>
            </Link>
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-400">
              The complete solution for storing, transforming, and optimizing your media assets.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#features"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="#transformation"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  Transformation
                </Link>
              </li>
              <li>
                <Link
                  to="#pricing"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm text-gray-700 dark:text-gray-400 transition-colors hover:text-[#155dfc] dark:hover:text-white"
                >
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-400">
            © {new Date().getFullYear()} ImageHub. All rights reserved 2025.
          </p>
        </div>
      </div>
    </footer>
  )
}
