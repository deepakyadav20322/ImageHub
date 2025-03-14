
import { useState } from "react"
import { Link } from "react-router"
import {
  Image,
  Mail,
  Radio,
  Users,
  BarChart2,
  Globe,
  FileText,
  Code,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import ModeToggle from "./mode-toggle"

const teamData = {
  name: "MediaHub Team",
  avatar: "MH",
  storage: "284 KB",
}

const navItems = [
  { icon: Mail, label: "Getting Started", path: "/dashboard/getting-started" },
  { icon: Image, label: "Assets", path: "dashboard/assets" }, 
  { icon: Radio, label: "Broadcasts", path: "/broadcasts" },
  { icon: Users, label: "Audiences", path: "/audiences" },
  { icon: BarChart2, label: "Metrics", path: "/metrics" },
  { icon: Globe, label: "Domains", path: "/domains" },
  { icon: FileText, label: "Logs", path: "/logs" },
  { icon: Code, label: "API Keys", path: "/api-keys" },
  { icon: Link as any, label: "Webhooks", path: "/webhooks" },
  { icon: Settings, label: "Settings", path: "/settings" },
]

interface ISidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const Sidebar = ({ collapsed, setCollapsed }: ISidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleSidebar = () => setCollapsed(!collapsed)
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen)

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-black shadow-md md:hidden"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X size={20} className="text-gray-800 dark:text-gray-200" />
        ) : (
          <Menu size={20} className="text-gray-800 dark:text-gray-200" />
        )}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full bg-white dark:bg-black border-r dark:border-r-slate-400 border-gray-200 dark:border-black transition-all duration-200 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          ${collapsed ? "w-16" : "w-64"} 
          md:translate-x-0
        `}
      >
        <button
          className="absolute -right-3 top-20 bg-white dark:bg-black border border-gray-200  dark:border-gray-100 
                    rounded-full p-1 shadow-md hidden md:flex"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            size={16}
            className={`text-gray-800 dark:text-gray-200 ${collapsed ? "" : "rotate-180"}`}
          />
        </button>

        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-black">
          <div className="flex items-center">
            <Image className="w-6 h-6 mr-2 text-gray-800 dark:text-gray-200" />
            {!collapsed && (
              <h1 className="text-base font-medium text-gray-800 dark:text-gray-200">
                MediaHub
              </h1>
            )}
          </div>

          <ModeToggle />
        </div>

        <nav className="p-2">
  <ul className="space-y-1">
    {navItems.map((item, index) => (
      <li key={index}>
        <Link
          to={item.path} // ✅ Ensures the 'to' prop is present
          className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md 
                     hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <item.icon className="w-5 h-5 min-w-5" />
          {!collapsed && <span className="ml-3">{item.label}</span>}
        </Link>
      </li>
    ))}
  </ul>
</nav>


        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-black
                     bg-white dark:bg-black 
                     ${collapsed ? "items-center justify-center" : ""}`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div
                className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-700 text-white 
                            flex items-center justify-center text-sm font-medium"
              >
                {teamData.avatar}
              </div>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {teamData.name}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Storage</span>
                  <span className="ml-2">{teamData.storage}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                  <div className="bg-gray-800 dark:bg-gray-400 h-1 rounded-full w-1/4"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
