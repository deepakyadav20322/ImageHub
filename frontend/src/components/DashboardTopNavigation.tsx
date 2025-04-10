import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { Link } from "react-router";
import UploadDialog from "./UploadDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Resource } from "@/lib/types";
import { useUploadAssetsMutation } from "@/redux/apiSlice/itemsApi";
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
  const [uploadAssets,{isError}] = useUploadAssetsMutation()

  // Extract current tab from URL (default to 'home')
  const activeTab = location.pathname.split("/")[3] || "home";

  const handleTabChange = (tab: string) => {
    navigate(`/dashboard/media/${tab.toLowerCase()}/${tab.toLowerCase()==="folders"?bucketRootFolder.resourceId:""}`);
  };

  const handleUpload = async (files: File[]) => {
    console.log("Files to upload:", files);
    const formData = new FormData();
  
    // Append each file - use 'files[]' if backend expects array
    files.forEach(file => formData.append('files', file)); // or 'files[]' based on backend
  
    // For debugging - this won't show in console but is correct
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      const response = await uploadAssets({
        bucketName: (user?.accountId + "-original"),
        resourceType: "image",
        files: formData,
        token: token || ""
      }).unwrap(); // unwrap() is important for error handling
      
      console.log("Upload success:", response);
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }
  
console.log("iserror",isError);
  return (
    <div
      className={` transition-all duration-200 bg-white border-b shadow-sm px-6 py-2 fixed top-0 z-50 overflow-y-auto ${
        collapsed
          ? "w-[calc(100%-4rem)]"
          : "lg:w-[calc(100%-15rem)] w-[calc(100%-4rem)] "
      } mb-1 `}
    >
      <div className="flex justify-between items-center w-full px-2">
        {/* Title */}
        <h1 className="text-lg font-bold px-1">
          <span className="hidden lg:block ">Media_Hub</span>
          <span className="lg:hidden">MI</span>
        </h1>
        <div className="overflow-x-auto flex justify-between w-full gap-6 no-scrollbar ">
          {/* Tab Navigation */}
          <div className="relative flex gap-4  ">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition capitalize cursor-pointer",
                  activeTab === tab
                    ? "text-blue-600 bg-blue-200/40 rounded-tl-xs rounded-tr-xs"
                    : "text-gray-600 hover:text-gray-800"
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
           
            <Button onClick={()=>setUploadOpen(!uploadOpen)} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-white">
              <UploadIcon className="w-4 h-4" /> Upload
            </Button>
          </div>
        
        </div>
      </div>
      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        maxSizeMB={5}
        allowedTypes={["image/jpeg", "image/png"]}
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
