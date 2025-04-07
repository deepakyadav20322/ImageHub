import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function DiscoveryInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredItems, setFilteredItems] = useState(featureItems)

  useEffect(() => {
    let results = featureItems

    if (searchTerm) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.action.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (activeCategory !== "all") {
      results = results.filter((item) => item.category === activeCategory)
    }

    setFilteredItems(results)
  }, [searchTerm, activeCategory])

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-50 pt-30 overflow-hidden"
      initial="hidden"
      animate="show"
      variants={staggerContainer}
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-medium text-slate-800 mb-8">
          Let's Start Discovering
        </h1>
        <motion.div className="max-w-xl mx-auto relative" variants={fadeInUp}>
          <div className="relative group">
            <Input
              type="text"
              placeholder="Search Media Library"
              className="pl-10 pr-10 py-6 border-slate-200 rounded-full shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-0 focus:scale-[1.01]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 transition-colors duration-200 group-focus-within:text-slate-600" />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full hover:bg-slate-100 hover:rotate-90 transition-all duration-200"
                onClick={clearSearch}
              >
                <X className="h-4 w-4 text-slate-400 hover:text-red-500" />
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Categories */}
      <motion.div
        className="container mx-auto px-4 mt-10"
        variants={fadeInUp}
      >
        <div className="flex flex-wrap gap-2 justify-center">
          {["all", "image", "product", "ai"].map((cat) => (
            <CategoryBadge
              key={cat}
              name={cat}
              label={categoryLabels[cat]}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>
      </motion.div>

      {/* Prompt */}
      <motion.div
        className="container mx-auto px-4 mt-10"
        variants={fadeInUp}
      >
        <h2 className="text-lg font-normal text-slate-500 text-center mb-8">
          What do you want to do today?
        </h2>
      </motion.div>

      {/* Items Grid */}
      <motion.div
        className="container mx-auto px-4 pb-16"
        variants={fadeInUp}
      >
     <motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  layout
  variants={staggerChildren}
>
  <AnimatePresence mode="popLayout">
    {filteredItems.length > 0 ? (
      filteredItems.map((item) => (
        <motion.div
          key={item.title}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <FeatureItem {...item} />
        </motion.div>
      ))
    ) : (
      <motion.div
        key="no-results"
        className="col-span-full text-center py-12 text-slate-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        No results found. Try a different search term.
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>

      </motion.div>
    </motion.div>
  )
}

const categoryLabels: Record<string, string> = {
  all: "All Tools",
  image: "Image Editing",
  product: "Product Tools",
  ai: "AI Features",
}

function CategoryBadge({ name, label, active, onClick }: CategoryBadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Badge
        variant={active ? "default" : "outline"}
        className={`px-4 py-1.5 text-sm cursor-pointer transition-all ${
          active ? "bg-slate-800 hover:bg-slate-700 shadow-md" : "bg-transparent hover:bg-slate-100"
        }`}
        onClick={onClick}
      >
        {label}
      </Badge>
    </motion.div>
  )
}

function FeatureItem({ title, action, icon, color }: FeatureItemProps) {
  return (
    <div className="group bg-white rounded-xl p-6 border border-slate-100 transition-all hover:shadow-lg hover:ring-1 hover:ring-slate-200 hover:border-slate-200 cursor-pointer">
      <div className="flex items-start gap-4">
        <div
          className={`${color} h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
        >
          <span className="text-white font-medium">{icon}</span>
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-slate-800 group-hover:text-slate-900">{title}</h3>
          <p className="text-slate-500 text-sm group-hover:text-slate-600">{action}</p>
        </div>
      </div>
    </div>
  )
}

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const staggerChildren = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Types
interface CategoryBadgeProps {
  name: string
  label: string
  active: boolean
  onClick: () => void
}

interface FeatureItemProps {
  title: string
  action: string
  icon: string
  color: string
}

// Data
const featureItems = [
  {
    title: "Adapt your images to different devices",
    action: "Resize & Crop",
    icon: "RC",
    color: "bg-indigo-500",
    category: "image",
  },
  {
    title: "Prepare your products for publishing",
    action: "Background replace",
    icon: "BR",
    color: "bg-sky-500",
    category: "product",
  },
  {
    title: "Brand your images",
    action: "Image Overlay",
    icon: "IO",
    color: "bg-amber-500",
    category: "image",
  },
  {
    title: "Remove irrelevant items in the image",
    action: "Generative AI",
    icon: "AI",
    color: "bg-violet-500",
    category: "ai",
  },
  {
    title: "Make your assets pixel perfect",
    action: "Optimize",
    icon: "OP",
    color: "bg-emerald-500",
    category: "image",
  },
  {
    title: "Show your products in different colors",
    action: "Color Variations",
    icon: "CV",
    color: "bg-rose-500",
    category: "product",
  },
]
