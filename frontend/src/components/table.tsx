// // import {
// //   ColumnDef,
// //   flexRender,
// //   getCoreRowModel,
// //   useReactTable,
// //   ColumnResizeMode,
// //   getFilteredRowModel,
// //   RowSelectionState,
// //   getPaginationRowModel,
// // } from "@tanstack/react-table"
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table"
// // import { Button } from "@/components/ui/button"
// // import { Badge } from "@/components/ui/badge"
// // import { Checkbox } from "@/components/ui/checkbox"
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu"
// // import {
// //   ArrowUp,
// //   ChevronDown,
// //   Download,
// //   Trash2,
// //   Share2,
// //   Copy,
// //   MoreVertical,
// // } from "lucide-react"
// // import { useState } from "react"

// // interface FileItem {
// //   id: string
// //   displayName: string
// //   folder: string
// //   type: 'Image' | 'Video' | 'Document'
// //   format: string
// //   size: string
// //   dimensions: string
// //   status: 'Upload' | 'Processing' | 'Ready'
// //   visibility: 'Public' | 'Private'
// // }

// // const columns: ColumnDef<FileItem>[] = [
// //   {
// //     id: "select",
// //     header: ({ table }) => (
// //       <Checkbox
// //         checked={table.getIsAllPageRowsSelected()}
// //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
// //         aria-label="Select all"
// //         className="translate-y-[2px]"
// //       />
// //     ),
// //     cell: ({ row }) => (
// //       <Checkbox
// //         checked={row.getIsSelected()}
// //         onCheckedChange={(value) => row.toggleSelected(!!value)}
// //         aria-label="Select row"
// //         className="translate-y-[2px]"
// //       />
// //     ),
// //     size: 40,
// //   },
// //   {
// //     accessorKey: "displayName",
// //     header: "Display name",
// //     size: 300,
// //     minSize: 200,
// //     cell: ({ row }) => (
// //       <div className="font-medium truncate max-w-[280px]">
// //         {row.getValue("displayName")}
// //       </div>
// //     )
// //   },
// //   {
// //     accessorKey: "folder",
// //     header: "Folder",
// //     size: 160,
// //     minSize: 100,
// //   },
// //   {
// //     accessorKey: "type",
// //     header: "Type",
// //     size: 150,
// //     minSize: 100,
// //     cell: ({ row }) => (
// //       <Badge
// //         variant={row.getValue("type") === 'Video' ? 'destructive' : 'outline'}
// //         className="capitalize"
// //       >
// //         {row.getValue("type")}
// //       </Badge>
// //     )
// //   },
// //   {
// //     accessorKey: "format",
// //     header: "Format",
// //     size: 150,
// //     minSize: 100,
// //   },
// //   {
// //     accessorKey: "size",
// //     header: "Size",
// //     size: 150,
// //     minSize: 100,
// //   },
// //   {
// //     accessorKey: "dimensions",
// //     header: "Dimensions",
// //     size: 180,
// //     minSize: 100,
// //   },
// //   {
// //     accessorKey: "status",
// //     header: "Status",
// //     size: 150,
// //     minSize: 100,
// //     cell: ({ row }) => (
// //       <Button variant="ghost" size="sm" className="gap-1 h-8">
// //         <ArrowUp className="h-4 w-4" />
// //         {row.getValue("status")}
// //       </Button>
// //     )
// //   },
// //   {
// //     accessorKey: "visibility",
// //     header: "Visibility",
// //     size: 150,
// //     minSize: 100,
// //     cell: ({ row }) => (
// //       <DropdownMenu>
// //         <DropdownMenuTrigger asChild>
// //           <Button variant="ghost" size="sm" className="gap-1 h-8">
// //             {row.getValue("visibility")}
// //             <ChevronDown className="h-4 w-4 opacity-50" />
// //           </Button>
// //         </DropdownMenuTrigger>
// //         <DropdownMenuContent align="end">
// //           <DropdownMenuItem>Public</DropdownMenuItem>
// //           <DropdownMenuItem>Private</DropdownMenuItem>
// //         </DropdownMenuContent>
// //       </DropdownMenu>
// //     )
// //   },
// //   {
// //     id: "actions",
// //     cell: ({ row }) => (
// //       <DropdownMenu>
// //         <DropdownMenuTrigger asChild>
// //           <Button variant="ghost" className="h-8 w-8 p-0">
// //             <MoreVertical className="h-4 w-4" />
// //           </Button>
// //         </DropdownMenuTrigger>
// //         <DropdownMenuContent align="end">
// //           <DropdownMenuItem className="flex items-center gap-2">
// //             <Download className="h-4 w-4" />
// //             Download
// //           </DropdownMenuItem>
// //           <DropdownMenuItem className="flex items-center gap-2">
// //             <Share2 className="h-4 w-4" />
// //             Share
// //           </DropdownMenuItem>
// //           <DropdownMenuItem className="flex items-center gap-2">
// //             <Copy className="h-4 w-4" />
// //             Copy Link
// //           </DropdownMenuItem>
// //           <DropdownMenuItem className="flex items-center gap-2 text-destructive">
// //             <Trash2 className="h-4 w-4" />
// //             Delete
// //           </DropdownMenuItem>
// //         </DropdownMenuContent>
// //       </DropdownMenu>
// //     ),
// //     size: 40,
// //   },
// // ]

