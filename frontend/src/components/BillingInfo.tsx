
import React, { useEffect } from "react"
import { CreditCard, Database, HardDrive, Package, ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Link } from "react-router"
import { useGetCreditAndStorageQuery } from "@/redux/apiSlice/billingApi"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

interface UsageCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  percentage: number;
  color: string;
}

const token = useSelector((state:RootState)=>state.auth.token) 
const user = useSelector((state:RootState)=>state.auth.user) 

const { data } = useGetCreditAndStorageQuery({access_token:token ??'',accountId:user?.accountId??''});

const BillingInfo = ()=> {
  const [currentSlide, setCurrentSlide] = React.useState(0)

  useEffect(() => {
    const sliderElement = document.querySelector(".js-plan-slider")
    const slideElements = sliderElement?.querySelector(".flex") as HTMLElement | null
    const indicators = document.querySelectorAll(".js-indicator")
    let slideIndex = 0
    const interval = setInterval(() => {
        if (!slideElements) return
  
        slideIndex = (slideIndex + 1) % 2
        setCurrentSlide(slideIndex)
  
        slideElements.style.transform = `translateX(-${slideIndex * 100}%)`
  
        // Update indicators
        indicators.forEach((indicator, index) => {
          if (index === slideIndex) {
            indicator.classList.add("bg-slate-800")
            indicator.classList.remove("bg-slate-300")
          } else {
            indicator.classList.add("bg-slate-300")
            indicator.classList.remove("bg-slate-800")
          }
        })
      }, 5000)

    return () => clearInterval(interval)
  }, [])



  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">MediaHub</h1>
          <Link to={'dashboard/settings/product'} className="bg-black text-white dark:text-black dark:bg-gray-100 rounded hover:bg-slate-200 px-2 py-1">
            Product setting
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Your Plan</h2>
            <p className="text-muted-foreground">Manage your subscription, credits, and storage.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Current Plan */}
            <Card className="md:col-span-2">
              <CardHeader className="bg-slate-100 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">Free Plan</CardTitle>
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Current
                      </Badge>
                    </div>
                    <CardDescription>For personal projects and learning</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">$0</div>
                    <div className="text-sm text-muted-foreground">forever</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="grid gap-3">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>100 credits/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>500MB storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Community support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Upgrade Options Slider */}
            <div className="relative overflow-hidden rounded-lg border-2 border-slate-200">
              <div className="js-plan-slider overflow-hidden">
                <div className="flex transition-transform duration-500">
                  {/* Basic Plan */}
                  <Card className="min-w-full border-0 shadow-none">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Upgrade to Basic</CardTitle>
                      <CardDescription>For growing projects</CardDescription>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">$19</div>
                        <div className="text-sm text-muted-foreground">per month</div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <ul className="grid gap-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span>50,000 credits/month</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span>20GB storage</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span>Email support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Upgrade Now
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Business Plan */}
                  <Card className="min-w-full border-0 shadow-none">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg">Upgrade to Business</CardTitle>
                      <CardDescription>For organizations with advanced needs</CardDescription>
                      <div className="mt-2">
                        <div className="text-2xl font-bold">$99</div>
                        <div className="text-sm text-muted-foreground">per month</div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <ul className="grid gap-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span>500,000 credits/month</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span>100GB storage</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span>Priority support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        Upgrade Now
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>

              {/* Slider indicators */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                <div
                  className={`h-1.5 w-6 rounded-full js-indicator js-indicator-0 ${currentSlide === 0 ? "bg-slate-800" : "bg-slate-300"}`}
                ></div>
                <div
                  className={`h-1.5 w-6 rounded-full js-indicator js-indicator-1 ${currentSlide === 1 ? "bg-slate-800" : "bg-slate-300"}`}
                ></div>
              </div>
            </div>
          </div>

          {/* Usage Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Credits</span>
                    </div>
                  </CardTitle>
                  <Badge variant="outline" className="font-normal">
                    Resets in 14 days
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">Used</div>
                    <div className="font-medium">2,500 / 5,000</div>
                  </div>
                  <Progress value={50} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>0%</div>
                    <div>50%</div>
                    <div>100%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      <span>Storage</span>
                    </div>
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    Manage Files
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">Used</div>
                    <div className="font-medium">2.1GB / 5GB</div>
                  </div>
                  <Progress value={42} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>0GB</div>
                    <div>2.5GB</div>
                    <div>5GB</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>Usage Breakdown</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <UsageCard
                      icon={<Package className="h-4 w-4 text-purple-500" />}
                      title="API Requests"
                      value="1,245"
                      percentage={42}
                      color="bg-purple-100"
                    />
                    <UsageCard
                      icon={<HardDrive className="h-4 w-4 text-blue-500" />}
                      title="File Storage"
                      value="1.8GB"
                      percentage={36}
                      color="bg-blue-100"
                    />
                    <UsageCard
                      icon={<Database className="h-4 w-4 text-emerald-500" />}
                      title="Database"
                      value="0.3GB"
                      percentage={6}
                      color="bg-emerald-100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BillingInfo

function UsageCard({ icon, title, value, percentage, color }: UsageCardProps) {
    return (
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${color}`}>{icon}</div>
          <div>
            <div className="text-sm font-medium">{title}</div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-semibold">{value}</div>
              <div className="text-xs text-muted-foreground">{percentage}% of total</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  