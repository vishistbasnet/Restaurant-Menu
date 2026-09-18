import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

import {
    RestaurantProvider,
} from "../../context/RestaurantContext";

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] =
        useState(false);

    return (
        <RestaurantProvider>
            <div className="min-h-screen w-full overflow-x-hidden bg-gray-950 text-white">
                <div className="flex min-h-screen w-full min-w-0">
                    {/* Sidebar */}
                    <AdminSidebar
                        isOpen={
                            isSidebarOpen
                        }
                        onClose={() =>
                            setIsSidebarOpen(
                                false
                            )
                        }
                    />

                    {/* Main application */}
                    <div className="flex min-w-0 flex-1 flex-col bg-gray-950">
                        <AdminHeader
                            onMenuClick={() =>
                                setIsSidebarOpen(
                                    true
                                )
                            }
                        />

                        <main className="min-w-0 flex-1 overflow-x-hidden bg-gray-950">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
        </RestaurantProvider>
    );
}

export default AdminLayout;