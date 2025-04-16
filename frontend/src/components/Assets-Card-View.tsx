// "use client"

// import { useState, useRef, useEffect } from "react"
// import { MoreHorizontal, Globe, Lock, ImageIcon, FileText } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Checkbox } from "@/components/ui/checkbox"
// import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
// import { Resource } from "@/lib/types"

// interface AssetCardProps {
//   assets: Resource[],
//   allSelectedAssets:Resource[]
// }

// const AssetCard = ({ assets ,allSelectedAssets}: AssetCardProps) => {
//   const [selectedAssets, setSelectedAssets] = useState<string[]>([])
//   const prevAssetsRef = useRef<Resource[]>([])

//   // Track previous assets to optimize rendering
//   useEffect(() => {
//     prevAssetsRef.current = assets
//   }, [assets])

//   const toggleAsset = (id: string) => {
//     if (selectedAssets.includes(id)) {
//       setSelectedAssets(selectedAssets.filter((assetId) => assetId !== id))
//     } else {
//       setSelectedAssets([...selectedAssets, id])
//     }
//   }

//   const toggleAllAssets = (checked: boolean) => {
//     if (checked) {
//       setSelectedAssets(assets.map((asset) => asset.resourceId))
//     } else {
//       setSelectedAssets([])
//     }
//   }

