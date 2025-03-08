import type React from "react"
import { Inter } from 'next/font/google'
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "../components/Sidebar"


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Media Assets Management",
  description: "A media assets management application similar to Cloudinary",
}

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </SidebarProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

