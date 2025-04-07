// import React, { useEffect, useState } from "react";
// import { Link } from "react-router";
// import {
//   Image,
//   Mail,
//   Radio,
//   Users,
//   BarChart2,
//   Globe,
//   FileText,
//   Code,
//   Settings,
//   Menu,
//   X,
//   ChevronRight,
//   ChevronDown,
//   Check,
//   Plus,
//   AlertCircle,
//   Crown,
//   // LogOut,
//   // CreditCard,
//   // User,
// } from "lucide-react";
// import ModeToggle from "./mode-toggle";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { Resource as Environment } from "@/lib/types";
// const teamData = {
//   name: "MediaHub Team",
//   avatar: "MH",
//   storage: "284 KB",
// };
// // interface Environment {
// //   id: string;
// //   name: string;
// //   isSelected: boolean;
// // }

// const navItems = [
//   { icon: Mail, label: "Getting Started", path: "/dashboard/getting-started" },
//   { icon: Image, label: "Assets", path: "dashboard/assets" },
//   { icon: Radio, label: "Broadcasts", path: "/broadcasts" },
//   { icon: Radio, label: "Media", path: "/dashboard/media/home" },
//   { icon: Users, label: "Audiences", path: "/audiences" },
//   { icon: BarChart2, label: "Metrics", path: "/metrics" },
//   { icon: Globe, label: "Domains", path: "/domains" },
//   { icon: FileText, label: "Logs", path: "/logs" },
//   { icon: Code, label: "API Keys", path: "/api-keys" },
//   { icon: Link as any, label: "Webhooks", path: "/webhooks" },
//   { icon: Settings, label: "Settings", path: "/settings" },
// ];

// interface ISidebarProps {
//   collapsed: boolean;
//   setCollapsed: (collapsed: boolean) => void;
// }

// const Sidebar = ({ collapsed, setCollapsed }:ISidebarProps)=> {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const toggleSidebar = () => setCollapsed(!collapsed);
//   const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
//   // environment tab
//   const [environmentDropdownOpen, setEnvironmentDropdownOpen] = useState(false);
//   const [createModalOpen, setCreateModalOpen] = useState(false);
//   const [environments, setEnvironments] = useState<Environment[] | []>([]);
//   const [formError, setFormError] = useState("");
//   // const [newEnvironmentName, setNewEnvironmentName] = useState(null);
//   const { user } = useSelector((state: any) => state.auth);

//   let {resources} = useSelector((state:RootState)=>state.resource)

//   // useEffect(() => {
//   //   console.log("why",resources)
//   //   if (resources && resources.length > 0) {
//   //     setEnvironments(resources);

//   //     resources.map((resource: Environment) => ({
//   //       resourceId: resource.resourceId,
//   //       name: resource.name,
//   //       isSelected: false // Default selection state
//   //     }))
//   //     console.log("hjhhjhj",resources[0].resourceId);
//   //     // Auto-select first environment if none selected
//   //     if (!environments.some(env => env.isSelected)) {
//   //       resources[0].isSelected = true;
//   //       selectEnvironment(resources[0].resourceId);
//   //     }
//   //   }
//   // }, [useSelector]);

//   useEffect(() => {
//     console.log("Current resources:", resources);
//     if (resources && resources.length > 0) {
//       // Create a new array with the modified objects
//       const mappedResources = resources.map((resource: Environment) => ({
//         ...resource,
//         isSelected: false // Default selection state
//       }));

//       setEnvironments(mappedResources);

//       console.log("First resource ID:", mappedResources[0].resourceId);

//       // Auto-select first environment if none selected
//       if (!environments.some(env => env.isSelected)) {
//         const firstResource = mappedResources[0];
//         selectEnvironment(firstResource.resourceId);

//         // Update the environments state with the selected resource
//         setEnvironments(prev => prev.map(env =>
//           env.resourceId === firstResource.resourceId
//             ? { ...env, isSelected: true }
//             : env
//         ));
//       }
//     }
//   }, [resources]); // Correct dependency array