//   return (
// <LayoutGroup>
//   <div className="flex flex-wrap gap-x-4 gap-y-6 w-full">
//     <AnimatePresence mode="popLayout" initial={false}>
//       {assets.map((asset) => (
//         <motion.div
//           key={asset.resourceId}
//           layout
//           className="flex-shrink-0 min-w-[250px]  w-full sm:w-[50%] md:w-[34%] lg:w-[30%]"
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{
//             opacity: 1,
//             scale: 1,
//             transition: { type: "spring", stiffness: 300, damping: 25 },
//           }}
//           exit={{
//             opacity: 0,
//             scale: 0.95,
//             transition: { duration: 0.15 },
//           }}
//           transition={{
//             layout: { type: "spring", stiffness: 300, damping: 25 },
//           }}
//         >
//           <Card className="group overflow-hidden flex flex-col">
//             <div className="relative aspect-video bg-muted">
//               <motion.img
//                 layoutId={`image-${asset.resourceId}`}
//                 src={asset.path || "/placeholder.svg?height=200&width=300"}
//                 alt={asset.name}
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//               <div className="absolute top-2 left-2 z-10">
//                 <Checkbox
//                   checked={selectedAssets.includes(asset.resourceId)}
//                   onCheckedChange={() => toggleAsset(asset.resourceId)}
//                   aria-label={`Select ${asset.name}`}
//                   className="bg-white/90 border-transparent transition-transform duration-200 hover:scale-110"
//                 />
//               </div>
//               <div className="absolute top-2 right-2 z-10">
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="bg-white/90 hover:bg-white transition-transform duration-200 hover:scale-110"
//                     >
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>View</DropdownMenuItem>
//                     <DropdownMenuItem>Download</DropdownMenuItem>
//                     <DropdownMenuItem>Rename</DropdownMenuItem>
//                     <DropdownMenuItem>Share</DropdownMenuItem>

//                     <DropdownMenuItem>Delete</DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//             <CardContent className="flex-grow">
//               <motion.div className="flex items-center gap-2 mt-2" layoutId={`title-${asset.resourceId}`}>
//                 {asset.resourceTypeDetails ? (
//                   <ImageIcon className="text-blue-500 h-4 w-4 flex-shrink-0" />
//                 ) : (
//                   <FileText className="text-orange-500 h-4 w-4 flex-shrink-0" />
//                 )}
//                 <p className="text-sm font-medium truncate">{asset.name}</p>
//               </motion.div>
//             </CardContent>
//             <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground">
//               <div>{asset.metadata?.mimetype || "-"} • {asset.metadata?.size || "-"} bits</div>
//               <div>
//                 {asset.visibility ? (
//                   <Globe className="text-green-500 h-4 w-4" />
//                 ) : (
//                   <Lock className="text-amber-500 h-4 w-4" />
//                 )}
//               </div>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       ))}
//     </AnimatePresence>
//   </div>
// </LayoutGroup>

//   )
// }

// export default AssetCard

// import type React from "react"

// import { AnimatePresence, motion } from "framer-motion"
// import { ImageIcon, FileText, Globe, Lock, MoreHorizontal } from "lucide-react"

// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
// import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
// import { useState } from "react"
// import { Resource } from "@/lib/types"

// interface Asset {
//   resourceId: string
//   name: string
//   path: string
//   resourceTypeDetails?: boolean
//   metadata?: {
//     mimetype?: string
//     size?: string
//   }
//   visibility?: boolean
// }

// // interface AssetCardProps {
// //   assets: Asset[]
// //   selectedAssets: string[]
// //   // toggleAsset: (assetId: string) => void
// // }

// interface AssetCardProps {
//   assets: Resource[]
//   selectedAssets?: Resource[]
//   setAllSelectedAssets:(assets: string[])=>void;
//   onSelectAsset?: (assetId: string, selected: boolean) => void
//   onSelectAll?: (selected: boolean) => void
// }
// const AssetCard: React.FC<AssetCardProps> = ({ assets,setAllSelectedAssets, selectedAssets=[],onSelectAsset,onSelectAll}) => {

// const toggleAsset = (id: string) => {
//   const newSelectedAssets = selectedAssets.includes(id)
//     ? selectedAssets.filter((assetId) => assetId !== id)
//     : [...selectedAssets, id]

//     setAllSelectedAssets(newSelectedAssets)

//   if (onSelectAsset) {
//     onSelectAsset(id, !selectedAssets.includes(id))
//   }
// }

// const toggleAllAssets = (checked: boolean) => {
//   if (checked) {
//     setAllSelectedAssets(assets.map((asset) => asset.resourceId))
//   } else {
//     setAllSelectedAssets([])
//   }

//   if (onSelectAll) {
//     onSelectAll(checked)
//   }
// }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4 w-full "

//     style={{
//       gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
//     }}
//     >
//        <AnimatePresence mode="popLayout" initial={false}>
//           {assets.map((asset) => (
//             <motion.div
//               key={asset.resourceId}
//               layout
//               className="w-full will-change-transform"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{
//                 opacity: 1,
//                 scale: 1,
//                 transition: { type: "spring", stiffness: 300, damping: 25 },
//               }}
//               exit={{
//                 opacity: 0,
//                 scale: 0.95,
//                 transition: { duration: 0.15 },
//               }}
//               transition={{
//                 layout: {
//                   type: "spring",
//                   stiffness: 300,
//                   damping: 30,
//                   restDelta: 0.001, // More precise animations
//                 },
//               }}
//             >
//               <Card className="group overflow-hidden flex flex-col h-full border border-border hover:border-primary/20 transition-colors">
//                 <div className="relative aspect-video bg-muted overflow-hidden">
//                   <img
//                     src={asset.path || "/placeholder.svg?height=200&width=300"}
//                     alt={asset.name}
//                     className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
//                     loading="lazy"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//                   <div className="absolute top-2 left-2 z-10">
//                     <Checkbox
//                       checked={selectedAssets.includes(asset.resourceId)}
//                       onCheckedChange={() => toggleAsset(asset.resourceId)}
//                       aria-label={`Select ${asset.name}`}
//                       className="bg-background/90 border-transparent transition-transform duration-200 hover:scale-110"
//                     />
//                   </div>
//                   <div className="absolute top-2 right-2 z-10">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="bg-background/90 hover:bg-background transition-transform duration-200 hover:scale-110 h-8 w-8"
//                         >
//                           <MoreHorizontal className="h-4 w-4" />
//                           <span className="sr-only">Open menu</span>
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end" className="w-[160px]">
//                         <DropdownMenuItem>View</DropdownMenuItem>
//                         <DropdownMenuItem>Download</DropdownMenuItem>
//                         <DropdownMenuItem>Rename</DropdownMenuItem>
//                         <DropdownMenuItem>Share</DropdownMenuItem>
//                         <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                 </div>
//                 <CardContent className="flex-grow py-3">
//                   <div className="flex items-center gap-2">
//                     {asset.resourceTypeDetails ? (
//                       <ImageIcon className="text-blue-500 dark:text-blue-400 h-4 w-4 flex-shrink-0" />
//                     ) : (
//                       <FileText className="text-orange-500 dark:text-orange-400 h-4 w-4 flex-shrink-0" />
//                     )}
//                     <p className="text-sm font-medium truncate">{asset.name}</p>
//                   </div>
//                 </CardContent>
//                 <CardFooter className="pt-0 pb-3 flex justify-between items-center text-xs text-muted-foreground">
//                   <div className="truncate">
//                     {asset.metadata?.mimetype || "-"} • {asset.metadata?.size || "-"} bits
//                   </div>
//                   <div>
//                     {asset.visibility ? (
//                       <Globe className="text-green-500 dark:text-green-400 h-4 w-4" />
//                     ) : (
//                       <Lock className="text-amber-500 dark:text-amber-400 h-4 w-4" />
//                     )}
//                   </div>
//                 </CardFooter>
//               </Card>
//             </motion.div>
//           ))}
//         </AnimatePresence >
//     </div>
//   )
// }

// export default AssetCard

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, FileText, Globe, Lock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Resource } from "@/lib/types";
import AssetActions from "./AssetsActions";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