// // const data: FileItem[] = [
// //     {
// //       id: "1",
// //       displayName: "subhamPandeySli_hljbkt",
// //       folder: "",
// //       type: "Image",
// //       format: "PNG",
// //       size: "414.07 KB",
// //       dimensions: "1920 × 1080",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "2",
// //       displayName: "screencapture-portly-dev-deep-...",
// //       folder: "Home",
// //       type: "Image",
// //       format: "PNG",
// //       size: "114.26 KB",
// //       dimensions: "1024 × 851",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "3",
// //       displayName: "R.06448182cdf65d7f6355be9dfc...",
// //       folder: "testimer",
// //       type: "Image",
// //       format: "PNG",
// //       size: "47.41 KB",
// //       dimensions: "1568 × 568",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "4",
// //       displayName: "01-removebg-preview_rkp3fy",
// //       folder: "test1",
// //       type: "Image",
// //       format: "JPG",
// //       size: "43.29 KB",
// //       dimensions: "447 × 559",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "5",
// //       displayName: "myimage_2_roxaj8",
// //       folder: "Home",
// //       type: "Image",
// //       format: "WebP",
// //       size: "22.63 KB",
// //       dimensions: "600 × 600",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "6",
// //       displayName: "Screenshot_2023-04-15_104509...",
// //       folder: "test1",
// //       type: "Image",
// //       format: "JPG",
// //       size: "23.97 KB",
// //       dimensions: "647 × 220",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "7",
// //       displayName: "dance-2",
// //       folder: "samples",
// //       type: "Video",
// //       format: "MP4",
// //       size: "21.34 MB",
// //       dimensions: "3840 × 2160",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "8",
// //       displayName: "profile-pic_new",
// //       folder: "avatars",
// //       type: "Image",
// //       format: "JPEG",
// //       size: "58.11 KB",
// //       dimensions: "400 × 400",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "9",
// //       displayName: "holiday_clip",
// //       folder: "travel",
// //       type: "Video",
// //       format: "MOV",
// //       size: "55.26 MB",
// //       dimensions: "1920 × 1080",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "10",
// //       displayName: "nature-pic-lake",
// //       folder: "scenery",
// //       type: "Image",
// //       format: "PNG",
// //       size: "208.47 KB",
// //       dimensions: "1600 × 900",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "11",
// //       displayName: "event-flyer",
// //       folder: "Home",
// //       type: "Image",
// //       format: "PDF",
// //       size: "1.2 MB",
// //       dimensions: "A4",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "12",
// //       displayName: "ui-mockup-23",
// //       folder: "designs",
// //       type: "Image",
// //       format: "PNG",
// //       size: "712.34 KB",
// //       dimensions: "1440 × 900",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "13",
// //       displayName: "screenshot-dashboard",
// //       folder: "work",
// //       type: "Image",
// //       format: "PNG",
// //       size: "324.99 KB",
// //       dimensions: "1366 × 768",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "14",
// //       displayName: "camera-roll-56",
// //       folder: "photos",
// //       type: "Image",
// //       format: "JPG",
// //       size: "845.22 KB",
// //       dimensions: "4032 × 3024",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "15",
// //       displayName: "interview_clip_final",
// //       folder: "media",
// //       type: "Video",
// //       format: "MP4",
// //       size: "78.66 MB",
// //       dimensions: "1280 × 720",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "16",
// //       displayName: "test_document_1",
// //       folder: "docs",
// //       type: "Document",
// //       format: "PDF",
// //       size: "98.41 KB",
// //       dimensions: "-",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "17",
// //       displayName: "thumbnail_game",
// //       folder: "games",
// //       type: "Image",
// //       format: "GIF",
// //       size: "1.8 MB",
// //       dimensions: "128 × 128",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "18",
// //       displayName: "presentation_final",
// //       folder: "slides",
// //       type: "Document",
// //       format: "PPTX",
// //       size: "5.33 MB",
// //       dimensions: "-",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "19",
// //       displayName: "logo_white_transparent",
// //       folder: "branding",
// //       type: "Image",
// //       format: "SVG",
// //       size: "12.45 KB",
// //       dimensions: "vector",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "20",
// //       displayName: "poster1_highres",
// //       folder: "print",
// //       type: "Image",
// //       format: "TIFF",
// //       size: "4.51 MB",
// //       dimensions: "3300 × 5100",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "21",
// //       displayName: "training_intro",
// //       folder: "training",
// //       type: "Video",
// //       format: "MP4",
// //       size: "12.64 MB",
// //       dimensions: "1920 × 1080",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "22",
// //       displayName: "dog-meme",
// //       folder: "memes",
// //       type: "Image",
// //       format: "PNG",
// //       size: "780.11 KB",
// //       dimensions: "800 × 800",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "23",
// //       displayName: "voiceover_intro",
// //       folder: "audio",
// //       type: "Image",
// //       format: "MP3",
// //       size: "3.3 MB",
// //       dimensions: "-",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "24",
// //       displayName: "code_snippet_screenshot",
// //       folder: "dev",
// //       type: "Image",
// //       format: "PNG",
// //       size: "134.52 KB",
// //       dimensions: "800 × 600",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "25",
// //       displayName: "birthday_card_editable",
// //       folder: "cards",
// //       type: "Image",
// //       format: "PSD",
// //       size: "6.72 MB",
// //       dimensions: "1080 × 1920",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "26",
// //       displayName: "webinar_recording_2023",
// //       folder: "recordings",
// //       type: "Video",
// //       format: "MP4",
// //       size: "33.25 MB",
// //       dimensions: "1920 × 1080",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "27",
// //       displayName: "app_icon",
// //       folder: "icons",
// //       type: "Image",
// //       format: "ICO",
// //       size: "8.9 KB",
// //       dimensions: "64 × 64",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "28",
// //       displayName: "sketch_doodle_art",
// //       folder: "art",
// //       type: "Image",
// //       format: "PNG",
// //       size: "980.75 KB",
// //       dimensions: "2000 × 1500",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "29",
// //       displayName: "intro_music_loop",
// //       folder: "music",
// //       type: "Image",
// //       format: "WAV",
// //       size: "12.17 MB",
// //       dimensions: "-",
// //       status: "Upload",
// //       visibility: "Public"
// //     },
// //     {
// //       id: "30",
// //       displayName: "announcement_banner",
// //       folder: "banners",
// //       type: "Image",
// //       format: "JPG",
// //       size: "1.24 MB",
// //       dimensions: "1920 × 300",
// //       status: "Upload",
// //       visibility: "Public"
// //     }
// //   ]

