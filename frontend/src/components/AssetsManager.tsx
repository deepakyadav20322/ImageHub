import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  Grid,
  List,
  LayoutGrid,
  Settings,
  Eye,
  X,
  FolderDotIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildFolderTree, cn } from "@/lib/utils";

import AssetCard from "./Assets-Card-View";
import AssetList from "./Assets-List-View";
import AssetMosaic from "./Assets-Mosaic-View";
import FolderTree, { FolderTreeData } from "./FolderTree";
import { Resource } from "@/lib/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetAssetsOfFolderQuery } from "@/redux/apiSlice/itemsApi";
import { setAssetsOfParticularFolder } from "@/redux/features/itemsSlice";
import { useParams } from "react-router";
// import { AssetCard } from "./asset-card"
// import { AssetList } from "./asset-list"

// import { AssetMosaic } from "./asset-mosaic"
// import { FolderTree } from "./folder-tree"

// // Sample data
// const folders = [
//   { id: 1, name: "Home", path: "/", items: 8 },
//   { id: 2, name: "Images", path: "/images", items: 12 },
//   { id: 3, name: "Documents", path: "/documents", items: 5 },
//   { id: 4, name: "Projects", path: "/projects", items: 3 },
// ]


type ViewMode = "list" | "card" | "mosaic";


interface FolderTreeProps {
    folders: FolderTreeData[] ; // Changed from 'resources' to 'folders' to match your usage
  }

const AssetManager = ({folders}:FolderTreeProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showSidebar, setShowSidebar] = useState(true);
//   const [filteredAssets, setFilteredAssets] = useState(assets);
  const [expandedFolders, setExpandedFolders] = useState<number[]>([1]);
  const [selectedFolder, setSelectedFolder] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();
const {folderId} = useParams();
  const {token} = useSelector((state:RootState)=>state.auth)
  
  const {data,isLoading} = useGetAssetsOfFolderQuery({folderId: folderId || '',token:token || ''})
  // Filter assets based on search query
  //   useEffect(() => {
  //     if (searchQuery.trim() === "") {
  //       setFilteredAssets(
  //         assets.filter(
  //           (asset) => selectedFolder === 1 || asset.folder === folders.find((f) => f.id === selectedFolder)?.name,
  //         ),
  //       )
  //     } else {
  //       setFilteredAssets(
  //         assets.filter(
  //           (asset) =>
  //             asset.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //             (selectedFolder === 1 || asset.folder === folders.find((f) => f.id === selectedFolder)?.name),
  //         ),
  //       )
  //     }
  //   }, [searchQuery, selectedFolder])
  useEffect(()=>{
      if(data){
          dispatch(setAssetsOfParticularFolder(data))
        }
        
    },[dispatch,data])
    const assets = useSelector((state: RootState) => state.items.assets);



  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const toggleFolder = (folderId: number) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(expandedFolders.filter((id) => id !== folderId));
    } else {
      setExpandedFolders([...expandedFolders, folderId]);
    }
  };

  const selectFolder = (folderId: number) => {
    setSelectedFolder(folderId);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Type to filter..."
                className="w-full pl-9 pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="hidden sm:flex"
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Tabs
              defaultValue={viewMode}
              onValueChange={(v) => setViewMode(v as ViewMode)}
              className="hidden sm:block"
            >
              <TabsList>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">
                    List
                  </span>
                </TabsTrigger>
                <TabsTrigger value="card">
                  <Grid className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">
                    Card
                  </span>
                </TabsTrigger>
                <TabsTrigger value="mosaic">
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">
                    Mosaic
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewMode("list")}>
                  <List className="h-4 w-4 mr-2" />
                  List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("card")}>
                  <Grid className="h-4 w-4 mr-2" />
                  Card
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode("mosaic")}>
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Mosaic
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
              <span className="sr-only">Preview</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* folder section Sidebar */}
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r bg-background h-full overflow-hidden"
            >
              {/* This is for folder view --------------------------------- */}
              <ScrollArea className="">
                <div className="">
                  <FolderTree
                    folders={(folders)}
                  />
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="mb-6">
              {/* <h2 className="text-2xl font-semibold tracking-tight">
                {selectedFolder === 1 ? "All Assets" : folders.find((f) => f.id === selectedFolder)?.name}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({filteredAssets.length} {filteredAssets.length === 1 ? "item" : "items"})
                </span>
              </h2> */}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === "list" && <AssetList assets={assets} />}
                {/* {viewMode === "card" && <AssetCard assets={filteredAssets} />}
                {viewMode === "mosaic" && <AssetMosaic assets={filteredAssets} />} */}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetManager;