//   const toggleEnvironmentDropdown = () =>
//     setEnvironmentDropdownOpen(!environmentDropdownOpen);

//   const openCreateModal = () => {
//     setCreateModalOpen(true);
//     setEnvironmentDropdownOpen(false);
//     // setNewEnvironmentName("");
//     setFormError("");
//   };

//   const closeCreateModal = () => {
//     setCreateModalOpen(false);
//   };

//   // const handleCreateEnvironment = (e: React.FormEvent) => {
//   //   e.preventDefault();

//   //   // if (!newEnvironmentName.trim()) {
//   //   //   setFormError("Environment name is required");
//   //   //   return;
//   //   // }

//   //   // Generate a random ID
//   //   const newId = Math.random().toString(36).substring(2, 10);

//   //   // Create new environment
//   //   const newEnvironment = {
//   //     id: newId,
//   //     name: newEnvironmentName,
//   //     isSelected: false,
//   //   };

//   //   console.log("New environment created:", newEnvironment);

//   //   // Add to environments list
//   //   setEnvironments([...environments, newEnvironment]);

//   //   // Close modal
//   //   closeCreateModal();
//   // };

//   const selectEnvironment = (id: string) => {
//     const updatedEnvironments = environments.map((env) => ({
//       ...env,
//       isSelected: env.resourceId === id,
//     }));

//     setEnvironments(updatedEnvironments);
//     setEnvironmentDropdownOpen(false);
//   };

//   return (
//     <>
//       <button
//         className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-black shadow-md lg:hidden"
//         onClick={toggleMobileSidebar}
//         aria-label="Toggle menu"
//       >
//         {mobileOpen ? (
//           <X size={20} className="text-gray-800 dark:text-gray-200" />
//         ) : (
//           <Menu size={20} className="text-gray-800 dark:text-gray-200" />
//         )}
//       </button>

//       {mobileOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={toggleMobileSidebar}
//         />
//       )}

//       <aside
//         className={`
//           fixed top-0 left-0 z-40 h-full bg-white dark:bg-black border-r dark:border-r-slate-400 border-gray-200 dark:border-black transition-transform duration-200
//           ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
//           ${collapsed ? "w-16" : "w-64"}
//           lg:translate-x-0

//         `}
//       >
//         <button
//           className="absolute -right-3 top-20 bg-white dark:bg-black border border-gray-200  dark:border-gray-100
//                     rounded-full p-1 shadow-md  lg:flex"
//           onClick={toggleSidebar}
//           aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           <ChevronRight
//             size={16}
//             className={`text-gray-800 dark:text-gray-200 ${
//               collapsed ? "" : "rotate-180"
//             }`}
//           />
//         </button>

//         <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-black">
//           <div className="flex items-center">
//             <Image className="w-6 h-6 mr-2 text-gray-800 dark:text-gray-200" />
//             {!collapsed && (
//               <h1 className="text-base font-medium text-gray-800 dark:text-gray-200">
//                 MediaHub
//               </h1>
//             )}
//           </div>

//           <ModeToggle />
//         </div>

