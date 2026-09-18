import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../../lib/supabase";

import { getRestaurantSettings } from "../../services/settingsAdminService";

import {
    LayoutDashboard,
    FolderOpen,
    UtensilsCrossed,
    Settings,
    QrCode,
    Users,
    Building2,
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

type AdminRole = "super_admin" | "admin" | "staff";

interface NavigationItem {
    label: string;
    path: string;
    icon: typeof LayoutDashboard;
    allowedRoles: AdminRole[];
}

const navigation: NavigationItem[] = [
    {
        label: "Dashboard",
        path: "/admin",
        icon: LayoutDashboard,
        allowedRoles: ["super_admin", "admin", "staff"],
    },
    {
        label: "Categories",
        path: "/admin/categories",
        icon: FolderOpen,
        allowedRoles: ["super_admin", "admin", "staff"],
    },
    {
        label: "Menu Items",
        path: "/admin/menu",
        icon: UtensilsCrossed,
        allowedRoles: ["super_admin", "admin", "staff"],
    },
    {
        label: "Restaurant",
        path: "/admin/settings",
        icon: Settings,
        allowedRoles: ["super_admin", "admin"],
    },
    {
        label: "QR Code",
        path: "/admin/qr",
        icon: QrCode,
        allowedRoles: ["super_admin", "admin"],
    },
    {
        label: "User Management",
        path: "/admin/users",
        icon: Users,
        allowedRoles: ["super_admin"],
    },
    {
        label: "Restaurants",
        path: "/admin/restaurants",
        icon: Building2,
        allowedRoles: ["super_admin"],
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

    const [role, setRole] =
        useState<AdminRole | null>(null);

    const [isLoadingStatus, setIsLoadingStatus] =
        useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadSidebarData() {
            try {
                setIsLoadingStatus(true);

                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    if (isMounted) {
                        setRole(null);
                        setStatus(null);
                        setIsLoadingStatus(false);
                    }

                    return;
                }

                const {
                    data: adminUser,
                    error: roleError,
                } = await supabase
                    .from("admin_users")
                    .select("role")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (roleError) {
                    console.error(
                        "Failed to load admin role:",
                        roleError
                    );
                }

                if (isMounted) {
                    setRole(
                        (adminUser?.role as AdminRole) ?? null
                    );
                }

                /*
                 * Staff users should not need restaurant settings.
                 * The status card is therefore only loaded for
                 * admin and super_admin users.
                 */
                if (
                    adminUser?.role !== "admin" &&
                    adminUser?.role !== "super_admin"
                ) {
                    if (isMounted) {
                        setStatus(null);
                        setIsLoadingStatus(false);
                    }

                    return;
                }

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
                    "Failed to load sidebar:",
                    error
                );
            } finally {
                if (isMounted) {
                    setIsLoadingStatus(false);
                }
            }
        }

        void loadSidebarData();

        const interval = window.setInterval(
            loadSidebarData,
            30000
        );

        return () => {
            isMounted = false;
            window.clearInterval(interval);
        };
    }, []);

    const isRestaurantActive =
        status?.isActive ?? false;

    const visibleNavigation =
        role === null
            ? []
            : navigation.filter((item) =>
                item.allowedRoles.includes(role)
            );

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <button
                    type="button"
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
                                {role === "super_admin"
                                    ? "Super Admin Panel"
                                    : role === "admin"
                                        ? "Admin Panel"
                                        : role === "staff"
                                            ? "Staff Panel"
                                            : "Admin Panel"}
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
                        {visibleNavigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={
                                        item.path === "/admin"
                                    }
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive
                                            ? "bg-yellow-400 text-gray-950"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        }`
                                    }
                                >
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                                        <Icon className="h-5 w-5" />
                                    </span>

                                    <span>
                                        {item.label}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* Restaurant Status */}
                {(role === "admin" ||
                    role === "super_admin") && (
                        <div className="mt-auto shrink-0 border-t border-white/10 bg-gray-950 p-4">
                            <div
                                className={`rounded-2xl border p-4 ${isRestaurantActive
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
                                            className={`h-2 w-2 rounded-full ${isRestaurantActive
                                                ? "bg-green-400"
                                                : "bg-red-400"
                                                }`}
                                        />
                                    )}
                                </div>

                                {isLoadingStatus ? (
                                    <p className="mt-3 text-sm font-semibold text-gray-500">
                                        Loading status...
                                    </p>
                                ) : (
                                    <div className="mt-3">
                                        <p
                                            className={`text-sm font-bold ${isRestaurantActive
                                                ? "text-green-400"
                                                : "text-red-400"
                                                }`}
                                        >
                                            {isRestaurantActive
                                                ? "● Accepting Orders"
                                                : "● Orders Closed"}
                                        </p>

                                        {status && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {isRestaurantActive
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
                    )}
            </aside>
        </>
    );
}

export default AdminSidebar;