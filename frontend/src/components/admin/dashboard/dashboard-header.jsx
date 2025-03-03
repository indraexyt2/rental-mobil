import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

const DashboardHeader = () => {
    return (
        <header className="flex items-center border-b p-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger />
            </div>
        </header>
    );
};

export default DashboardHeader;