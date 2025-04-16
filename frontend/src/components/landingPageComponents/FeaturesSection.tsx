
import { ImageIcon, Sparkles, Zap, CloudCog, BarChart2, ShieldCheck, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const features = [
  {
    icon: CloudCog,
    title: "Cloud Storage",
    description: "Securely store unlimited media assets with automatic backups and version control",
    color: "text-[#155dfc]",
    gradient: "from-[#155dfc]/10 to-transparent",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: ImageIcon,
    title: "Image Transformation",
    description: "Resize, crop, filter, and optimize images on-the-fly with our powerful API",
    color: "text-[#155dfc]",
    gradient: "from-[#155dfc]/10 to-transparent",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Global CDN ensures lightning-fast delivery of your assets anywhere in the world",
    color: "text-[#155dfc]",
    gradient: "from-[#155dfc]/10 to-transparent",
    iconBg: "bg-sky-50 dark:bg-sky-950/30",
  },
  {
    icon: BarChart2,
    title: "Analytics",
    description: "Track usage, performance, and optimization metrics with detailed analytics",
    color: "text-[#155dfc]",
    gradient: "from-[#155dfc]/10 to-transparent",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    description: "Advanced security features including access control, watermarking, and encryption",
    color: "text-[#155dfc]",
    gradient: "from-[#155dfc]/10 to-transparent",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Layers,
    title: "Organization",
    description: "Powerful tagging, collections, and folder systems to keep your assets organized",
    color: "text-[#155dfc]",
    gradient: "from-[#155dfc]/10 to-transparent",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/30",
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

export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" ref={ref} className="relative py-24 sm:py-32">
      {/* Decorative elements */}
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
            Powerful Features
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Everything You Need for Media Management
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-gray-800 dark:text-gray-300">
            Discover how our comprehensive suite of tools can transform your media workflow and optimize your digital
            assets
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div
                className={cn(
                  "absolute right-0 top-0 h-32 w-32 rounded-full blur-[64px] transition-opacity duration-300 group-hover:opacity-70",
                  feature.gradient,
                )}
              />

              <div className="relative">
                <div className={cn("mb-4 inline-flex rounded-lg p-3", feature.iconBg, feature.color)}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
