

import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-24 sm:py-32">
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
            Start Your Journey
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
          >
            Ready to Transform Your Media Management?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-gray-800 dark:text-gray-300"
          >
            Join thousands of businesses that have revolutionized their digital asset workflow with ImageHub. Start your
            free trial today and experience the future of media management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button
              asChild
              size="lg"
              className="gap-2 bg-[#155dfc] text-white transition-all duration-300 hover:bg-[#0e4ad0] hover:shadow-lg hover:shadow-[#155dfc]/20"
            >
              <Link to="/login">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 border-[#155dfc] bg-[#155dfc]/5 text-[#155dfc] backdrop-blur-sm transition-all duration-300 hover:border-[#155dfc]/50 hover:bg-[#155dfc]/10 hover:text-[#0e4ad0] hover:shadow-lg hover:shadow-[#155dfc]/10 dark:text-[#6b9fff] dark:hover:text-white"
            >
              <Link to="#">Schedule a Demo</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
