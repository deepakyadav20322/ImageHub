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

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[280px]">
            <nav className="flex flex-col gap-2 mt-8">
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className={`justify-start ${activeTab === "profile" ? "bg-brand text-white" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                My Profile
              </Button>
              <Button
                variant={activeTab === "account" ? "default" : "ghost"}
                className={`justify-start ${activeTab === "account" ? "bg-brand text-white" : ""}`}
                onClick={() => setActiveTab("account")}
              >
                Account
              </Button>
              <Button
                variant={activeTab === "user-management" ? "default" : "ghost"}
                className={`justify-start ${activeTab === "user-management" ? "bg-brand text-white" : ""}`}
                onClick={() => setActiveTab("user-management")}
              >
                User Management
              </Button>
              <Button
                variant={activeTab === "product-environment" ? "default" : "ghost"}
                className={`justify-start ${activeTab === "product-environment" ? "bg-brand text-white" : ""}`}
                onClick={() => setActiveTab("product-environment")}
              >
                Product Environment
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:block">
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-8 bg-muted">
            <TabsTrigger value="profile" className="data-[state=active]:bg-brand data-[state=active]:text-white">
              My Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-brand data-[state=active]:text-white">
              Account
            </TabsTrigger>
            <TabsTrigger
              value="user-management"
              className="data-[state=active]:bg-brand data-[state=active]:text-white"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="product-environment"
              className="data-[state=active]:bg-brand data-[state=active]:text-white"
            >
              Product Environment
            </TabsTrigger>
          </TabsList>
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

      <div className="md:hidden">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "account" && <AccountTab />}
        {activeTab === "user-management" && <UserManagementTab />}
        {activeTab === "product-environment" && <ProductEnvironmentTab />}
      </div>
    </div>
  )
}
