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
  AlertTriangle,
  FolderX,
  Folder,
  ChevronRight,
  ChevronLeft,
  FolderPlus,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import AssetCard from "./Assets-Card-View";
import AssetList from "./Assets-List-View";
import FolderTree, { FolderTreeData } from "./FolderTree";
import { Resource } from "@/lib/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  useCreateNewFolderMutation,
  useGetAssetsOfFolderQuery,
} from "@/redux/apiSlice/itemsApi";
import { setAssetsOfParticularFolder } from "@/redux/features/itemsSlice";
import { useParams } from "react-router";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import toast from "react-hot-toast";
import Breadcrumb from "./BreadCrumbFolder";
import { useIsMobile } from "@/hooks/use-mobile";
import AssetDrawer from "./AssetsInfoDrawer";

type ViewMode = "list" | "card";

interface FolderTreeProps {
  folders: FolderTreeData[]; // Changed from 'resources' to 'folders' to match your usage
}

const AssetManager = ({ folders }: FolderTreeProps) => {
  console.log("assets manager", folders);
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showSidebar, setShowSidebar] = useState(true);
  const [open, setOpen] = useState(false);
  const [allSelectedAssets, setAllSelectedAssets] = useState<Resource[]>([]);

  //   const [filteredAssets, setFilteredAssets] = useState(assets);
  // const [expandedFolders, setExpandedFolders] = useState<number[]>([1]);
  // const [selectedFolder, setSelectedFolder] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { folderId } = useParams();
  const { token } = useSelector((state: RootState) => state.auth);

  const {
    currentData: data,
    isLoading,
    isFetching,
    error,
  } = useGetAssetsOfFolderQuery(
    { folderId: folderId || "", token: token || "" },
    { refetchOnMountOrArgChange: true }
  );
  console.log(allSelectedAssets, "allselectedAssets");
  const reduxStateFolder = useSelector(
    (state: RootState) => state.items.folders
  );
  // console.log("AssetManager received folders:", folders);
  // console.log("Redux state folders:", reduxStateFolder);

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

  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (data) {
      dispatch(setAssetsOfParticularFolder(data));
    }
  }, [dispatch, data]);
  const { assets } = useSelector((state: RootState) => state.items) as { assets: Resource[] };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };
// =======================================================================================

const handleSelectAsset = (assetId: string, selected: boolean) => {
  if (selected) {
    const assetToAdd = assets.find((asset) => asset.resourceId === assetId)
    if (assetToAdd) {
      setAllSelectedAssets((prev) => [...prev, assetToAdd])
    }
  } else {
    setAllSelectedAssets((prev) => prev.filter((asset) => asset.resourceId !== assetId))
  }
}

const handleSelectAll = (selected: boolean) => {
  if (selected) {
    setAllSelectedAssets([...assets])
  } else {
    setAllSelectedAssets([])
  }
}

