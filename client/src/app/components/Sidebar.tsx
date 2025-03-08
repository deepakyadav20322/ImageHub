"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, ChevronUp, Code2, FileText, Globe, HardDrive, Image, LogOut, Mail, Megaphone, PanelLeft, Settings, User2, Users, Webhook } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const navigationItems = [
  {
    title: "Assets",
    icon: Image,
    href: "/assets",
  },
  {
    title: "Emails",
    icon: Mail,
    href: "/emails",
  },
  {
    title: "Broadcasts",
    icon: Megaphone,
    href: "/broadcasts",
  },
  {
    title: "Audiences",
    icon: Users,
    href: "/audiences",
  },
  {
    title: "Metrics",
    icon: BarChart2,
    href: "/metrics",
  },
  {
    title: "Domains",
    icon: Globe,
    href: "/domains",
  },
  {
    title: "Logs",
    icon: FileText,
    href: "/logs",
  },
  {
    title: "API Keys",
    icon: Code2,
    href: "/api-keys",
  },
  {
    title: "Webhooks",
    icon: Webhook,
    href: "/webhooks",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

const AppSidebar = ()=> {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold truncate">
            <Image className="h-5 w-5 flex-shrink-0" />
            <span className="text-xl">MediaHub</span>
          </Link>
          <SidebarTrigger className="ml-auto flex-shrink-0">
            <PanelLeft className="h-4 w-4" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-6 px-1">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href} className="py-1">
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title} className="px-4 py-1">
                <Link href={item.href} className="truncate">
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      {/* <SidebarFooter className="border-t p-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent transition-colors">
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">MH</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1 min-w-0">
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium truncate">MediaHub Team</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                  <HardDrive className="h-3 w-3" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span>Storage</span>
                      <span className="font-medium">284 KB</span>
                    </div>
                    <Progress value={33} className="h-1" />
                  </div>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">MediaHub Team</p>
              <p className="text-xs text-muted-foreground">team@mediahub.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Team members</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HardDrive className="mr-2 h-4 w-4" />
              <span>Storage settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 dark:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter> */}
<SidebarFooter>
<SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar

/*
 <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
*/