"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ProfileTab } from "./tabs/profile-tab"
import { AccountTab } from "./tabs/account-tab"
import { UserManagementTab } from "./tabs/user-management-tab"
import { ProductEnvironmentTab } from "./tabs/product-environment-tab"
import { Menu } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile")

  // Tab configuration
  const tabConfig = [
    { id: "profile", label: "My Profile" },
    { id: "account", label: "Account" },
    { id: "user-management", label: "User Management" },
    { id: "product-environment", label: "Product Environment" }
  ]

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        
        {/* Mobile Menu Toggle */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[280px]">
            <nav className="flex flex-col gap-2 mt-8">
              {tabConfig.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`justify-start ${activeTab === tab.id ? "bg-brand text-white" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Single Tabs component used for both mobile and desktop */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* TabsList only visible on desktop */}
        <div className="hidden md:block">
          <TabsList className="grid grid-cols-4 w-full mb-8 bg-muted">
            {tabConfig.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="data-[state=active]:bg-brand data-[state=active]:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* Tab content - shared between mobile and desktop */}
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="account">
          <AccountTab />
        </TabsContent>
        <TabsContent value="user-management">
          <UserManagementTab />
        </TabsContent>
        <TabsContent value="product-environment">
          <ProductEnvironmentTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}