"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal, Globe, Lock, ImageIcon, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Resource } from "@/lib/types"

interface AssetCardProps {
  assets: Resource[]
}

const AssetCard = ({ assets }: AssetCardProps) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const prevAssetsRef = useRef<Resource[]>([])
  
  // Track previous assets to optimize rendering
  useEffect(() => {
    prevAssetsRef.current = assets
  }, [assets])

  const toggleAsset = (id: string) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter((assetId) => assetId !== id))
    } else {
      setSelectedAssets([...selectedAssets, id])
    }
  }

  const toggleAllAssets = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(assets.map((asset) => asset.resourceId))
    } else {
      setSelectedAssets([])
    }
  }

  return (
<LayoutGroup>
  <div className="flex flex-wrap gap-x-4 gap-y-6 w-full">
    <AnimatePresence mode="popLayout" initial={false}>
      {assets.map((asset) => (
        <motion.div
          key={asset.resourceId}
          layout
          className="flex-shrink-0 min-w-[250px]  w-full sm:w-[50%] md:w-[34%] lg:w-[30%]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 300, damping: 25 },
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.15 },
          }}
          transition={{
            layout: { type: "spring", stiffness: 300, damping: 25 },
          }}
        >
          <Card className="group overflow-hidden flex flex-col">
            <div className="relative aspect-video bg-muted">
              <motion.img
                layoutId={`image-${asset.resourceId}`}
                src={asset.path || "/placeholder.svg?height=200&width=300"}
                alt={asset.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedAssets.includes(asset.resourceId)}
                  onCheckedChange={() => toggleAsset(asset.resourceId)}
                  aria-label={`Select ${asset.name}`}
                  className="bg-white/90 border-transparent transition-transform duration-200 hover:scale-110"
                />
              </div>
              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 hover:bg-white transition-transform duration-200 hover:scale-110"
                    >
                      <MoreHorizontal className="h-4 w-4" />
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
            <CardContent className="flex-grow">
              <motion.div className="flex items-center gap-2 mt-2" layoutId={`title-${asset.resourceId}`}>
                {asset.resourceTypeDetails ? (
                  <ImageIcon className="text-blue-500 h-4 w-4 flex-shrink-0" />
                ) : (
                  <FileText className="text-orange-500 h-4 w-4 flex-shrink-0" />
                )}
                <p className="text-sm font-medium truncate">{asset.name}</p>
              </motion.div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground">
              <div>{asset.metadata?.mimetype || "-"} • {asset.metadata?.size || "-"} bits</div>
              <div>
                {asset.visibility ? (
                  <Globe className="text-green-500 h-4 w-4" />
                ) : (
                  <Lock className="text-amber-500 h-4 w-4" />
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
</LayoutGroup>

  )
}

export default AssetCard

