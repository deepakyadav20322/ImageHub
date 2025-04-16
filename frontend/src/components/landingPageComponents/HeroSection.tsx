
import { Button } from "@/components/ui/button"
import { ArrowRight, ImageIcon, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router"

export default function HeroSection() {
  return (
    <header className="relative">
      {/* Simplified decorative elements for better performance */}
      <div className="absolute right-1/2 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#155dfc]/20 blur-[100px] opacity-50" />
      <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-[#155dfc]/20 blur-[100px] opacity-40" />
      <div className="absolute left-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[#155dfc]/20 blur-[100px] opacity-30" />

      <div className="container relative mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-[#155dfc] bg-[#155dfc]/10 px-3 py-1 text-sm text-[#155dfc] dark:text-[#6b9fff] backdrop-blur-sm"
          >
            <Sparkles className="mr-2 h-3.5 w-3.5 text-[#155dfc] dark:text-[#6b9fff]" />
            Media Asset Management Simplified
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Store, Transform, and Optimize Your Media Assets
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-gray-800 dark:text-gray-300"
          >
            ImageHub provides a complete solution for managing your digital media assets. Upload, store, transform, and
            deliver optimized images and videos with our powerful cloud platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="gap-2 bg-[#155dfc] text-white transition-all duration-300 hover:bg-[#0e4ad0] hover:shadow-lg hover:shadow-[#155dfc]/20"
            >
              <Link to="#pricing">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 border-[#155dfc] bg-[#155dfc]/5 text-[#155dfc] backdrop-blur-sm transition-all duration-300 hover:border-[#155dfc]/50 hover:bg-[#155dfc]/10 hover:text-[#0e4ad0] hover:shadow-lg hover:shadow-[#155dfc]/10 dark:text-[#6b9fff] dark:hover:text-white"
            >
              <Link to="#features">
                <ImageIcon className="h-4 w-4" /> See How It Works
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
