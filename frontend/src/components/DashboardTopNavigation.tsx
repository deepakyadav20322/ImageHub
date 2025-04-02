import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useOutletContext } from "react-router";
import { Link } from "react-router";
const tabs = ["home", "assets", "folders", "collections", "moderation"];

// Type for context
interface SidebarContext {
  collapsed: boolean;
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
    // Access collapsed state from Outlet context
   
       const { collapsed } = useOutletContext<SidebarContext>(); 

  // Extract current tab from URL (default to 'home')
  const activeTab = location.pathname.split('/')[3] || 'home';

  const handleTabChange = (tab: string) => {
    navigate(`/dashboard/media/${tab.toLowerCase()}`);
  };

  return (

<div className={` transition-all duration-200 bg-white border-b shadow-sm px-6 py-3 fixed top-0 z-50 overflow-y-auto ${collapsed ? 'w-[calc(100%-5rem)]' : 'w-[calc(100%-18rem)]'} mb-1 `}>

<div className="flex justify-between items-center w-full">
       
      {/* Title */}
      <h1 className="text-lg font-semibold">Media_Library</h1>
      <div className="overflow-x-auto flex justify-between w-full gap-6 ">
      {/* Tab Navigation */}
      <div className="relative flex gap-4  ">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium transition capitalize cursor-pointer",
              activeTab === tab ? "text-blue-600" : "text-gray-600 hover:text-gray-800"
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
        <Link to={ `http://localhost:5173/dashboard/media/folders/2e79bc82-6434-43a6-bd3e-6e7046e1d562`}>Folder2(cust)</Link>
        <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-white">
          <UploadIcon className="w-4 h-4" /> Upload
        </Button>
      </div>
      </div>
      
      </div>
    </div>
   
  );
};

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export default Navbar;