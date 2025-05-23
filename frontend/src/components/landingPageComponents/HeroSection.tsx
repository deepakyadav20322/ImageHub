
// import { Button } from "@/components/ui/button"
// import { ArrowRight, ImageIcon, Sparkles } from "lucide-react"
// import { motion } from "framer-motion"
// import { Link } from "react-router"

// export default function HeroSection() {
//   return (
//     <header className="relative">
//       {/* Simplified decorative elements for better performance */}
//       <div className="absolute right-1/2 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#155dfc]/20 blur-[100px] opacity-50" />
//       <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-[#155dfc]/20 blur-[100px] opacity-40" />
//       <div className="absolute left-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[#155dfc]/20 blur-[100px] opacity-30" />

//       <div className="container relative mx-auto px-4 py-24 sm:py-32 lg:py-40">
//         <div className="flex flex-col items-center text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="inline-flex items-center rounded-full border border-[#155dfc] bg-[#155dfc]/10 px-3 py-1 text-sm text-[#155dfc] dark:text-[#6b9fff] backdrop-blur-sm"
//           >
//             <Sparkles className="mr-2 h-3.5 w-3.5 text-[#155dfc] dark:text-[#6b9fff]" />
//             Media Asset Management Simplified
//           </motion.div>

//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
//           >
//             Store, Transform, and Optimize Your Media Assets
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="mt-6 max-w-2xl text-lg text-gray-800 dark:text-gray-300"
//           >
//             ImageHub provides a complete solution for managing your digital media assets. Upload, store, transform, and
//             deliver optimized images and videos with our powerful cloud platform.
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="mt-10 flex flex-col gap-4 sm:flex-row"
//           >
//             <Button
//               asChild
//               size="lg"
//               className="gap-2 bg-[#155dfc] text-white transition-all duration-300 hover:bg-[#0e4ad0] hover:shadow-lg hover:shadow-[#155dfc]/20"
//             >
//               <Link to="/login">
//                 Get Started Free <ArrowRight className="h-4 w-4" />
//               </Link>
//             </Button>
//             <Button
//               asChild
//               size="lg"
//               variant="outline"
//               className="gap-2 border-[#155dfc] bg-[#155dfc]/5 text-[#155dfc] backdrop-blur-sm transition-all duration-300 hover:border-[#155dfc]/50 hover:bg-[#155dfc]/10 hover:text-[#0e4ad0] hover:shadow-lg hover:shadow-[#155dfc]/10 dark:text-[#6b9fff] dark:hover:text-white"
//             >
//               <Link to="edit-vizulization">
//                 <ImageIcon className="h-4 w-4" /> See How It Works
//               </Link>
//             </Button>
//           </motion.div>
//         </div>
//       </div>
//     </header>
//   )
// }


import { Button } from "@/components/ui/button"
import { ArrowRight, ImageIcon, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Link } from "react-router"


export default function HeroSection() {
  // Text that will be animated with blur effect
  const blurredText = "Powerful. Flexible. Scalable."
  // Main heading split into words for animation
  const mainHeadingWords = ["Store,", "Transform,", "and", "Optimize", "Your", "Media", "Assets"]

  return (
    <header className="relative">
      {/* Decorative elements */}
      <div className="absolute right-1/2 top-1/2 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#155dfc]/20 blur-[100px] opacity-50" />
      <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-[#155dfc]/20 blur-[100px] opacity-40" />
      <div className="absolute left-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[#155dfc]/20 blur-[100px] opacity-30" />

      <div className="container relative mx-auto px-4 py-20 sm:py-20 lg:py-28">
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

          {/* Main heading with blur effect */}
          <motion.h1
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl flex flex-wrap justify-center gap-x-3 gap-y-1"
          >
            {mainHeadingWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{
                  opacity: 0,
                  filter: "blur(15px)",
                  y: 10,
                }}
                whileInView={{
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + index * 0.08,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Tagline with blur effect */}
          <motion.div
            className="mt-6 overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="flex justify-center space-x-3 sm:space-x-4 text-xl sm:text-2xl font-medium text-[#155dfc] dark:text-[#6b9fff]">
              {blurredText.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    opacity: 0,
                    filter: "blur(8px)",
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.8 + index * 0.15,
                    ease: "easeOut",
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-6 max-w-2xl text-lg text-gray-800 dark:text-gray-300"
          >
            ImageHub provides a complete solution for managing your digital media assets. Upload, store, transform, and
            deliver optimized images and videos with our powerful cloud platform.
          </motion.p>

          {/* Staged children animation for features */}
          {/* <motion.div
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 1.5 }}
          >
            {[
              { title: "Cloud Storage", description: "Secure & scalable storage" },
              { title: "Image Processing", description: "Real-time transformations" },
              { title: "Fast Delivery", description: "Global CDN distribution" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-[#155dfc]/20 shadow-lg shadow-[#155dfc]/5 hover:shadow-[#155dfc]/10 transition-all duration-300 hover:border-[#155dfc]/30"
                initial={{
                  opacity: 0,
                  y: 30,
                  filter: "blur(10px)",
                  scale: 0.95,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 1.6 + index * 0.15,
                  ease: "easeOut",
                }}
              >
                <h3 className="font-semibold text-[#155dfc] dark:text-[#6b9fff] text-lg">{feature.title}</h3>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1.9 }}
            className="mt-12 flex flex-col gap-4 sm:flex-row"
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
              <Link to="edit-vizulization">
                <ImageIcon className="h-4 w-4" /> See How It Works
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
