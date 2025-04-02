import Navbar from '@/components/DashboardTopNavigation';
import React from 'react';
import { Outlet, useOutletContext } from 'react-router'; // ✅ Ensure correct import

interface MediaTopNavLayoutProps {
    children?: React.ReactNode;
}

// Type for context
interface SidebarContext {
    collapsed: boolean;
}

const MediaTopNavLayout: React.FC<MediaTopNavLayoutProps> = () => {
    // ✅ Use context inside the component
    const { collapsed } = useOutletContext<SidebarContext>(); 

    return (
        <div className={`w-full ${collapsed ? 'w-[calc(100%-2rem)]' : 'w-[calc(100%-4rem)]'} relative`}>
            <Navbar />
            <main className="media-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MediaTopNavLayout;
