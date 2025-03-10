import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import { useState } from "react";

const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main Content - Add margin based on sidebar state */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"} p-4`}>
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
