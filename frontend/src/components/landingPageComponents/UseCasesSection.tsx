
import { Sparkles, Store, Newspaper, Camera, PenTool } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const useCases = [
  {
    icon: Store,
    title: "E-commerce",
    description:
      "Optimize product images, create dynamic galleries, and deliver responsive images for any device to boost conversion rates.",
    color: "text-[#38BDF8]",
    gradient: "from-[#0EA5E9]/20 to-transparent",
  },
  {
    icon: Newspaper,
    title: "Media & Publishing",
    description:
      "Manage large media libraries, automate image processing, and ensure fast delivery of content to your audience.",
    color: "text-[#7DD3FC]",
    gradient: "from-[#0EA5E9]/20 to-transparent",
  },
  {
    icon: Camera,
    title: "Photography",
    description:
      "Store high-resolution images, create portfolios, and share your work with clients through secure galleries.",
    color: "text-[#38BDF8]",
    gradient: "from-[#0EA5E9]/20 to-transparent",
  },
  {
    icon: PenTool,
    title: "Design & Creative",
    description:
      "Collaborate on design assets, maintain version control, and access your creative files from anywhere.",
    color: "text-[#7DD3FC]",
    gradient: "from-[#0EA5E9]/20 to-transparent",
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

export default function UseCasesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="use-cases" ref={ref} className="relative py-24 sm:py-32">
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
            Industry Solutions
          </div>

          <h2 className="mt-6 bg-gradient-to-br from-white via-[#E4E4E7] to-[#A1A1AA] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
            Perfect for Every Industry
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-[#E4E4E7]/80">
            See how ImageHub can be tailored to meet the specific needs of your industry
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-8 sm:grid-cols-2"
        >
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative rounded-2xl border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#0EA5E9]/30 hover:bg-[#0EA5E9]/10"
            >
              <div
                className={cn(
                  "absolute right-0 top-0 h-48 w-48 rounded-full blur-[64px] transition-opacity duration-300 group-hover:opacity-70",
                  useCase.gradient,
                )}
              />

              <div className="relative">
                <div className={cn("mb-4 inline-flex rounded-xl bg-[#0EA5E9]/20 p-3", useCase.color)}>
                  <useCase.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{useCase.title}</h3>
                <p className="text-[#E4E4E7]/70">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
