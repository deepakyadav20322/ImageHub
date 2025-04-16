
import { SetStateAction, useEffect, useState } from "react"
import { Sparkles, Code, Sliders, RefreshCw, Shapes } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const transformations = [
  {
    id: "original",
    name: "Original",
    url: "/Empty_State_Illustration_1.svg",
    code: "...upload/ad_portrait.jpg",
    description: "Original high-quality image without any transformations",
    shape: "rounded-lg",
  },
  {
    id: "auto",
    name: "Auto Optimize",
    url: "/Empty_State_Illustration_1.svg",
    code: "...upload/f_auto,q_auto/ad_portrait.jpg",
    description: "Automatically optimize format and quality for best performance",
    shape: "rounded-lg",
  },
  {
    id: "crop",
    name: "Face Detection Crop",
    url: "/Empty_State_Illustration_1.svg",
    code: "d/f_auto,q_auto,c_crop,g_face:auto,h_300,w_300,r_max,x_0,y_0/ac",
    description: "Intelligently crop to focus on faces with perfect circular shape",
    shape: "rounded-full",
  },
  {
    id: "filter",
    name: "Filter & Effects",
    url: "/Empty_State_Illustration_1.svg",
    code: "...upload/e_art:zorro,f_auto,q_auto/ad_portrait.jpg",
    description: "Apply artistic filters and effects to transform the image style",
    shape: "rounded-lg [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]",
  },
]

export default function TransformationSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-rotate through transformations
  useEffect(() => {
    if (!isInView) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % transformations.length)
        setIsTransitioning(false)
      }, 300) // Match this with the transition duration
    }, 2000)

    return () => clearInterval(interval)
  }, [isInView])

  const activeTransformation = transformations[activeIndex]

  // Handle manual navigation
  const handleTransformationClick = (index: SetStateAction<number>) => {
    if (index === activeIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIndex(index)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <section id="transformation" ref={ref} className="relative py-24 sm:py-32">
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
            Dynamic Transformations
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Transform Images On-The-Fly
          </h2>

          <p className="mt-4 max-w-2xl text-lg text-gray-800 dark:text-gray-300">
            Simply change URL parameters to instantly transform your images. No re-uploading or manual editing required.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">One Image, Endless Possibilities</h3>
            <p className="text-gray-800 dark:text-gray-300 mb-6">
              Our powerful transformation engine lets you resize, crop, filter, and optimize images instantly by simply
              changing URL parameters. Perfect for responsive designs, art direction, and performance optimization.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
              {transformations.map((transform, index) => (
                <button
                  key={transform.id}
                  onClick={() => handleTransformationClick(index)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-300",
                    activeIndex === index
                      ? "bg-[#155dfc] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {transform.id === "original" && <Code className="h-4 w-4" />}
                    {transform.id === "auto" && <RefreshCw className="h-4 w-4" />}
                    {transform.id === "crop" && <Sliders className="h-4 w-4" />}
                    {transform.id === "filter" && <Shapes className="h-4 w-4" />}
                  </div>
                  <span className="text-xs font-medium">{transform.name}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTransformation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 font-mono text-sm text-gray-800 dark:text-gray-300 overflow-x-auto">
                  {activeTransformation.code}
                </div>
                <p className="mt-3 text-gray-700 dark:text-gray-400">{activeTransformation.description}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8">
              <Button className="bg-[#155dfc] text-white hover:bg-[#0e4ad0]">Explore API Documentation</Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#155dfc]/20 to-[#155dfc]/10 rounded-3xl -m-4 blur-xl"></div>
              <div className="relative bg-gray-950 rounded-3xl p-6 shadow-xl">
                <div className="relative h-[350px] w-[350px] mx-auto flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                                          key={activeTransformation.id}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 1.1 }}
                                          transition={{ duration: 0.4 }}
                                          className={cn(
                                            "relative overflow-hidden w-full h-full max-w-[300px] max-h-[300px]",
                                            activeTransformation.shape,
                                          )}
                                        >
                                          <img
                                            src={activeTransformation.url || "/placeholder.svg"}
                                            alt="Image transformation example"
                                            className="object-cover w-full h-full"
                                          />
                                        </motion.div>
                  </AnimatePresence>
                </div>
                <div className="bg-gray-900 rounded-xl p-3 text-sm font-mono text-[#6b9fff] overflow-x-auto mt-4"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
