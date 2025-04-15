import Navbar from '@/components/DashboardTopNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
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
    const isMobile  = useIsMobile()

    return (
        // <div className={`w-full ${collapsed && !isMobile ? 'w-[calc(100%-2rem)]' : 'w-[calc(100%-4rem)]'} relative`}>
        <div className={`w-full ${collapsed && isMobile ? 'w-full' : 'lg:w-[calc(100%)]'} relative`}>
            <Navbar />
            <main className="media-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MediaTopNavLayout;