//         {/* Environment Selector */}
//         <div className="px-2 py-3 border-b border-gray-200 dark:border-black">
//           {!collapsed ? (
//             <div className="relative">
//               <button
//                 onClick={toggleEnvironmentDropdown}
//                 className="w-full flex items-center justify-between px-2 py-1 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
//               >
//                 <div className="flex items-center">
//                   <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-md mr-2">
//                     DT
//                   </span>
//                   <span className="font-medium">
//                     {JSON.stringify(environments)}
//                     {environments.find((env) => env.isSelected)?.resourceId ||
//                       "Select environment"}
//                   </span>
//                 </div>
//                 <ChevronDown
//                   size={16}
//                   className={`transition-transform ${
//                     environmentDropdownOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {environmentDropdownOpen && (
//                 <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
//                   <div className="p-2 border-b border-gray-200 dark:border-gray-700">
//                     <h3 className="text-xs font-medium text-gray-800 dark:text-gray-300">
//                       Product environments
//                     </h3>
//                   </div>
//                   <ul className="max-h-60 overflow-auto">
//                     {environments.map((env) => (
//                       <li key={env.resourceId}>
//                         <button
//                           className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
//                           onClick={() => selectEnvironment(env.resourceId)}
//                         >
//                           <div className="flex items-center">
//                             <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-md mr-2">
//                               DT
//                             </span>
//                             <span className="font-medium">{env.name}</span>
//                           </div>
//                           {env.isSelected && (
//                             <Check size={16} className="text-blue-600" />
//                           )}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                   <div className="p-2 border-t border-gray-200 dark:border-gray-700">
//                     <button
//                       className="w-full flex items-center text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md cursor-not-allowed"
//                       onClick={openCreateModal}
//                       disabled
//                     >
//                       <Plus size={16} className="mr-2" />
//                       <span>Add a new environment</span>
//                       <span className="ml-auto flex items-center justify-center w-5 h-5 text-orange-400 rounded-full">
//                         <Crown />
//                       </span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <button
//               className="w-full flex justify-center"
//               onClick={toggleEnvironmentDropdown}
//             >
//               <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-xs font-medium rounded-md">
//                 DT
//               </span>
//             </button>
//           )}
//         </div>

//         <nav className="p-2">
//           <ul className="space-y-1">
//             {navItems.map((item, index) => (
//               <li key={index}>
//                 <Link
//                   to={item.path} // ✅ Ensures the 'to' prop is present
//                   className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md
//                      hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   <item.icon className="w-5 h-5 min-w-5" />
//                   {!collapsed && <span className="ml-3">{item.label}</span>}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         <div
//           className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-black
//                      bg-white dark:bg-black
//                      ${collapsed ? "items-center justify-center" : ""}`}
//         >
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <button

//                 className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-700 text-white
//                             flex items-center justify-center text-sm font-medium"
//               >
//                 {(user.firstName.charAt(0)).toUpperCase()}{(user?.lastName.charAt(0)).toUpperCase()}
//               </button>
//             </div>
//             {!collapsed && (
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
//                   {user?.email}
//                 </p>
//                 <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
//                   <span>Storage</span>
//                   <span className="ml-2">{teamData.storage}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
//                   <div className="bg-gray-800 dark:bg-gray-400 h-1 rounded-full w-1/4"></div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>
//       {/* Create Environment Modal */}
//       {createModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
//             <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//               <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//                 Create New Environment
//               </h2>
//               <button
//                 onClick={closeCreateModal}
//                 className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//              {/* { This use when we required to create new bucket and environment-----} */}
//             {/* <form onSubmit={handleCreateEnvironment}>
//               <div className="p-4">
//                 <div className="mb-6">
//                   <label
//                     htmlFor="environmentName"
//                     className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//                   >
//                     Environment Name
//                   </label>
//                   <input
//                     type="text"
//                     id="environmentName"
//                     value={newEnvironmentName}
//                     onChange={(e) => setNewEnvironmentName(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
//                     placeholder="Enter environment name"
//                   />
//                   {formError && (
//                     <div className="mt-2 flex items-center text-red-600 text-sm">
//                       <AlertCircle size={16} className="mr-1" />
//                       {formError}
//                     </div>
//                   )}
//                 </div>

//                 <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4">
//                   <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
//                     Key Instructions
//                   </h3>
//                   <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
//                     <li className="flex items-start">
//                       <span className="mr-2">•</span>
//                       <span>
//                         Environment names should be descriptive and unique
//                       </span>
//                     </li>
//                     <li className="flex items-start">
//                       <span className="mr-2">•</span>
//                       <span>
//                         Use environments to separate development, staging, and
//                         production
//                       </span>
//                     </li>
//                     <li className="flex items-start">
//                       <span className="mr-2">•</span>
//                       <span>
//                         Each environment has its own set of API keys and
//                         configurations
//                       </span>
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
//                 <button
//                   type="button"
//                   onClick={closeCreateModal}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   Create Environment
//                 </button>
//               </div>
//             </form> */}
//           </div>
//         </div>
//       )}

