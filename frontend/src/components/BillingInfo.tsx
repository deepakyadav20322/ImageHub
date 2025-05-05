import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Database,
  HardDrive,
  Package,
  ChevronRight,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router";
import { useGetCreditAndStorageQuery } from "@/redux/apiSlice/billingApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";
import { formatBytesToMbAndGb, getDaysLeft } from "@/lib/utils";

interface UsageCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  percentage: number;
  color: string;
}

const BillingInfo = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  const { data } = useGetCreditAndStorageQuery({
    access_token: token ?? "",
    accountId: user?.accountId ?? "",
  });

  console.log(data);
  useEffect(() => {
    let slideIndex = 0;
    const interval = setInterval(() => {
      slideIndex = (slideIndex + 1) % 2;
      setCurrentSlide(slideIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex min-h-screen flex-col dark:bg-black bg-slate-50 "
      >
        <header className="sticky top-0 z-10 border-b dark:bg-black bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-center w-full">MediaHub</h1>
            <Link
              to={"/dashboard/settings/product"}
              className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200 whitespace-nowrap "
            >
              Product setting
            </Link>
          </div>
        </header>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="flex-1 px-4 py-8 sm:px-6 lg:px-8 overflow-hidden "
        >
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Your Plan
              </h2>
              <p className="text-muted-foreground">
                Manage your subscription, credits, and storage.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 ">
              {/* Current Plan */}
              <Card className="md:col-span-2 py-0 border-2 border-slate-200 rounded">
                <CardHeader className="bg-slate-100 dark:bg-[#27272a] pb-4 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 pt-2">
                        <CardTitle className="text-xl">
                          {data?.planInfo.name} Plan
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="border-green-500 text-emerald-600 bg-emerald-100"
                        >
                          Current
                        </Badge>
                      </div>
                      <CardDescription>
                        {data?.planInfo.name?.toLowerCase() === "free" &&
                          `For personal projects and learning`}
                        {data?.planInfo.name?.toLowerCase() === "basic" &&
                          `Standard choice for startups`}
                        {data?.planInfo.name?.toLowerCase() === "business" &&
                          `Perfect for enterprise application`}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold  pt-1">$0</div>
                      <div className="text-sm text-muted-foreground">
                        for one month
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>{data?.planInfo.monthlyCredits} credits/month</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>
                        {data?.planInfo.maxStorageBytes
                          ? (
                              Number(data.planInfo.maxStorageBytes) /
                              (1024 * 1024)
                            ).toFixed(0)
                          : "Null"}
                        MB storage
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Community support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Global CDN </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Analytics dashboard</span>
                    </li>
                    <li className="flex items-center gap-2">
                    <X className="h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-600 -ml-1" />
                      
                      <span
                        className={"text-gray-500 dark:text-gray-500"} 
                      >
                       Custome domain
                      </span>
                      </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Upgrade Options Slider */}
              <div className="relative overflow-hidden rounded-lg border-2 border-slate-200">
                <div className="overflow-hidden">
                  <div
                    className={`flex transition-transform duration-700 ease-in-out`}
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {/* Basic plan*/}
                    <Card className="min-w-full border-0 shadow-none">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Upgrade to Basic
                        </CardTitle>
                        <CardDescription>For growing projects</CardDescription>
                        <div className="pt-2">
                          <div className="text-2xl font-bold">$10</div>
                          <div className="text-sm text-muted-foreground">
                            per month
                          </div>
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
                        <CardTitle className="text-lg">
                          Upgrade to Business
                        </CardTitle>
                        <CardDescription>
                          For organizations with advanced needs
                        </CardDescription>
                        <div className="9t-2">
                          <div className="text-2xl font-bold">$20</div>
                          <div className="text-sm text-muted-foreground">
                            per month
                          </div>
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
                  {[0, 1].map((index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-6 rounded-full ${
                        currentSlide === index ? "bg-slate-800" : "bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Usage Section */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="dark:bg-[#27272a]">
                <CardHeader className="pb-1 sm:pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Credits</span>
                      </div>
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`${
                        getDaysLeft(data?.ourCredits?.expiresAt) < 7
                          ? "bg-red-300 border border-red-600 text-red-800"
                          : "border-emerald-500"
                      } font-normal`}
                    >
                      Expairs in
                      <span> {getDaysLeft(data?.ourCredits?.expiresAt)}</span>
                      {""} days
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.ourCredits && data?.planInfo && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Used</div>
                          <div className="font-medium text-lg">
                            {data.ourCredits.usedCredits} /{" "}
                            {data.planInfo.monthlyCredits}
                          </div>
                        </div>

                        {/** Credit Percentage Calculation */}
                        {(() => {
                          const used = data.ourCredits.usedCredits;
                          const total = data.planInfo.monthlyCredits || 1;
                          const percentage = Math.min(
                            (used / total) * 100,
                            100
                          );

                          // Tailwind-safe color classes
                          const getColor = () => {
                            if (percentage < 50) return "bg-green-500";
                            if (percentage < 90) return "bg-yellow-500";
                            return "bg-red-500";
                          };

                          return (
                            <>
                              <motion.div className="h-2 w-full bg-muted rounded-full overflow-hidden  dark:bg-[#515154]">
                                <motion.div
                                  className={`h-full ${getColor()} transition-all`}
                                  style={{ width: "0%" }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1 }}
                                />
                              </motion.div>

                              <div className="flex justify-between text-xs text-muted-foreground">
                                <div>0%</div>
                                <div>50%</div>
                                <div>100%</div>
                              </div>
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-[#27272a]">
                <CardHeader className="pb-1 sm:pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4" />
                        <span>Storage</span>
                      </div>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      Manage Files
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-muted-foreground">Used</div>
                      <div className="font-medium text-lg">{formatBytesToMbAndGb(data?.storageData.usedStorageBytes)}/ {formatBytesToMbAndGb(data?.planInfo.maxStorageBytes, { forceGB: true,precision: 2 })}</div>
                    </div>
                    {/* <Progress value={42} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div>0GB</div>
                      <div>2.5GB</div>
                      <div>5GB</div> */}
                    {/* </div> */}
                     {/** Storage Percentage Calculation */}
      {(() => {
        const used = parseFloat(data?.storageData.usedStorageBytes || "0");
        const total = parseFloat(data?.planInfo.maxStorageBytes || "1");
        const percentage = Math.min((used / total) * 100, 100);

        // Tailwind-safe color classes
        const getColor = () => {
          if (percentage < 50) return "bg-green-500";
          if (percentage < 90) return "bg-yellow-500";
          return "bg-red-500";
        };

        return (
          <>
            <motion.div className="h-2 w-full bg-muted rounded-full overflow-hidden dark:bg-[#515154]">
              <motion.div
                className={`h-full ${getColor()} transition-all`}
                style={{ width: "0%" }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1 }}
              />
            </motion.div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <div>0%</div>
              <div>50%</div>
              <div>100%</div>
            </div>
          </>
        );
      })()}

                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 border dark:bg-[#27272a]">
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
        </motion.main>
      </motion.div>
    </div>
  );
};

export default BillingInfo;

function UsageCard({ icon, title, value, percentage, color }: UsageCardProps) {
  return (
    <div className="rounded-lg border p-4 dark:bg-black">
      <div className="flex items-center gap-3">
        <div className={`rounded-full p-2 ${color}`}>{icon}</div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-semibold">{value}</div>
            <div className="text-xs text-muted-foreground">
              {percentage}% of total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
