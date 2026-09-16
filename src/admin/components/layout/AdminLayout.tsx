import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="flex min-h-screen">
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <AdminHeader
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />

                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;