//     </>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Mail,
  Image,
  Radio,
  Users,
  BarChart2,
  Globe,
  FileText,
  Code,
  Settings,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  Crown,
  X,
  Menu,
  Key,
} from "lucide-react";
import ModeToggle from "./mode-toggle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Resource as Environment } from "@/lib/types";

const teamData = {
  name: "MediaHub Team",
  avatar: "MH",
  storage: "284 KB",
};

const navItems = [
  { icon: Mail, label: "Getting Started", path: "/dashboard/getting-started" },
  { icon: Image, label: "Assets", path: "dashboard/assets" },
  { icon: Radio, label: "Broadcasts", path: "/broadcasts" },
  { icon: Radio, label: "Media", path: "/dashboard/media/home" },
  { icon: Key, label: "API M", path: "settings/" },

  // { icon: BarChart2, label: "Metrics", path: "/metrics" },
  // { icon: Globe, label: "Domains", path: "/domains" },
  // { icon: FileText, label: "Logs", path: "/logs" },
  // { icon: Code, label: "API Keys", path: "/api-keys" },
  // { icon: Link as any, label: "Webhooks", path: "/webhooks" },
  // { icon: Settings, label: "Settings", path: "/settings" },
];

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/redux/features/authSlice";

interface ISidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onBucketSwitch: (bucketId: string) => void;
}

