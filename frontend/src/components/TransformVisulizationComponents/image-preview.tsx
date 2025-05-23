
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TransformationParams } from "./image-transformer"
import { useState } from "react"
import { Button } from "../ui/button"
import { DownloadButton } from "./MultiOptionDownloadButtons/DownloadButton"
import { AnimatePresence,motion } from "framer-motion"

interface ImagePreviewProps {
  originalImage: string
  transformations: TransformationParams
  transformationUrl: string
}

export function ImagePreview({ originalImage, transformations, transformationUrl }: ImagePreviewProps) {
  // Generate CSS styles to simulate transformations
  const getTransformStyles = () => {
    const styles: React.CSSProperties = {
      width: "100%",
      height: "100%",
      objectFit:
        transformations.c === "contain"
          ? "contain"
          : transformations.c === "cover"
            ? "cover"
            : transformations.c === "fill"
              ? "fill"
              : "contain",
    }

    // Apply filters
    const filters: string[] = []
    if (transformations.e_grayscale) filters.push("grayscale(100%)")
    if (transformations.e_sepia) filters.push("sepia(100%)")
    if (transformations.e_negate) filters.push("invert(100%)")
    if (transformations.e_blur) filters.push(`blur(${Math.min(20, Number(transformations.e_blur) / 5)}px)`)

    if (filters.length > 0) {
      styles.filter = filters.join(" ")
    }

    // Apply transforms
    const transforms: string[] = []
    if (transformations.a_hflip) transforms.push("scaleX(-1)")
    if (transformations.a_vflip) transforms.push("scaleY(-1)")
    if (transformations.a) transforms.push(`rotate(${transformations.a}deg)`)

    if (transforms.length > 0) {
      styles.transform = transforms.join(" ")
    }

    // Apply dimensions if specified
    if (transformations.w) {
      styles.maxWidth = `${transformations.w}px`
    }

    if (transformations.h) {
      styles.maxHeight = `${transformations.h}px`
    }

    return styles
  }

  // Apply gravity (position) based on selection
  const getPositionStyle = () => {
    const style: React.CSSProperties = {
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }

    if (transformations.g) {
      switch (transformations.g) {
        case "north":
          style.alignItems = "flex-start"
          break
        case "northeast":
          style.alignItems = "flex-start"
          style.justifyContent = "flex-end"
          break
        case "east":
          style.justifyContent = "flex-end"
          break
        case "southeast":
          style.alignItems = "flex-end"
          style.justifyContent = "flex-end"
          break
        case "south":
          style.alignItems = "flex-end"
          break
        case "southwest":
          style.alignItems = "flex-end"
          style.justifyContent = "flex-start"
          break
        case "west":
          style.justifyContent = "flex-start"
          break
        case "northwest":
          style.alignItems = "flex-start"
          style.justifyContent = "flex-start"
          break
        default:
          // center is default
          break
      }
    }

    return style
  }
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div> 
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="side-by-side" className="w-full">
         
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger className="cursor-pointer" value="transformed">Transformed</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="side-by-side">Side by Side</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="original">Original</TabsTrigger>
          </TabsList>
          <TabsContent value="transformed" className="mt-0">
            <AnimatePresence mode="wait">
          <motion.div
      key="transformed"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transformed</p>
              <div
                className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden"
                style={getPositionStyle()}
              >
                <img src={originalImage || "/NoImageFound.png"} alt="Transformed" style={getTransformStyles()} />
                {transformations.f && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                    Format: {transformations.f.toUpperCase()}
                  </div>
                )}
                {transformations.q && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                    Quality: {transformations.q}%
                  </div>
                )}
              </div>
            </motion.div>
</AnimatePresence>
          </TabsContent>
          <TabsContent value="side-by-side" className="mt-0">
          <AnimatePresence mode="wait">
    <motion.div
      key="transformed"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
            
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Original</p>
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-gray-600 dark:border-white"></div>
        </div>
      )}
                  <img
                    src={ originalImage?.trim() ? originalImage : "/NoImageFound.png"}
                    alt="Original"
                    className="w-full h-full object-contain"
                     onLoad={() => setIsLoaded(true)}
                     onError={() => setIsLoaded(true)} 
                     loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Transformed</p>
                <div
                  className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden"
                  style={getPositionStyle()}
                >
                  <img src={originalImage || "/placeholder.svg"} alt="Transformed" style={getTransformStyles()} />
                  {transformations.f && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                      Format: {transformations.f.toUpperCase()}
                    </div>
                  )}
                  {transformations.q && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                      Quality: {transformations.q}%
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="original" className="mt-0">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Original</p>
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                <img
                  src={originalImage || "/placeholder.svg"}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </TabsContent>
         
          <p className="text-sm text-gray-800 pt-1 dark:text-gray-200">This image has been scaled down for viewing purpose. </p>
          {/* <Button variant={"default"}>Rich download options</Button> */}
          <DownloadButton
              imageUrl={transformationUrl}
              filename={ "image"}
            />
        </Tabs>
      </CardContent>
    </Card>
    </div>
  )
}
