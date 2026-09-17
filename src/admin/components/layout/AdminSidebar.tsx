import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { getRestaurantSettings } from "../../services/settingsAdminService";
import {
    LayoutDashboard,
    FolderOpen,
    UtensilsCrossed,
    Settings,
    QrCode,
} from "lucide-react";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SidebarStatus {
    isActive: boolean;
    openingTime: string;
    closingTime: string;
}

const navigation = [
    {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Categories",
        path: "/admin/categories",
        icon: FolderOpen,
    },
    {
        label: "Menu Items",
        path: "/admin/menu",
        icon: UtensilsCrossed,
    },
    {
        label: "Restaurant",
        path: "/admin/settings",
        icon: Settings,
    },
    {
        label: "QR Code",
        path: "/admin/qr",
        icon: QrCode,
    },
];

function formatTime(time: string): string {
    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

function AdminSidebar({
    isOpen,
    onClose,
}: AdminSidebarProps) {
    const [status, setStatus] =
        useState<SidebarStatus | null>(null);

    const [isLoadingStatus, setIsLoadingStatus] =
        useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadStatus() {
            try {
                const restaurant =
                    await getRestaurantSettings();

                if (!isMounted) {
                    return;
                }

                setStatus({
                    isActive: restaurant.is_active,
                    openingTime: restaurant.opening_time,
                    closingTime: restaurant.closing_time,
                });
            } catch (error) {
                console.error(
                    "Failed to load restaurant status:",
                    error
                );
            } finally {
                if (isMounted) {
                    setIsLoadingStatus(false);
                }
            }
        }

        loadStatus();

        /*
         * Keep the sidebar status synchronized with
         * Restaurant Settings.
         */
        const interval = window.setInterval(
            loadStatus,
            30000
        );

        return () => {
            isMounted = false;
            window.clearInterval(interval);
        };
    }, []);

    const isActive = status?.isActive ?? false;

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <button
                    aria-label="Close sidebar"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-gray-950 transition-transform duration-300 lg:sticky lg:top-0 lg:z-40 lg:translate-x-0 ${isOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                    }`}
            >
                {/* Brand */}
                <div className="flex h-20 shrink-0 items-center border-b border-white/10 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-sm font-black text-gray-950">
                            M&D
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-black text-white">
                                Meal & Deal
                            </p>

                            <p className="text-xs text-gray-500">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="min-h-0 flex-1 overflow-y-auto p-4">
                    <p className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-gray-600">
                        Management
                    </p>

                    <div className="space-y-2">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/admin"}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                                        ? "bg-yellow-400 text-gray-950"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                                    <item.icon className="h-5 w-5" />
                                </span>

                                <span>
                                    {item.label}
                                </span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Fixed bottom status */}
                <div className="mt-auto shrink-0 border-t border-white/10 bg-gray-950 p-4">
                    <div
                        className={`rounded-2xl border p-4 ${isActive
                            ? "border-green-400/10 bg-green-400/[0.04]"
                            : "border-red-400/10 bg-red-400/[0.04]"
                            }`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Restaurant Status
                            </p>

                            {!isLoadingStatus && (
                                <span
                                    className={`h-2 w-2 rounded-full ${isActive
                                        ? "bg-green-400"
                                        : "bg-red-400"
                                        }`}
                                />
                            )}
                        </div>

                        {isLoadingStatus ? (
                            <div className="mt-3">
                                <p className="text-sm font-semibold text-gray-500">
                                    Loading status...
                                </p>
                            </div>
                        ) : (
                            <div className="mt-3">
                                <p
                                    className={`text-sm font-bold ${isActive
                                        ? "text-green-400"
                                        : "text-red-400"
                                        }`}
                                >
                                    {isActive
                                        ? "● Accepting Orders"
                                        : "● Orders Closed"}
                                </p>

                                {status && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        {isActive
                                            ? `Open ${formatTime(
                                                status.openingTime
                                            )} – ${formatTime(
                                                status.closingTime
                                            )}`
                                            : `Opens at ${formatTime(
                                                status.openingTime
                                            )}`}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

export default AdminSidebar;