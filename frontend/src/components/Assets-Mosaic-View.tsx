"use client"

import { useState } from "react"
import { MoreHorizontal, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"

interface Asset {
  id: number
  name: string
  folder: string
  type: string
  format: string
  size: string
  dimensions: string
  thumbnail: string
  isPublic: boolean
}

interface AssetMosaicProps {
  assets: Asset[]
}

 const AssetMosaic = ({ assets }: AssetMosaicProps)=> {
  const [selectedAssets, setSelectedAssets] = useState<number[]>([])

  const toggleAsset = (id: number) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter((assetId) => assetId !== id))
    } else {
      setSelectedAssets([...selectedAssets, id])
    }
  }

  // Create a mosaic layout with varying sizes
  const getSpanClass = (index: number) => {
    // Create a pattern for the mosaic layout
    const pattern = index % 10

    if (pattern === 0) return "md:col-span-2 md:row-span-2" // Large
    if (pattern === 3 || pattern === 7) return "md:col-span-2" // Wide
    if (pattern === 5) return "md:row-span-2" // Tall

    return "" // Regular
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-min">
      {assets.map((asset, index) => (
        <motion.div
          key={asset.id}
          className={getSpanClass(index)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="group relative h-full overflow-hidden rounded-md border bg-background">
            <div className="relative aspect-square w-full overflow-hidden">
              <img
                src={asset.thumbnail || "/placeholder.svg"}
                alt={asset.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="absolute top-2 left-2">
                <Checkbox
                  checked={selectedAssets.includes(asset.id)}
                  onCheckedChange={() => toggleAsset(asset.id)}
                  aria-label={`Select ${asset.name}`}
                  className="h-5 w-5 border-white bg-black/20 data-[state=checked]:bg-primary"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs text-white/80">
                    {asset.format} • {asset.size}
                  </div>
                  <div className="flex items-center">
                    {asset.isPublic ? (
                      <Globe className="h-4 w-4 text-green-400" />
                    ) : (
                      <Lock className="h-4 w-4 text-amber-400" />
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default AssetMosaic