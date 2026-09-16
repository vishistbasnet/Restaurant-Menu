import { NavLink } from "react-router-dom";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navigation = [
    {
        label: "Dashboard",
        path: "/admin",
        icon: "⌂",
    },
    {
        label: "Categories",
        path: "/admin/categories",
        icon: "▦",
    },
    {
        label: "Menu Items",
        path: "/admin/menu",
        icon: "☰",
    },
    {
        label: "Restaurant",
        path: "/admin/settings",
        icon: "⚙",
    },
];

function AdminSidebar({
    isOpen,
    onClose,
}: AdminSidebarProps) {
    return (
        <>
            {isOpen && (
                <button
                    aria-label="Close sidebar"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-gray-950 transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }`}
            >
                <div className="flex h-20 items-center border-b border-white/10 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-sm font-black text-gray-950">
                            M&D
                        </div>

                        <div>
                            <p className="text-sm font-black text-white">
                                Meal & Deal
                            </p>

                            <p className="text-xs text-gray-500">
                                Admin Panel
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 p-4">
                    <p className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-gray-600">
                        Management
                    </p>

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
                            <span className="flex h-7 w-7 items-center justify-center text-lg">
                                {item.icon}
                            </span>

                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-white/10 p-4">
                    <div className="rounded-xl bg-white/[0.04] p-4">
                        <p className="text-xs font-semibold text-gray-500">
                            Restaurant Status
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-400" />

                            <span className="text-sm font-semibold text-gray-300">
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default AdminSidebar;