// // export default function EnhancedFileManagerTable() {
// //   const [columnResizeMode] = useState<ColumnResizeMode>("onChange")
// //   const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

// //   const table = useReactTable({
// //     data,
// //     columns,
// //     state: {
// //       rowSelection,
// //     },
// //     onRowSelectionChange: setRowSelection,
// //     columnResizeMode,
// //     getCoreRowModel: getCoreRowModel(),
// //     getFilteredRowModel: getFilteredRowModel(),
// //     getPaginationRowModel: getPaginationRowModel(),
// //   })

// //   const totalWidth = table.getTotalSize()

// //   return (
// //     <div className="space-y-4 ">
// //       {/* Batch actions bar */}
// //       {table.getSelectedRowModel().rows.length > 0 && (
// //         <div className="flex items-center gap-4 p-2 bg-muted/50 rounded-md ">
// //           <div className="text-sm text-muted-foreground">
// //             {table.getSelectedRowModel().rows.length} file(s) selected
// //           </div>
// //           <Button variant="outline" size="sm" className="h-8 gap-1">
// //             <Download className="h-4 w-4" />
// //             Download
// //           </Button>
// //           <Button variant="outline" size="sm" className="h-8 gap-1">
// //             <Share2 className="h-4 w-4" />
// //             Share
// //           </Button>
// //           <Button variant="outline" size="sm" className="h-8 gap-1 text-destructive">
// //             <Trash2 className="h-4 w-4" />
// //             Delete
// //           </Button>
// //         </div>
// //       )}

