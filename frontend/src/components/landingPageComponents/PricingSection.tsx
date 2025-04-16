
import { Button } from "@/components/ui/button"
import { Check, Sparkles, X } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import {Link} from "react-router"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal projects and small websites",
    features: [
      { name: "5GB storage", included: true },
      { name: "50,000 transformations/month", included: true },
      { name: "Basic image optimization", included: true },
      { name: "Standard CDN delivery", included: true },
      { name: "Email support", included: true },
      { name: "Analytics dashboard", included: false },
      { name: "Custom metadata", included: false },
      { name: "Custom domain", included: false },
    ],
    cta: "Get Started",
    popular: false,
    color: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Ideal for growing businesses and professional creators",
    features: [
      { name: "50GB storage", included: true },
      { name: "500,000 transformations/month", included: true },
      { name: "Advanced image optimization", included: true },
      { name: "Global CDN with custom domain", included: true },
      { name: "Priority support", included: true },
      { name: "Analytics dashboard", included: true },
      { name: "Custom metadata", included: true },
      { name: "Custom domain", included: true },
    ],
    cta: "Start Free Trial",
    popular: true,
    color: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    borderColor: "border-[#155dfc]/20",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with advanced needs",
    features: [
      { name: "Unlimited storage", included: true },
      { name: "Unlimited transformations", included: true },
      { name: "Premium image optimization", included: true },
      { name: "Dedicated CDN", included: true },
      { name: "24/7 support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom workflows", included: true },
      { name: "SLA guarantees", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
    color: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function PricingSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [billingPeriod, setBillingPeriod] = useState("monthly")

  return (
    <section id="pricing" ref={ref} className="relative py-24 sm:py-32">
      {/*  Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute right-1/2 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#155dfc]/20 blur-[100px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.4 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-[#155dfc]/20 blur-[100px]"
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center rounded-full border border-[#155dfc] bg-[#155dfc]/10 px-3 py-1 text-sm text-[#155dfc] dark:text-[#6b9fff] backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-[#155dfc] dark:text-[#6b9fff]" />
            Simple Pricing
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Choose the Perfect Plan for Your Needs
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-gray-800 dark:text-gray-300">
            Flexible pricing options designed to scale with your business. Start with our free tier and upgrade as you
            grow.
          </p>

          <div className="mt-8 inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-1 backdrop-blur-sm">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                billingPeriod === "monthly"
                  ? "bg-[#155dfc] text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                billingPeriod === "yearly"
                  ? "bg-[#155dfc] text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              Yearly <span className="text-xs text-[#155dfc] dark:text-[#6b9fff]">Save 20%</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={cn(
                "group relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md",
                plan.borderColor,
                plan.color,
                plan.popular && "ring-2 ring-[#155dfc]/30 dark:ring-[#155dfc]/50",
              )}
            >
              {plan.popular && (
                <div className="absolute -right-12 top-7 w-36 rotate-45 bg-[#155dfc] py-1 text-center text-xs font-medium text-white shadow-sm">
                  Most Popular
                </div>
              )}
              <div className="relative p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && <span className="ml-1 text-gray-700 dark:text-gray-400">{plan.period}</span>}
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-400">{plan.description}</p>

                <div className="mt-8">
                  <Button
                    asChild
                    className={cn(
                      "w-full",
                      plan.popular
                        ? "bg-[#155dfc] hover:bg-[#0e4ad0] text-white"
                        : "bg-white dark:bg-gray-800 text-[#155dfc] dark:text-[#6b9fff] border border-[#155dfc]/30 hover:bg-[#155dfc]/5 dark:hover:bg-[#155dfc]/10",
                    )}
                  >
                    <Link to="#">{plan.cta}</Link>
                  </Button>
                </div>

                <ul className="mt-8 space-y-4 text-sm">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <Check className="mr-3 h-5 w-5 flex-shrink-0 text-[#155dfc]" />
                      ) : (
                        <X className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-600" />
                      )}
                      <span
                        className={
                          feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-500 dark:text-gray-500"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
