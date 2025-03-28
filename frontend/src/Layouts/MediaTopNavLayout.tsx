import Navbar from '@/components/DashboardTopNavigation';
import React from 'react';
import { Outlet } from 'react-router';

interface MediaTopNavLayoutProps {
    children?: React.ReactNode;
}

const MediaTopNavLayout: React.FC<MediaTopNavLayoutProps> = () => {
    return (<div>
          <Navbar/>
                   <main className="media-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MediaTopNavLayout;