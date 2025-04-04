
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function DiscoveryInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [filteredItems, setFilteredItems] = useState(featureItems)

  // Filter items based on search and category
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

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-slate-50 mt-13">
      {/* Header Section */}
      <div className="container mx-auto px-4 pt-16 pb-10 text-center">
        <motion.h1
          className="text-3xl md:text-4xl font-medium text-slate-800 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Let's Start Discovering
        </motion.h1>
        <motion.div
          className="max-w-xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Search Media Library"
              className="pl-10 pr-10 py-6 border-slate-200 rounded-full shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full hover:bg-slate-100"
                onClick={clearSearch}
              >
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <motion.div
        className="container mx-auto px-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-wrap gap-2 justify-center">
          <CategoryBadge
            name="all"
            label="All Tools"
            active={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
          />
          <CategoryBadge
            name="image"
            label="Image Editing"
            active={activeCategory === "image"}
            onClick={() => setActiveCategory("image")}
          />
          <CategoryBadge
            name="product"
            label="Product Tools"
            active={activeCategory === "product"}
            onClick={() => setActiveCategory("product")}
          />
          <CategoryBadge
            name="ai"
            label="AI Features"
            active={activeCategory === "ai"}
            onClick={() => setActiveCategory("ai")}
          />
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-16">
        <motion.h2
          className="text-lg font-normal text-slate-500 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          What do you want to do today?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <FeatureItem title={item.title} action={item.action} icon={item.icon} color={item.color} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              No results found. Try a different search term.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface CategoryBadgeProps {
  name: string
  label: string
  active: boolean
  onClick: () => void
}

function CategoryBadge({ name, label, active, onClick }: CategoryBadgeProps) {
  return (
    <Badge
      variant={active ? "default" : "outline"}
      className={`px-4 py-1.5 text-sm cursor-pointer transition-all ${
        active ? "bg-slate-800 hover:bg-slate-700" : "bg-transparent hover:bg-slate-100"
      }`}
      onClick={onClick}
    >
      {label}
    </Badge>
  )
}

interface FeatureItemProps {
  title: string
  action: string
  icon: string
  color: string
}

function FeatureItem({ title, action, icon, color }: FeatureItemProps) {
  return (
    <div className="group bg-white rounded-xl p-6 border border-slate-100 transition-all hover:shadow-md hover:border-slate-200 cursor-pointer">
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
