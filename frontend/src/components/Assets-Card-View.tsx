"use client"

import { useState } from "react"
import { MoreHorizontal, Globe, Lock, ImageIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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

interface AssetCardProps {
  assets: Asset[]
}

 const AssetCard = ({ assets }: AssetCardProps)=> {
  const [selectedAssets, setSelectedAssets] = useState<number[]>([])

  const toggleAsset = (id: number) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter((assetId) => assetId !== id))
    } else {
      setSelectedAssets([...selectedAssets, id])
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {assets.map((asset, index) => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <Card className="group overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img
                src={asset.thumbnail || "/placeholder.svg"}
                alt={asset.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
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
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                {asset.type === "Image" ? (
                  <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 text-orange-500 shrink-0" />
                )}
                <p className="text-sm font-medium truncate">{asset.name}</p>
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0 flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {asset.format} • {asset.size}
              </div>
              <div className="flex items-center">
                {asset.isPublic ? (
                  <Globe className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-amber-500" />
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default AssetCard