// //       {/* Table */}
// //       <div className="rounded-md border overflow-x-auto ">
// //         <div style={{ minWidth: `${totalWidth}px` }}>
// //           <Table style={{ width: `${totalWidth}px` }}>
// //             <TableHeader>
// //               {table.getHeaderGroups().map((headerGroup) => (
// //                 <TableRow key={headerGroup.id}>
// //                   {headerGroup.headers.map((header) => (
// //                     <TableHead
// //                       key={header.id}
// //                       style={{
// //                         width: header.getSize(),
// //                         position: 'relative',
// //                       }}
// //                       className="group"
// //                     >
// //                       {flexRender(
// //                         header.column.columnDef.header,
// //                         header.getContext()
// //                       )}
// //                       <div
// //                         onMouseDown={header.getResizeHandler()}
// //                         onTouchStart={header.getResizeHandler()}
// //                         className={`
// //                           absolute right-0 top-0 h-full w-1
// //                           bg-border cursor-col-resize select-none touch-none
// //                           hover:bg-primary hover:w-1.5 transition-all
// //                           ${header.column.getIsResizing() ? 'bg-primary w-1.5' : ''}
// //                         `}
// //                       />
// //                     </TableHead>
// //                   ))}
// //                 </TableRow>
// //               ))}
// //             </TableHeader>
// //             <TableBody>
// //               {table.getRowModel().rows?.length ? (
// //                 table.getRowModel().rows.map((row) => (
// //                   <TableRow
// //                     key={row.id}
// //                     data-state={row.getIsSelected() && "selected"}
// //                   >
// //                     {row.getVisibleCells().map((cell) => (
// //                       <TableCell
// //                         key={cell.id}
// //                         style={{
// //                           width: cell.column.getSize(),
// //                         }}
// //                       >
// //                         {flexRender(
// //                           cell.column.columnDef.cell,
// //                           cell.getContext()
// //                         )}
// //                       </TableCell>
// //                     ))}
// //                   </TableRow>
// //                 ))
// //               ) : (
// //                 <TableRow>
// //                   <TableCell colSpan={columns.length} className="h-24 text-center">
// //                     No files found.
// //                   </TableCell>
// //                 </TableRow>
// //               )}
// //             </TableBody>
// //           </Table>
// //         </div>
// //       </div>

// //       {/* Pagination */}
// //       <div className="flex items-center justify-between">
// //         <div className="text-sm text-muted-foreground">
// //           Showing {table.getRowModel().rows.length} of {data.length} files
// //         </div>
// //         <div className="flex items-center space-x-2">
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() => table.previousPage()}
// //             disabled={!table.getCanPreviousPage()}
// //           >
// //             Previous
// //           </Button>
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() => table.nextPage()}
// //             disabled={!table.getCanNextPage()}
// //           >
// //             Next
// //           </Button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// import {
//     ColumnDef,
//     flexRender,
//     getCoreRowModel,
//     useReactTable,
//     ColumnResizeMode,
//     getFilteredRowModel,
//     RowSelectionState,
//     getPaginationRowModel,
//     getSortedRowModel,
//   } from "@tanstack/react-table";
//   import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
//   } from "@/components/ui/table";
//   import { Button } from "@/components/ui/button";
//   import { Badge } from "@/components/ui/badge";
//   import { Checkbox } from "@/components/ui/checkbox";
//   import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
//   } from "@/components/ui/dropdown-menu";
//   import {
//     ChevronDown,
//     Download,
//     Trash2,
//     Share2,
//     Copy,
//     MoreVertical,
//     Folder,
//     File,
//     Image,
//     Film,
//     Music,
//     FileText,
//     FolderClosedIcon,
//     Settings,
//     Grid,
//     List,
//     LayoutGrid,
//     RefreshCw,
//     Search,
//     X,
//   } from "lucide-react";
//   import { useEffect, useState, useRef } from "react";
//   import { RootState } from "@/redux/store";
//   import { useSelector } from "react-redux";
//   import { useLazyGetAllAssetsOfParticularAccountQuery } from "@/redux/apiSlice/itemsApi";
//   import { AnimatePresence } from "framer-motion";
//   import { motion } from "framer-motion";
//   import { Resource } from "@/lib/types";
//   import { Link } from "react-router";
//   import AssetDrawer from "@/components/AssetsInfoDrawer";
//   import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
//   import { Input } from "@/components/ui/input";
  
