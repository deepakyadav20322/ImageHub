import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router";
import { Link } from "react-router";
// import UploadDialog from "./UploadDialog";
import UploadDialog from "./UploadDialogComponents/UploadDialogMain";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Resource } from "@/lib/types";
import { useGetAssetsOfFolderQuery, useUploadAssetsMutation } from "@/redux/apiSlice/itemsApi";

const tabs = ["home", "assets", "folders", "collections", "moderation"];

// Type for context
interface SidebarContext {
  collapsed: boolean;
}


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bucketRootFolder = useSelector((state:RootState)=>state.items.bucketRootFolder) as Resource
  const {token,user} = useSelector((state:RootState)=>state.auth)
  // Access collapsed state from Outlet context
  const [uploadOpen, setUploadOpen] = useState(false);
  const { collapsed } = useOutletContext<SidebarContext>();
  const {folderId:currentopenOrSelectedFolder}  = useParams()

  // Extract current tab from URL (default to 'home')
  const activeTab = location.pathname.split("/")[3] || "home";
  const handleTabChange = (tab: string) => {
    navigate(`/dashboard/media/${tab.toLowerCase()}/${tab.toLowerCase()==="folders"?bucketRootFolder?.resourceId:""}`);
  };
  const { refetch} = useGetAssetsOfFolderQuery({folderId:currentopenOrSelectedFolder||bucketRootFolder?.resourceId, token:token || "" });
  
  const [uploadAssets,{isError}] = useUploadAssetsMutation()
  const handleUpload = async (formdata: FormData):Promise<any>  => {
    console.log("Files to upload:", formdata);
    console.log("Files to folder:", currentopenOrSelectedFolder, bucketRootFolder);
   
  
    try {
      const response = await uploadAssets({
        bucketName: (user?.accountId + "-original"),
        resourceType: "image",
        files: formdata,
        token: token || "",
        folderId :currentopenOrSelectedFolder || bucketRootFolder.resourceId
      }).unwrap(); // unwrap() is important for error handling
      
      console.log("Upload success:", response);
        // Close immediately
        refetch()
        return response 
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }
  
console.log("iserror",isError);
  return (
    <div
    // className={cn(
    //   "transition-all duration-200 fixed top-0 z-50 px-6 py-2 shadow-sm border-b overflow-y-auto mb-1",
    //   "bg-white text-black border-gray-200 overflow-x-auto",
    //   "dark:bg-[black] dark:text-white dark:border-zinc-700",
    //   (isMobile && collapsed)?"w-full overflow-x-auto":"",
    //   // collapsed ? "w-[calc(100%-4rem)]" : "lg:w-[calc(100%-15rem)] w-[calc(100%-4rem)]"
    //   collapsed ? "" : "lg:w-[calc(100%-15rem)]"
    // )}
    className={cn(
      "transition-transform duration-200 fixed top-0 z-45 lg:px-6 py-2 shadow-sm border-b mb-1",
      "bg-white text-black border-gray-200",
      "dark:bg-black dark:text-white dark:border-zinc-700",
      // Handle width
      collapsed ? "w-[calc(100%-2.5rem)]" :  "w-[calc(100%-0rem)] md:w-[calc(100%-1rem)] lg:w-[calc(100%-15rem)]",
      // Allow scrolling if content overflows
      "overflow-x-auto"
    )}
  
    >
      <div className={`flex justify-between items-center w-full px-2 pl-8 lg:pl-2 overflow-y-auto `}>
        {/* Title */}
        <h1 className="text-lg font-bold px-1 mr-2">
          <span className="hidden lg:block ">Media_Hub</span>
          <span className="lg:hidden ml-6">MI</span>
        </h1>
        <div className="overflow-x-auto flex justify-between w-full gap-6 no-scrollbar ">
          {/* Tab Navigation */}
          <div className="relative flex gap-4  ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition capitalize cursor-pointer  ",
                  activeTab === tab
                    ? "text-blue-600 bg-blue-200/40 rounded-tl-xs rounded-tr-xs dark:text-blue-400 dark:bg-blue-900/30 "
                    : "text-gray-600 dark:text-zinc-300 hover:text-gray-800 dark:hover:text-white"
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search & Upload */}
          <div className="ml-auto flex items-end gap-4">
           
            <Button onClick={()=>setUploadOpen(!uploadOpen)}  className="bg-blue-600 hover:bg-blue-700 cursor-pointer flex items-center gap-2 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
              <UploadIcon className="w-4 h-4" /> Upload
            </Button>
          </div>
        
        </div>
      </div>
      {/* <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        maxSizeMB={5}
        allowedTypes={["image/jpeg", "image/png","image/jpg","image/webp"]}
        multiple={true}
        maxFiles={5}
      /> */}

     <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        maxSizeMB={5}
        allowedTypes={["image/jpeg", "image/png","image/jpg","image/webp"]}
        multiple={true}
        maxFiles={5}
      />

    </div>
  );
};

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export default Navbar;
