import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  MoreHorizontal,
  Globe,
  Lock,
  Download,
  Trash2,
  Edit,
  Eye,
  X,
  Check,
  ChevronDown,
  Search,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"


export interface Resource {
  resourceId: string
  accountId: string
  parentResourceId?: string
  type: string
  name: string
  displayName?: string
  path: string
  visibility: string
  inheritPermissions: boolean
  overridePermissions?: boolean
  metadata?: Record<string, any>
  resourceTypeDetails?: Record<string, any>
  versionId?: string
  expiresAt?: string
  status: string
  isSelected?: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string
  // Missing properties that are used in the component
  id: string // Added to align with component usage
  format?: string
  isPublic?: boolean
  thumbnail?: string
  size?: string
  dimensions?: string
}

interface AssetMosaicProps {
  assets: Resource[]
  onSelectionChange?: (selectedIds: string[]) => void
}

const AssetMosaic = ({ assets }: AssetMosaicProps) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Toggle selection mode when assets are selected
  useEffect(() => {
    setIsSelectionMode(selectedAssets.length > 0)
  }, [selectedAssets])

  const toggleAsset = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()

    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter((assetId) => assetId !== id))
    } else {
      setSelectedAssets([...selectedAssets, id])
    }
  }

  const selectAll = () => {
    setSelectedAssets(assets.map((asset) => asset.id))
  }

  const deselectAll = () => {
    setSelectedAssets([])
  }

  // Filter assets based on search query
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      asset.format?.toLowerCase()?.includes(searchQuery.toLowerCase())
  )

  // Get file type color and icon
  const getFormatInfo = (format?: string) => {
    const formatLower = format?.toLowerCase() || ""

    if (
      formatLower?.includes("jpg") ||
      formatLower?.includes("jpeg") ||
      formatLower?.includes("png") ||
      formatLower?.includes("gif")
    )
      return { color: "bg-emerald-500", textColor: "text-emerald-50" }
    if (formatLower?.includes("pdf")) return { color: "bg-red-500", textColor: "text-red-50" }
    if (formatLower?.includes("doc") || formatLower?.includes("docx"))
      return { color: "bg-blue-500", textColor: "text-blue-50" }
    if (formatLower?.includes("xls") || formatLower?.includes("xlsx"))
      return { color: "bg-green-500", textColor: "text-green-50" }
    if (formatLower?.includes("mp4") || formatLower?.includes("mov") || formatLower?.includes("avi"))
      return { color: "bg-purple-500", textColor: "text-purple-50" }
    if (formatLower?.includes("psd") || formatLower?.includes("ai") || formatLower?.includes("sketch"))
      return { color: "bg-indigo-500", textColor: "text-indigo-50" }
    if (formatLower?.includes("ppt") || formatLower?.includes("pptx"))
      return { color: "bg-orange-500", textColor: "text-orange-50" }

    return { color: "bg-gray-500", textColor: "text-gray-50" }
  }

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between sticky top-0 z-10 bg-background p-3 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search assets..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <span>Sort by</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Name</DropdownMenuItem>
              <DropdownMenuItem>Date</DropdownMenuItem>
              <DropdownMenuItem>Size</DropdownMenuItem>
              <DropdownMenuItem>Type</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Selection toolbar */}
      <AnimatePresence>
        {isSelectionMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-16 z-10 flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-lg border shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={deselectAll} className="h-8">
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>

              <Badge variant="secondary" className="text-sm">
                {selectedAssets.length} selected
              </Badge>

              <Button variant="ghost" size="sm" onClick={selectAll} className="h-8">
                <Check className="h-4 w-4 mr-1" />
                Select all
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8">
                      <Download className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Download</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download selected</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8">
                      <Globe className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Make public</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Make selected assets public</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="destructive" className="h-8">
                      <Trash2 className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Delete</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete selected assets</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Asset grid */}
      {filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/10">
          <div className="rounded-full bg-muted p-3 mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No assets found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 auto-rows-min">
          {filteredAssets.map((asset, index) => {
            const isSelected = selectedAssets.includes(asset.id)
            const isHovered = hoveredAsset === asset.id
            const formatInfo = getFormatInfo(asset.format)

            return (
              <motion.div
                key={asset.resourceId}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                onHoverStart={() => setHoveredAsset(asset.id)}
                onHoverEnd={() => setHoveredAsset(null)}
                onClick={() => toggleAsset(asset.id)}
              >
                <div
                  className={cn(
                    "group relative h-full overflow-hidden rounded-lg border transition-all duration-200",
                    isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:border-primary/50",
                    isSelected ? "bg-primary/5" : "bg-background",
                  )}
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    {/* Image with loading state */}
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    <img
                      src={asset.thumbnail || `/placeholder.svg?height=400&width=400`}
                      alt={asset.name}
                      className={cn(
                        "h-full w-full object-cover transition-all duration-300",
                        isHovered || isSelected || isMobile
                          ? "scale-105 brightness-[0.85]"
                          : "group-hover:scale-105 group-hover:brightness-[0.9]",
                      )}
                      onLoad={(e) => {
                        const target = e.target as HTMLImageElement
                        target.previousElementSibling?.classList.add("hidden")
                      }}
                    />

                    {/* Format badge */}
                    {asset.format && (
                      <div className="absolute top-2 right-2">
                        <Badge className={cn("text-xs font-medium", formatInfo.color, formatInfo.textColor)}>
                          {asset.format}
                        </Badge>
                      </div>
                    )}

                    {/* Checkbox */}
                    <div
                      className={cn(
                        "absolute top-2 left-2 transition-opacity",
                        isHovered || isSelected || isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleAsset(asset.id)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${asset.name}`}
                        className={cn(
                          "h-5 w-5 border-white bg-black/30 text-primary",
                          isSelected ? "bg-primary border-primary" : "",
                        )}
                      />
                    </div>

                    {/* Info overlay - always visible at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-white truncate">{asset.name}</p>
                        {asset.isPublic ? (
                          <Globe className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <div className="text-xs text-white/70 truncate">
                          {asset.size && asset.dimensions ? `${asset.size} • ${asset.dimensions}` : ""}
                        </div>
                      </div>
                    </div>

                    {/* Action menu */}
                    <div
                      className={cn(
                        "absolute top-2 right-2 transition-opacity",
                        isHovered || isMobile ? "opacity-100 z-10" : "opacity-0 group-hover:opacity-100",
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AssetMosaic