const Sidebar = ({
  collapsed,
  setCollapsed,
  onBucketSwitch,
}: ISidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [environmentDropdownOpen, setEnvironmentDropdownOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [formError, setFormError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  // This should match your resourceSlice state structure
  const resources = useSelector((state: RootState) => state.resource.bucket);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Initialize environments when resources load
  useEffect(() => {
    if (resources && resources.length > 0) {
      // Map resources to environments with isSelected property
      const mappedEnvironments = resources.map((resource, index) => ({
        ...resource,
        isSelected: index === 0, // Select first environment by default
      }));

      setEnvironments(mappedEnvironments);
    }
  }, [resources]);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);
  const toggleEnvironmentDropdown = () =>
    setEnvironmentDropdownOpen(!environmentDropdownOpen);

  const openCreateModal = () => {
    setCreateModalOpen(true);
    setEnvironmentDropdownOpen(false);
    setFormError("");
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const selectEnvironment = (bucketId: string) => {
    setEnvironments((prevEnvironments) =>
      prevEnvironments.map((env) => ({
        ...env,
        isSelected: env.resourceId === bucketId,
      }))
    );
    // this can change the active bucket Id value in redux store ersorces (to track which bucket is active)
    onBucketSwitch(bucketId);

    setEnvironmentDropdownOpen(false);
  };

  const selectedEnvironment = environments.find((env) => env.isSelected);

  // if (resourcesLoading) {
  //   return <div className="fixed top-0 left-0 z-40 h-full w-16 lg:w-64 bg-white dark:bg-black flex items-center justify-center">
  //     <div>Loading environments...</div>
  //   </div>;
  // }

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-black shadow-md lg:hidden"
        onClick={toggleMobileSidebar}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X size={20} className="text-gray-800 dark:text-gray-200" />
        ) : (
          <Menu size={20} className="text-gray-800 dark:text-gray-200" />
        )}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full bg-white dark:bg-black border-r dark:border-r-slate-400 border-gray-200 dark:border-black transition-transform duration-200 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          ${collapsed ? "w-16" : "w-64"} 
          lg:translate-x-0
        `}
      >
        <button
          className="absolute -right-3 top-20 bg-white dark:bg-black border border-gray-200 dark:border-gray-100 rounded-full p-1 shadow-md lg:flex"
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronRight
            size={16}
            className={`text-gray-800 dark:text-gray-200 ${
              collapsed ? "" : "rotate-180"
            }`}
          />
        </button>

        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-black">
          <div className="flex items-center">
            <Image className="w-6 h-6 mr-2 text-gray-800 dark:text-gray-200" />
            {!collapsed && (
              <h1 className="text-base font-medium text-gray-800 dark:text-gray-200">
                MediaHub
              </h1>
            )}
          </div>

          <ModeToggle />
        </div>

        {/* Environment Selector */}
        <div className="px-2 py-3 border-b border-gray-200 dark:border-black">
          {!collapsed ? (
            <div className="relative">
              <button
                onClick={toggleEnvironmentDropdown}
                className="w-full flex items-center justify-between px-2 py-1 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-md mr-2">
                    {selectedEnvironment?.name?.charAt(0) || "E"}
                  </span>
                  <span className="font-medium">
                    {selectedEnvironment?.name.split("-").pop() ||
                      "No environments"}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    environmentDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {environmentDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xs font-medium text-gray-800 dark:text-gray-300">
                      Product environments
                    </h3>
                  </div>
                  <ul className="max-h-60 overflow-auto">
                    {environments.map((env) => (
                      <li key={env.resourceId}>
                        <button
                          className="w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => selectEnvironment(env.resourceId)}
                        >
                          <div className="flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-md mr-2">
                              {env.name.charAt(0)}
                            </span>

                            <span className="font-medium">
                              {env.name.split("-").pop()}
                            </span>
                          </div>
                          {env.isSelected && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      className="w-full flex items-center text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md cursor-not-allowed"
                      onClick={openCreateModal}
                      disabled
                    >
                      <Plus size={16} className="mr-2" />
                      <span>Add a new environment</span>
                      <span className="ml-auto flex items-center justify-center w-5 h-5 text-orange-400 rounded-full">
                        <Crown />
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              className="w-full flex justify-center"
              onClick={toggleEnvironmentDropdown}
            >
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-xs font-medium rounded-md">
                {selectedEnvironment?.name?.charAt(0) || "E"}
              </span>
            </button>
          )}
        </div>

        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <item.icon className="w-5 h-5 min-w-5" />
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-black
                     bg-white dark:bg-black 
                     ${collapsed ? "items-center justify-center" : ""}`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* <button
              
                className="w-8 h-8 rounded-full bg-gray-900 dark:bg-gray-700 text-white 
                            flex items-center justify-center text-sm font-medium"
              >
                {user?.firstName?.charAt(0)?.toUpperCase()}
                {user?.lastName?.charAt(0)?.toUpperCase()}
              </button> */}
              {/* ------------------ */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className=" flex  text-sm items-center cursor-pointer">
                    <span
                      className=" rounded-full w-8 h-8 bg-gray-900 dark:bg-gray-700 text-white 
                            flex items-center justify-center text-sm font-medium"
                    >
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                      {user?.lastName?.charAt(0)?.toUpperCase()}
                    </span>
                    {!collapsed && (
                      <div className="ml-3 bg-white dark:bg-black">
                        <p className="text-sm font-medium  text-gray-800 dark:text-gray-200">
                          {user?.email}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <span>Storage</span>
                          <span className="ml-2">{teamData.storage}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                          <div className="bg-gray-800 dark:bg-gray-400 h-1 rounded-full w-1/4"></div>
                        </div>
                      </div>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 ml-2 dark:border-gray-300">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>GitHub</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuItem disabled>API</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <button
                      className="text-red-500 font-medium w-full text-start flex justify-between items-center cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                      <span>⇧⌘Q</span>
                    </button>
                    {/* <DropdownMenuShortcut className="text-red-400">⇧⌘Q</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.email}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Storage</span>
                  <span className="ml-2">{teamData.storage}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                  <div className="bg-gray-800 dark:bg-gray-400 h-1 rounded-full w-1/4"></div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </aside>

      {/* Create Environment Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Create New Environment
              </h2>
              <button
                onClick={closeCreateModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
