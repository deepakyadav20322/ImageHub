

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
  { icon: Image, label: "Media", path: "media" },
  { icon: Radio, label: "Broadcasts", path: "/broadcasts" },
  { icon: Radio, label: "Media", path: "/media/home" },
  { icon: Key, label: "Product Setting", path: "settings/product" },
  { icon: Key, label: "Account Setting", path: "settings/account" },
  { icon: Key, label: "Billing Plan", path: "settings/product/billing" },

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
import {motion} from 'framer-motion'

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
        className={`${"fixed top-2 left-3"} z-49 p-2 rounded-md bg-white dark:bg-black shadow-sm lg:hidden`}
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
          className="fixed inset-0 bg-zinc-900/90 bg-opacity-100 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <motion.aside
      
        className={`
          fixed top-0 left-0 z-40 h-full bg-white dark:bg-black border-r dark:border-r-slate-400 border-gray-200 dark:border-black transition-transform duration-200 
          ${mobileOpen ? "translate-x-0" : "-translate-x-[115%]"} 
          ${collapsed ? "w-16" : "w-64"} 
          lg:translate-x-0
        `}
      >
        <button
          className="absolute -right-3 top-20 bg-white dark:bg-black border border-gray-200 dark:border-gray-100 rounded-full p-1 shadow-md lg:flex cursor-pointer"
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
                <Link to={"/"}> MediaHub</Link>
              </h1>
            )}
          </div>
          <div className="">{!collapsed ? <ModeToggle /> : ""}</div>
        </div>

        {/* Environment Selector */}
        {/* <div className="px-2 py-3 border-b border-gray-200 dark:border-black">
          {!collapsed ? (
            <div className="relative p-1">
              <button
                onClick={toggleEnvironmentDropdown}
                className={`w-full flex items-center justify-between px-2 py-1 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer ${environmentDropdownOpen?'dark:bg-gray-800 bg-gray-100':''} `}
              >
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-md mr-2">
                    {(selectedEnvironment?.name?.charAt(0)) || "E"}
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
                <div className="absolute z-50 mt-1 w-[98%] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xs font-medium text-gray-800 dark:text-gray-300">
                      Product environments
                    </h3>
                  </div>
                  <ul className="max-h-60 overflow-auto cursor-pointer">
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
        </div> */}

<div className="px-2 py-3 border-b border-gray-200 dark:border-gray-800">
      {!collapsed ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between px-2 py-1 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer">
            <div className="flex items-center">
              <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-md mr-2">
                {(selectedEnvironment?.name?.charAt(0)) || "E"}
              </span>
              <span className="font-medium">
                {selectedEnvironment?.name.split("-").pop() || "No environments"}
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`transition-transform ${environmentDropdownOpen ? "rotate-180" : ""}`}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="mt-1 w-[98%] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <DropdownMenuLabel className="text-xs font-medium text-gray-800 dark:text-gray-300">
                Product environments
              </DropdownMenuLabel>
            </div>

            <ul className="max-h-60 overflow-auto cursor-pointer">
              {environments.map((env) => (
                <DropdownMenuItem
                  key={env.resourceId}
                  onClick={() => selectEnvironment(env.resourceId)}
                  className="flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800  cursor-pointer"
                >
                  <div className="flex items-center  ">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-md mr-2 ">
                      {env.name.charAt(0)}
                    </span>
                    <span className="font-medium">{env.name.split("-").pop()}</span>
                  </div>
                  {env.isSelected && <Check size={16} className="text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </ul>

            <div className=" p-1 border-t border-gray-200 dark:border-gray-700">
              <button
                className="w-full flex items-center text-sm text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md cursor-not-allowed"
                onClick={openCreateModal}
                disabled
              >
                <Plus size={16} className="mr-2" />
                <span className=" whitespace-pre mr-1">Add a new environment</span>
                <span className="ml-auto flex items-center justify-center w-5 h-5 text-orange-400 rounded-full">
                  <Crown />
                </span>
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
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
          className={`absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-black
                     bg-white dark:bg-black 
                     ${collapsed ? "items-center justify-center" : ""}`}
        >
          <div className="flex items-center flex-col w-full gap-y-3 py-2">
            <div className="border-b w-full text-center">
              {collapsed ? <ModeToggle /> : ""}
            </div>
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
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                          {user?.email}
                        </p>    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
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
      </motion.aside>

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
