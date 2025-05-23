
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import ApiKeyManagement from "@/components/ApiKey-management"
import { Link } from "react-router"

const ProductEnvironmentSetting = () => {
  return (
    <div>
 <div>
      <nav className="w-full border-b">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">Product Settings</h2>
          <div className="space-x-4">
            <button className="px-4 py-2 border-blue-500 border-2 bg-gray-100 dark:bg-zinc-800 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer">API Management</button>
            <Link to={'/dashboard/settings/product/billing'} className="px-4 py-2 bg-gray-100  border-blue-500 border-2 dark:bg-zinc-800 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700">Bill Payment</Link>
           
          </div>
        </div>
      </nav>

<Tabs defaultValue="account" className="sm:w-full w-[90%] p-2 mx-auto">
      <TabsList className="grid w-full grid-cols-2 relative gap-x-1">
        <TabsTrigger value="account"  className="px-2 rounded-md transition-all dark:data-[state=active]:bg-zinc-600/70 dark:data-[state=active]:text-white cursor-pointer">API Management</TabsTrigger>
        <TabsTrigger value="password"  className="px-2 rounded-md transition-all dark:data-[state=active]:bg-zinc-600/70 dark:data-[state=active]:text-white cursor-pointer">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="w-full overflow-auto">
      <ApiKeyManagement cloudName="your-bucket-name"/>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
             Dummy section. work on progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </div>

    </div>
  )
}

export default ProductEnvironmentSetting


