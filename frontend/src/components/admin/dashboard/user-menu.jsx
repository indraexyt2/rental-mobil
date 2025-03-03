import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const UserMenu = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    return (
        <div className="relative p-4">
            <button
                onClick={toggleUserMenu}
                className="flex w-full items-center justify-between rounded-md p-2 hover:bg-sidebar-accent"
            >
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-slate-600">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-medium leading-none">Admin</p>
                        <p className="text-xs text-slate-500">admin@rental.com</p>
                    </div>
                </div>
                <ChevronDown className="h-4 w-4" />
            </button>

            {showUserMenu && (
                <div className="absolute bottom-full left-4 mb-2 w-[calc(100%-2rem)] rounded-md border border-slate-200 bg-white p-1 shadow-md">
                    <div className="py-1 px-2 text-xs font-medium text-slate-500">
                        Admin
                    </div>
                    <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                        <span>Pengaturan Akun</span>
                    </button>
                    <div className="my-1 h-px bg-slate-200"></div>
                    <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-500 hover:bg-red-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>Keluar</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;