//   const columns: ColumnDef<Resource>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={table.getIsAllPageRowsSelected()}
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//           className="translate-y-[2px]"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//           className="border-gray-300 dark:border-zinc-600 rounded-sm text-primary focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-zinc-900"
//         />
//       ),
//       size: 40,
//     },
//     {
//       accessorKey: "name",
//       header: "Name",
//       size: 300,
//       minSize: 250,
//       cell: ({ row }) => {
//         const resource = row.original;
//         const isFolder = resource.type === "folder";
//         const displayName = resource.displayName || resource.name;
//         const mimeType = resource.metadata?.mimetype || "";
  
//         return (
//           <div className="flex items-center gap-2 font-medium truncate max-w-[280px]">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 overflow-hidden rounded-md bg-muted dark:bg-slate-500 flex-shrink-0 flex items-center justify-center">
//                 {isFolder ? (
//                   <Folder className="h-5 w-5 text-yellow-500" />
//                 ) : (
//                   getFileIcon(mimeType)
//                 )}
//               </div>
//               <span>{displayName}</span>
//             </div>
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "parent_resource_id",
//       header: "Containing Folder",
//       size: 200,
//       minSize: 150,
//       maxSize: 700,
//       cell: ({ row }) => {
//         const { path, parentResourceId } = row.original;
  
//         if (!path || !parentResourceId) {
//           return <span className="text-muted-foreground italic">—</span>;
//         }
  
//         const pathParts = path.split("/").filter(Boolean);
//         const folderName =
//           pathParts.length > 1 ? pathParts[pathParts.length - 2] : "Root";
  
//         return (
//           <Link
//             to={`/folder/${parentResourceId}`} // ✅ update route as needed
//             className="text-sm text-primary hover:underline truncate flex items-center gap-x-1 max-w-[180px]"
//             title={`Go to folder: ${folderName}`}
//           >
//             <FolderClosedIcon color="blue" size={18} /> {folderName}
//           </Link>
//         );
//       },
//     },
  
//     {
//       accessorKey: "metadata.mimetype",
//       header: "Type",
//       size: 150,
//       minSize: 120,
//       cell: ({ row }) => {
//         const type = row.original.metadata?.mimetype || row.original.type;
//         return (
//           <Badge variant="outline" className="capitalize">
//             {String(type).split("/").pop()}
//           </Badge>
//         );
//       },
//     },
//     {
//       accessorKey: "visibility",
//       header: "Visibility",
//       size: 130,
//       minSize: 120,
//       cell: ({ row }) => {
//         const visibility = row.getValue("visibility");
//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="gap-1 h-8 cursor-pointer"
//               >
//                 {String(visibility)}
//                 <ChevronDown className="h-4 w-4 opacity-50" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem>Public</DropdownMenuItem>
//               <DropdownMenuItem>Private</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       size: 150,
//       minSize: 120,
//       cell: ({ row }) => {
//         const status = row.getValue("status");
//         return (
//           <Badge
//             variant={status === "active" ? "default" : "secondary"}
//             className={`capitalize font-medium
//                   ${
//                     status === "active"
//                       ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
//                       : ""
//                   }
//                   ${
//                     status === "processing"
//                       ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
//                       : ""
//                   }
//                   ${
//                     status === "error"
//                       ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
//                       : ""
//                   }
//                   ${
//                     status === "inactive"
//                       ? "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
//                       : ""
//                   }
//                 `}
//           >
//             {String(status)}
//           </Badge>
//         );
//       },
//     },
//     {
//       accessorKey: "updatedAt",
//       header: "Last Modified",
//       size: 150,
//       minSize: 120,
//       cell: ({ row }) => (
//         <div className="text-muted-foreground">
//           {new Date(row.getValue("updatedAt")).toLocaleDateString()}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "createdAt",
//       header: "Created",
//       size: 150,
//       minSize: 120,
//       sortingFn: "datetime",
//       cell: ({ row }) => {
//         const dateStr = row.getValue("createdAt") as string;
//         const date = new Date(dateStr);
  
