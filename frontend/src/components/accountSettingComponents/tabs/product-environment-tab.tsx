import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "../../../components/ui/textarea"

export function ProductEnvironmentTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Environment</CardTitle>
          <CardDescription>Configure your product environment settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted">
              <TabsTrigger value="general" className="data-[state=active]:bg-brand data-[state=active]:text-white">
                General
              </TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-brand data-[state=active]:text-white">
                API
              </TabsTrigger>
              <TabsTrigger value="deployment" className="data-[state=active]:bg-brand data-[state=active]:text-white">
                Deployment
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" placeholder="My Awesome Project" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Environment</Label>
                <Select defaultValue="production">
                  <SelectTrigger id="environment">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <RadioGroup defaultValue="system" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="light"
                      id="light"
                      className="text-brand border-brand data-[state=checked]:bg-brand data-[state=checked]:text-white"
                    />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="dark"
                      id="dark"
                      className="text-brand border-brand data-[state=checked]:bg-brand data-[state=checked]:text-white"
                    />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="system"
                      id="system"
                      className="text-brand border-brand data-[state=checked]:bg-brand data-[state=checked]:text-white"
                    />
                    <Label htmlFor="system">System</Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
            <TabsContent value="api" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    value="sk_live_51NZj0JKjd92jd92jd92jd92jd92j"
                    type="password"
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" className="border-brand text-brand hover:bg-brand hover:text-white">
                    Copy
                  </Button>
                  <Button variant="outline" className="border-brand text-brand hover:bg-brand hover:text-white">
                    Regenerate
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://example.com/webhook" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                <Input id="rate-limit" type="number" defaultValue="60" />
              </div>
            </TabsContent>
            <TabsContent value="deployment" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="region">Deployment Region</Label>
                <Select defaultValue="us-east-1">
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                    <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                    <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                    <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instance-type">Instance Type</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="instance-type">
                    <SelectValue placeholder="Select instance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <Input id="custom-domain" placeholder="app.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deployment-notes">Deployment Notes</Label>
                <Textarea
                  id="deployment-notes"
                  placeholder="Add any notes about this deployment"
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button className="bg-brand hover:bg-brand/90 text-white">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