interface AssetCardProps {
  assets: Resource[];
  selectedAssets?: Resource[];
  setAllSelectedAssets: (assets: Resource[]) => void;
  onSelectAsset?: (assetId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  assets,
  selectedAssets = [],
  setAllSelectedAssets,
  onSelectAsset,
  onSelectAll,
}) => {
  //  const { user, token } = useSelector((state: RootState) => state.auth);
  const { activeBucket } = useSelector((state: RootState) => state.resource);
  const { folderId: currentopenOrSelectedFolder } = useParams();
  const isAssetSelected = (id: string) =>
    selectedAssets.some((asset) => asset.resourceId === id);

  const handleShare = (assetId: string) => {
    // Add custom logic here to share the asset via email
    console.log("Sharing asset via email with ID:", assetId);
  };
  const toggleAsset = (id: string) => {
    const alreadySelected = isAssetSelected(id);
    if (alreadySelected) {
      setAllSelectedAssets(
        selectedAssets.filter((asset) => asset.resourceId !== id)
      );
    } else {
      const newAsset = assets.find((asset) => asset.resourceId === id);
      if (newAsset) {
        setAllSelectedAssets([...selectedAssets, newAsset]);
      }
    }
    onSelectAsset?.(id, !alreadySelected);
  };

  const getFileIcon = (mimetype: string | undefined) => {
    if (!mimetype) return <FileText className="h-4 w-4 text-gray-500" />;
    if (mimetype.startsWith("image/"))
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    return <FileText className="h-4 w-4 text-orange-500" />;
  };

  const getVisibilityIcon = (isPublic?: boolean) => {
    return isPublic ? (
      <Globe className="h-4 w-4 text-green-500" />
    ) : (
      <Lock className="h-4 w-4 text-orange-400" />
    );
  };

  return (
    <div
      className="grid gap-4 w-full justify-center"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        margin: "0 auto",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {assets.map((asset) => (
          <motion.div
            key={asset.resourceId}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden shadow-sm relative group border-2 hover:border-blue-300  dark:hover:border-slate-600">
              {/* Checkbox + Menu */}
              <div className="absolute top-0 left-2 z-10">
                <Checkbox
                  checked={isAssetSelected(asset.resourceId)}
                  onCheckedChange={() => toggleAsset(asset.resourceId)}
                  className="h-4 w-4"
                />
              </div>
              <div className="absolute top-0 right-2 z-10">
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 "
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
                <AssetActions
                  asset={asset}
                  bucketId={activeBucket}
                  folderId={currentopenOrSelectedFolder ?? ""}
                  onShare={handleShare} // Optional: share handler
                />
              </div>

              {/* Thumbnail */}
              <div className="bg-gray-100 h-36 w-full flex items-center justify-center overflow-hidden">
                <img
                  src={asset.path || "/placeholder.svg"}
                  alt={asset.name}
                  className="h-full w-full object-cover bg-muted"
                  loading="lazy"
                />
              </div>

              {/* File Info */}
              <CardContent className="p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 font-medium truncate">
                  {getFileIcon(asset.metadata?.mimetype)}
                  <span className="truncate">{asset.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {asset.metadata?.mimetype || "-"} •{" "}
                    {asset.metadata?.size || "-"}
                  </span>
                  {/* {getVisibilityIcon(asset.public)} */}
                  {getVisibilityIcon(!!asset.visibility)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AssetCard;