//         return isNaN(date.getTime()) ? (
//           <span className="text-muted-foreground">Invalid Date</span>
//         ) : (
//           date.toLocaleDateString("en-IN", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })
//         );
//       },
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <MoreVertical className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem className="flex items-center gap-2">
//               <Download className="h-4 w-4" />
//               Download
//             </DropdownMenuItem>
//             <DropdownMenuItem className="flex items-center gap-2">
//               <Share2 className="h-4 w-4" />
//               Share
//             </DropdownMenuItem>
//             <DropdownMenuItem className="flex items-center gap-2">
//               <Copy className="h-4 w-4" />
//               Copy Link
//             </DropdownMenuItem>
//             <DropdownMenuItem className="flex items-center gap-2 text-destructive">
//               <Trash2 className="h-4 w-4" />
//               Delete
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ),
//       size: 40,
//     },
//   ];
  
//   function getFileIcon(mimeType: string) {
//     if (mimeType.startsWith("image/"))
//       return <Image className="h-5 w-5 text-blue-500" />;
//     if (mimeType.startsWith("video/"))
//       return <Film className="h-5 w-5 text-purple-500" />;
//     if (mimeType.startsWith("audio/"))
//       return <Music className="h-5 w-5 text-green-500" />;
//     if (mimeType === "application/pdf")
//       return <FileText className="h-5 w-5 text-red-500" />;
//     return <File className="h-5 w-5 text-gray-500" />;
//   }
//   type ViewMode = "list" | "card";
  
//   const AssetsManagerTable = () => {
//     const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
//     const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
//     const { user, token } = useSelector((state: RootState) => state.auth);
//     const { activeBucket } = useSelector((state: RootState) => state.resource);
//     const [sorting, setSorting] = useState([
//       { id: "createdAt", desc: true }, // automatically sorted by latest created
//     ]);
  
//     const [allAssets, setAllAssets] = useState<Resource[]>([]);
//     const headerScrollRef = useRef<HTMLDivElement>(null);
//     const bodyScrollRef = useRef<HTMLDivElement>(null);
  
//     // Searching and view mode states
//     const [viewMode, setViewMode] = useState<ViewMode>("list");
//     const [searchQuery, setSearchQuery] = useState("");
//     const clearSearch = () => {
//       setSearchQuery("");
//     };
//     const [getAllAssets] = useLazyGetAllAssetsOfParticularAccountQuery();
  
//     const fetchAssets = async () => {
//       try {
//         const response = await getAllAssets({
//           accountId: user?.accountId,
//           token: token ?? "",
//           bucketId: activeBucket,
//           //   bucketId: activeBucket || 'a3a98955-e1df-474e-894e-f9cb5767f961'
//         }).unwrap();
  
//         if (response) {
//           setAllAssets(response);
//         }
//       } catch (error) {
//         console.error("Error fetching assets:", error);
//         setAllAssets([]);
//       }
//     };
  
//     useEffect(() => {
//       fetchAssets();
//     }, [activeBucket]);
  
//     const table = useReactTable({
//       data: allAssets,
//       columns,
//       state: {
//         rowSelection,
//         pagination: {
//           pageIndex: 0,
//           pageSize: 14,
//         },
//         sorting,
//       },
//       onRowSelectionChange: setRowSelection,
//       columnResizeMode,
//       getSortedRowModel: getSortedRowModel(),
//       getCoreRowModel: getCoreRowModel(),
//       getFilteredRowModel: getFilteredRowModel(),
//       getPaginationRowModel: getPaginationRowModel(),
//     });
  
//     const totalWidth = table.getTotalSize();
  
//     // Synchronize horizontal scrolling
//     const handleHeaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
//       if (bodyScrollRef.current) {
//         bodyScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
//       }
//     };
  
//     const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
//       if (headerScrollRef.current) {
//         headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
//       }
//     };
  
//     return (
//       <div className="mt-14 p-2">
//         <AnimatePresence>
//           <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//             <div className="flex items-center justify-between pb-2">
//               <div className="flex items-center gap-4 flex-1">
//                 <div className="relative w-full max-w-sm">
//                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     type="search"
//                     placeholder="Type to filter..."
//                     className="w-full pl-9 pr-9"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                   />
//                   {searchQuery && (
//                     <button
//                       onClick={clearSearch}
//                       className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//                 {/* <Button
//                           variant="outline"
//                           size="icon"
//                           onClick={handleRefresh}
//                           className="hidden sm:flex"
//                         >
//                           <RefreshCw
//                             className={cn("h-4 w-4", isRefreshing && "animate-spin")}
//                           />
//                           <span className="sr-only">Refresh</span>
//                         </Button> */}
//               </div>
  
