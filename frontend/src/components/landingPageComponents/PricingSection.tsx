
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Link } from "react-router"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for personal projects and small websites",
    features: [
      "5GB storage",
      "50,000 transformations/month",
      "Basic image optimization",
      "Standard CDN delivery",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Ideal for growing businesses and professional creators",
    features: [
      "50GB storage",
      "500,000 transformations/month",
      "Advanced image optimization",
      "Global CDN with custom domain",
      "Priority support",
      "Analytics dashboard",
      "Custom metadata",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with advanced needs",
    features: [
      "Unlimited storage",
      "Unlimited transformations",
      "Premium image optimization",
      "Dedicated CDN",
      "24/7 support",
      "Advanced analytics",
      "Custom workflows",
      "SLA guarantees",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    popular: false,
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

  return (
    <section id="pricing" ref={ref} className="relative py-24 sm:py-32">
      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute right-1/2 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#0EA5E9]/20 blur-[100px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.4 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-[#0EA5E9]/20 blur-[100px]"
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center rounded-full border border-[#0EA5E9] bg-[#0EA5E9]/10 px-3 py-1 text-sm text-sky-200 backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-sky-300" />
            Simple Pricing
          </div>

          <h2 className="mt-6 bg-gradient-to-br from-white via-[#E4E4E7] to-[#A1A1AA] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            Choose the Perfect Plan for Your Needs
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-[#E4E4E7]/80">
            Flexible pricing options designed to scale with your business. Start with our free tier and upgrade as you
            grow.
          </p>
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
              className={`group relative rounded-2xl border ${plan.popular ? "border-[#0EA5E9]" : "border-[#0EA5E9]/20"} ${plan.popular ? "bg-[#0EA5E9]/10" : "bg-[#0EA5E9]/5"} p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full border border-[#0EA5E9] bg-[#0EA5E9]/20 px-3 py-1 text-xs font-medium text-sky-200">
                  Most Popular
                </div>
              )}
              <div className="relative">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="ml-1 text-[#E4E4E7]/70">{plan.period}</span>}
                </div>
                <p className="mt-2 text-[#E4E4E7]/70">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 flex-shrink-0 text-sky-400" />
                      <span className="text-[#E4E4E7]/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Button
                    asChild
                    className={`w-full ${plan.popular ? "bg-[#0EA5E9] hover:bg-[#0EA5E9]/90" : "bg-[#0EA5E9]/20 hover:bg-[#0EA5E9]/30"} text-white`}
                  >
                    <Link to="#">{plan.cta}</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