// =======================================================================================
  // const toggleFolder = (folderId: number) => {
  //   if (expandedFolders.includes(folderId)) {
  //     setExpandedFolders(expandedFolders.filter((id) => id !== folderId));
  //   } else {
  //     setExpandedFolders([...expandedFolders, folderId]);
  //   }
  // };

  // const selectFolder = (folderId: number) => {
  //   setSelectedFolder(folderId);
  // };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const [
    createNewFolder,
    { isLoading: isFolderCreateLoading, isError, error: errorData },
  ] = useCreateNewFolderMutation();

  const handleFolderCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Extract form data
    const formData = new FormData(e.currentTarget);
    const folderName = formData.get("name") as string;
    const parentFolderId = folderId || "";
    // Trim the name to avoid spaces-only input
    const trimmedName = folderName.trim();

    // Basic validations
    if (!trimmedName) {
      toast.error("Folder name cannot be empty!", {
        position: "bottom-center",
      });
      return;
    }

    if (trimmedName.length > 100) {
      toast.error("Folder name is too long (max 100 characters).", {
        position: "bottom-center",
      });
      return;
    }

    const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g;
    if (invalidChars.test(trimmedName)) {
      toast.error("Folder name contains invalid characters.", {
        position: "bottom-center",
      });
      return;
    }

    try {
      if (!token) {
        toast.error("User token is missing. Please log in again.", {
          position: "bottom-center",
        });
        return;
      }

      if (token) {
        const response = await createNewFolder({
          parentFolderId,
          folderName,
          visibility: "public",
          token,
        });

        if (response.data) {
          setOpen(false);
          toast.success("Folder create successful", {
            position: "bottom-center",
            duration: 4000,
          });
          console.log("folder response", response);
        }
        if (errorData && "data" in errorData) {
          toast.error((errorData.data as { message: string }).message);
        }
      }
    } catch (err: any) {
      if (err?.status === 400) {
        toast.error(err.message);
      }
      console.error("Failed to create folder:", err);
      alert(err.message);
    }
  };

  return (
    <div className="">
      {/* // folder creation button and search header for folder page */}
      <div className="flex flex-col gap-y-2 px-3">
        <div className="flex justify-start gap-x-4 ">
          {/* Bread crumb of current folder */}
          <Breadcrumb data={folders} currentFolderId={folderId || ""} />
          {/*  Create folder dialog----------*/}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] dark:border-slate-500">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-xl font-bold">
                  Create New Folder
                </DialogTitle>
                <DialogDescription className="text-base text-gray-500 dark:text-gray-300">
                  Create folder here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleFolderCreate}>
                <div className="pb-3">
                  <div className="flex flex-col items-start gap-y-2">
                    <Label htmlFor="name" className="text-left font-medium">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter folder name"
                      className={`w-full dark:border-gray-400 `}
                      autoComplete="off"
                      autoFocus
                    />
                  </div>
                </div>
                <DialogFooter>
                  {/* <DialogClose>
          <Button 
           key={'cancel-button-dialog'}
             type="button"
              className={`${isFolderCreateLoading ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white cursor-pointer`}
              disabled={isFolderCreateLoading}
            >
              Cancel
            </Button>
            </DialogClose> */}
                  <Button
                    type="submit"
                    className={`${
                      isFolderCreateLoading
                        ? "bg-gray-600 cursor-not-allowed hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    } text-white cursor-pointer`}
                    disabled={isFolderCreateLoading}
                  >
                    {isFolderCreateLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {/* ---------------------------------------------- */}

        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
          <div className="flex items-center justify-between pb-2">
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
                value={viewMode}
                onValueChange={(v) => setViewMode(v as ViewMode)}
                className="hidden sm:block"
              >
                <TabsList>
                  <TabsTrigger value="list"   className="px-3 py-2 rounded-md transition-all dark:data-[state=active]:bg-zinc-600/70 dark:data-[state=active]:text-white"
  >
                    <List className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      List
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="card"    className="px-3 py-2 rounded-md transition-all dark:data-[state=active]:bg-zinc-600/70 dark:data-[state=active]:text-white"
  >
                    <Grid className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      Card
                    </span>
                  </TabsTrigger>
                  {/* <TabsTrigger value="mosaic">
                    <LayoutGrid className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only sm:inline-block">
                      Mosaic
                    </span>
                  </TabsTrigger> */}
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
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
              {/* <Button variant="outline" size="icon"> */}
              {/* <Eye className="h-4 w-4" />
                <span className="sr-only">Preview</span> */}
              <AssetDrawer
                asset={{
                  imageUrl: "/Empty_State_Illustration_1.svg",
                  location: "Home",
                  format: "JPG",
                  fileSize: "211.32 KB",
                  dimensions: "1600 × 900",
                  lastReplaced: "Apr 15, 2025 11:14 am",
                  created: "Apr 15, 2025 11:14 am",
                  tags: "tag1, tag2",
                  description: "A sample asset image",
                }}
              />

              {/* </Button> */}
            </div>
          </div>
        </header>
      </div>

      <div className="flex flex-col ">
        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* folder section Sidebar view-------------*/}
          <div className="relative flex">
            {/* Toggle button at top-right */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowSidebar((prev) => !prev)}
                    className="absolute -right-3 top-2 z-50 p-1 bg-muted text-foreground dark:text-blue-500 hover:text-black dark:border-slate-500 border-[1px] transition rounded-full"
                  >
                    {showSidebar ? (
                      <ChevronLeft size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Folder Tree</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* AnimatePresence for sidebar */}
            <AnimatePresence initial={false}>
              {showSidebar ? (
                <motion.div
                  key="sidebar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-background"
                >
                  <ScrollArea className="h-[calc(100vh-10rem)] border-r dark:border-[#606e8f] dark:bg-[#0c0c0f]">
                    <div className="h-full">
                      <FolderTree folders={folders} />
                    </div>
                  </ScrollArea>
                </motion.div>
              ) : (
                // Mini folder icon on left when sidebar is closed
                <motion.div
                  key="mini"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 40, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className=" border-r dark:border-[#4a546b]  flex flex-col items-center py-4 mt-4"
                >
                  <Folder size={20} className=" text-blue-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                  {folders.length === 0 ||
                  !reduxStateFolder.find(
                    (folder: Resource) => folder.resourceId == folderId
                  ) ? (
                    <div className="min-h-[26rem] h-full w-full flex justify-center items-center">
                      <div className="flex justify-center items-center  max-w-[30rem] w-full flex-col bg-gray-50 p-6 rounded-lg  border border-gray-200">
                        <div className="bg-red-100 p-4 rounded-full mb-4">
                          <FolderX size={48} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                          Folder Not Found
                        </h3>
                        <p className="text-gray-600 mb-4">
                          The folder you are trying to access does not exist or
                          may have been deleted.
                        </p>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle
                            size={20}
                            className="text-yellow-500"
                          />
                          <span className="text-sm text-yellow-700">
                            Check the folder ID or contact support for
                            assistance.
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {isLoading ? ( // due to caching isloading only true at first time
                        <div className="flex justify-center items-center gap-2 w-full h-full min-h-[35vh]">
                          <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                          <span className="text-blue-500 text-lg">
                            Loading...
                          </span>
                        </div>
                      ) : (
                        <div className="max-h-[71vh] h-full overflow-aut">
                          {viewMode === "list" && (
                            <AssetList
                              assets={assets}
                              setAllSelectedAssets={setAllSelectedAssets}
                              allSelectedAssets={allSelectedAssets}
                            />
                          )}
                          {viewMode === "card" && (
                            // <AssetCard
                            //   assets={assets}
                            //   selectedAssets={allSelectedAssets.map(asset => asset.resourceId)}
                              
                            // />
                            <AssetCard
                            assets={assets}
                            selectedAssets={allSelectedAssets}
                            setAllSelectedAssets={setAllSelectedAssets}
                            onSelectAsset={handleSelectAsset}
                            onSelectAll={handleSelectAll}
                          />
                          
                     
                          )}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetManager;