//               <div className="flex items-center gap-2 ml-4">
//                 {/* <Tabs
//                           value={viewMode}
//                           onValueChange={(v) => setViewMode(v as ViewMode)}
//                           className="hidden sm:block"
//                         >
//                           <TabsList>
//                             <TabsTrigger value="list"   className="px-3 py-2 rounded-md transition-all dark:data-[state=active]:bg-zinc-600/70 dark:data-[state=active]:text-white"
//             >
//                               <List className="h-4 w-4 mr-1" />
//                               <span className="sr-only sm:not-sr-only sm:inline-block">
//                                 List
//                               </span>
//                             </TabsTrigger>
//                             <TabsTrigger value="card"    className="px-3 py-2 rounded-md transition-all dark:data-[state=active]:bg-zinc-600/70 dark:data-[state=active]:text-white"
//             >
//                               <Grid className="h-4 w-4 mr-1" />
//                               <span className="sr-only sm:not-sr-only sm:inline-block">
//                                 Card
//                               </span>
//                             </TabsTrigger>
                         
//                           </TabsList>
//                         </Tabs> */}
  
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" size="icon" className="sm:hidden">
//                       <LayoutGrid className="h-4 w-4" />
//                       <span className="sr-only">View</span>
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem onClick={() => setViewMode("list")}>
//                       <List className="h-4 w-4 mr-2" />
//                       List
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => setViewMode("card")}>
//                       <Grid className="h-4 w-4 mr-2" />
//                       Card
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
  
//                 <Button variant="outline" size="icon">
//                   <Settings className="h-4 w-4" />
//                   <span className="sr-only">Settings</span>
//                 </Button>
//                 {/* <Button variant="outline" size="icon"> */}
//                 {/* <Eye className="h-4 w-4" />
//                           <span className="sr-only">Preview</span> */}
//                 <AssetDrawer
//                   isIcon={false}
//                   asset={{
//                     imageUrl: "/Empty_State_Illustration_1.svg",
//                     location: "Home",
//                     format: "JPG",
//                     fileSize: "211.32 KB",
//                     dimensions: "1600 × 900",
//                     lastReplaced: "Apr 15, 2025 11:14 am",
//                     created: "Apr 15, 2025 11:14 am",
//                     tags: "tag1, tag2",
//                     description: "A sample asset image",
//                   }}
//                 />
  
//                 {/* </Button> */}
//               </div>
//             </div>
//           </header>
//           <motion.div className="flex flex-col h-[calc(100vh-7.8rem)] space-y-1 transition-all">
//             {/* Batch actions bar */}
//             <motion.div
//               initial={false}
//               animate={{
//                 height: table.getSelectedRowModel().rows.length > 0 ? "auto" : 0,
//                 opacity: table.getSelectedRowModel().rows.length > 0 ? 1 : 0,
//                 marginBottom:
//                   table.getSelectedRowModel().rows.length > 0 ? 16 : 0,
//               }}
//               transition={{ duration: 0.25, ease: "easeInOut" }}
//               className="overflow-hidden"
//             >
//               <div className="flex items-center gap-4  bg-muted/50 rounded-md">
//                 <div className="text-sm text-muted-foreground">
//                   {table.getSelectedRowModel().rows.length} resource(s) selected
//                 </div>
//                 <Button variant="outline" size="sm" className="h-8 gap-1">
//                   <Download className="h-4 w-4" />
//                   Download
//                 </Button>
//                 <Button variant="outline" size="sm" className="h-8 gap-1">
//                   <Share2 className="h-4 w-4" />
//                   Share
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-8 gap-1 text-destructive"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                   Delete
//                 </Button>
//               </div>
//             </motion.div>
  
