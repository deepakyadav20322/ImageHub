
import { useState } from "react"
import {
  Image,
  Mail,
  Radio,
  Users,
  BarChart2,
  Globe,
  FileText,
  Code,
  Link,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"

// User/team data
const teamData = {
  name: "MediaHub Team",
  avatar: "MH",
  storage: "284 KB",
}

// Navigation items
const navItems = [
  { icon: Image, label: "Assets", path: "/assets" },
  { icon: Mail, label: "Emails", path: "/emails" },
  { icon: Radio, label: "Broadcasts", path: "/broadcasts" },
  { icon: Users, label: "Audiences", path: "/audiences" },
  { icon: BarChart2, label: "Metrics", path: "/metrics" },
  { icon: Globe, label: "Domains", path: "/domains" },
  { icon: FileText, label: "Logs", path: "/logs" },
  { icon: Code, label: "API Keys", path: "/api-keys" },
  { icon: Link, label: "Webhooks", path: "/webhooks" },
  { icon: Settings, label: "Settings", path: "/settings" },
]

interface ISidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void; 
  }
  

const Sidebar = ({collapsed,setCollapsed}:ISidebarProps) => {
//   const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      {/* Mobile menu button - only visible on small screens */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md md:hidden"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar overlay for mobile - only visible when sidebar is open on mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileSidebar} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          ${collapsed ? "w-16" : "w-64"} 
          md:translate-x-0
        `}
      >
        {/* Toggle button - only visible on desktop */}
        <button
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-md hidden md:flex"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight size={16} className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Image className="w-6 h-6 mr-2" />
            {!collapsed && <h1 className="text-base font-medium text-gray-800">MediaHub</h1>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className="flex items-center p-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-black transition-colors"
                >
                  <item.icon className="w-5 h-5 min-w-5" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer with user info */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white ${collapsed ? "items-center justify-center" : ""}`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium">
                {teamData.avatar}
              </div>
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{teamData.name}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>Storage</span>
                  <span className="ml-2">{teamData.storage}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div className="bg-gray-800 h-1 rounded-full w-1/4"></div>
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