//             {/* Table container */}
//             <div className="flex-1 overflow-hidden relative">
//               <motion.div
//                 transition={{ duration: 0.1, ease: "easeOut" }}
//                 className="rounded border border-[#e7e3e4] dark:border-zinc-500 h-full flex flex-col"
//               >
//                 {/* Header container with synchronized scroll */}
//                 <div className="sticky top-0 z-20 bg-background overflow-hidden ">
//                   <div
//                     ref={headerScrollRef}
//                     className="overflow-x-auto scrollbar-hide scrollable-hide-scrollbar"
//                     style={{
//                       width: "100%",
//                       overflowY: "hidden",
//                     }}
//                     onScroll={handleHeaderScroll}
//                   >
//                     <div style={{ minWidth: `${totalWidth}px` }}>
//                       <Table style={{ width: `${totalWidth}px` }}>
//                         <TableHeader>
//                           {table.getHeaderGroups().map((headerGroup) => (
//                             <TableRow key={headerGroup.id}>
//                               {headerGroup.headers.map((header) => (
//                                 <TableHead
//                                   key={header.id}
//                                   style={{
//                                     width: header.getSize(),
//                                     position: "relative",
//                                   }}
//                                   className="group bg-background"
//                                 >
//                                   {flexRender(
//                                     header.column.columnDef.header,
//                                     header.getContext()
//                                   )}
//                                   <div
//                                     onMouseDown={header.getResizeHandler()}
//                                     onTouchStart={header.getResizeHandler()}
//                                     className={`
//                                         absolute right-0 top-0 h-full w-1
//                                         bg-border cursor-col-resize select-none touch-none
//                                         hover:bg-primary hover:w-1.5 transition-transform
//                                         ${
//                                           header.column.getIsResizing()
//                                             ? "bg-primary w-1.5"
//                                             : ""
//                                         }
//                                       `}
//                                   />
//                                 </TableHead>
//                               ))}
//                             </TableRow>
//                           ))}
//                         </TableHeader>
//                       </Table>
//                     </div>
//                   </div>
//                 </div>
  
//                 {/* Body container with synchronized scroll */}
//                 <div
//                   ref={bodyScrollRef}
//                   className="flex-1 overflow-auto custom-scrollbar"
//                   onScroll={handleBodyScroll}
//                 >
//                   <div style={{ minWidth: `${totalWidth}px` }}>
//                     <Table style={{ width: `${totalWidth}px` }}>
//                       <TableBody>
//                         {table.getRowModel().rows?.length ? (
//                           table.getRowModel().rows.map((row) => (
//                             <TableRow
//                               key={row.id}
//                               data-state={row.getIsSelected() && "selected"}
//                             >
//                               {row.getVisibleCells().map((cell) => (
//                                 <TableCell
//                                   key={cell.id}
//                                   style={{
//                                     width: cell.column.getSize(),
//                                   }}
//                                 >
//                                   {flexRender(
//                                     cell.column.columnDef.cell,
//                                     cell.getContext()
//                                   )}
//                                 </TableCell>
//                               ))}
//                             </TableRow>
//                           ))
//                         ) : (
//                           <TableRow className="dark:bg-black dark:hover:bg-black">
//                             <TableCell
//                               colSpan={columns.length}
//                               className="h-24 text-center"
//                             >
//                               {/* {if no any assets available---------------------------------} */}
  
//                               <>
//                                 <motion.div
//                                   initial={{ opacity: 0, y: 20 }}
//                                   animate={{ opacity: 1, y: 0 }}
//                                   exit={{ opacity: 0, y: -20 }}
//                                   transition={{
//                                     duration: 0.4,
//                                     ease: "easeOut",
//                                   }}
//                                   className="w-full h-full min-h-[25rem] flex justify-center items-center"
//                                 >
//                                   <motion.div
//                                     className="flex flex-col items-center gap-4 p-6 dark:bg-zinc-900 bg-slate-100 rounded-lg w-full max-w-lg mx-auto"
//                                     transition={{ duration: 0.3, delay: 0.1 }}
//                                   >
//                                     <img
//                                       src="/Empty_State_Illustration_1.svg"
//                                       alt=""
//                                     />
//                                     <h2 className="text-lg font-semibold dark:text-slte-100">
//                                       Upload assets to this folder
//                                     </h2>
//                                     <motion.div
//                                       whileHover={{ scale: 1.05 }}
//                                       whileTap={{ scale: 0.95 }}
//                                     ></motion.div>
//                                   </motion.div>
//                                 </motion.div>
//                               </>
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
  
//             {/* Fixed Pagination */}
//             <div className="sticky bottom-0 z-20 bg-card border-t px-4 py-3 shadow-md">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                 <p className="text-sm font-medium text-foreground">
//                   Showing{" "}
//                   <span className="font-semibold text-primary">
//                     {table.getRowModel().rows.length}
//                   </span>{" "}
//                   of <span className="font-semibold">{allAssets.length}</span>{" "}
//                   resources
//                 </p>
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     size="sm"
//                     variant="secondary"
//                     onClick={() => table.previousPage()}
//                     disabled={!table.getCanPreviousPage()}
//                   >
//                     ⬅️ Previous
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="default"
//                     onClick={() => table.nextPage()}
//                     disabled={!table.getCanNextPage()}
//                   >
//                     Next ➡️
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     );
//   };
  
//   export default AssetsManagerTable;
  