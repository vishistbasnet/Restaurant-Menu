import { useEffect, useState } from "react";
import { ChevronDown, Store } from "lucide-react";

import { supabase } from "../../../lib/supabase";
import { useRestaurant } from "../../context/RestaurantContext";

interface AdminHeaderProps {
    onMenuClick: () => void;
}

type AdminRole =
    | "super_admin"
    | "admin"
    | "staff";

function AdminHeader({
    onMenuClick,
}: AdminHeaderProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] =
        useState<AdminRole | null>(null);

    const [isRestaurantMenuOpen, setIsRestaurantMenuOpen] =
        useState(false);

    const {
        restaurants,
        selectedRestaurant,
        selectRestaurant,
        isLoading,
    } = useRestaurant();

    useEffect(() => {
        async function loadUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user?.email) {
                setEmail(user.email);
            }

            if (!user) {
                return;
            }

            const {
                data: adminUser,
                error,
            } = await supabase
                .from("admin_users")
                .select("role")
                .eq("user_id", user.id)
                .maybeSingle();

            if (error) {
                console.error(
                    "Failed to load admin role:",
                    error
                );

                return;
            }

            setRole(
                (adminUser?.role as AdminRole) ??
                null
            );
        }

        void loadUser();
    }, []);

    function handleRestaurantSelect(
        restaurantId: string
    ) {
        selectRestaurant(restaurantId);
        setIsRestaurantMenuOpen(false);
    }

    const canSwitchRestaurants =
        role === "super_admin" &&
        restaurants.length > 1;

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-gray-950/90 px-4 backdrop-blur-xl sm:px-6">
            {/* Left */}
            <div className="flex min-w-0 items-center gap-3">
                {/* Mobile menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-gray-300 transition hover:bg-white/5 hover:text-white lg:hidden"
                >
                    ☰
                </button>

                {/* Page information */}
                <div className="hidden min-w-0 sm:block">
                    <p className="text-sm font-bold text-white">
                        Dashboard
                    </p>

                    <p className="truncate text-xs text-gray-500">
                        Manage your restaurant from one place
                    </p>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                {/* Restaurant Switcher */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => {
                            if (
                                canSwitchRestaurants
                            ) {
                                setIsRestaurantMenuOpen(
                                    (current) =>
                                        !current
                                );
                            }
                        }}
                        disabled={
                            isLoading ||
                            !selectedRestaurant ||
                            !canSwitchRestaurants
                        }
                        className={`flex max-w-[220px] items-center gap-2 rounded-xl border px-3 py-2 transition ${canSwitchRestaurants
                                ? "border-white/10 bg-white/[0.04] hover:border-yellow-400/30 hover:bg-white/[0.07]"
                                : "cursor-default border-white/10 bg-white/[0.02]"
                            }`}
                    >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
                            <Store className="h-4 w-4" />
                        </span>

                        <span className="hidden min-w-0 text-left md:block">
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                                Restaurant
                            </span>

                            <span className="block max-w-[130px] truncate text-xs font-bold text-gray-200">
                                {isLoading
                                    ? "Loading..."
                                    : selectedRestaurant?.name ??
                                    "No restaurant"}
                            </span>
                        </span>

                        {canSwitchRestaurants && (
                            <ChevronDown
                                className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${isRestaurantMenuOpen
                                        ? "rotate-180"
                                        : ""
                                    }`}
                            />
                        )}
                    </button>

                    {/* Dropdown */}
                    {isRestaurantMenuOpen &&
                        canSwitchRestaurants && (
                            <>
                                {/* Click-away */}
                                <button
                                    type="button"
                                    aria-label="Close restaurant selector"
                                    onClick={() =>
                                        setIsRestaurantMenuOpen(
                                            false
                                        )
                                    }
                                    className="fixed inset-0 z-40 cursor-default"
                                />

                                <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/40">
                                    <div className="border-b border-white/10 px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                                            Switch Restaurant
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Select the restaurant you want to manage.
                                        </p>
                                    </div>

                                    <div className="max-h-80 overflow-y-auto p-2">
                                        {restaurants.map(
                                            (
                                                restaurant
                                            ) => {
                                                const isSelected =
                                                    restaurant.id ===
                                                    selectedRestaurant?.id;

                                                return (
                                                    <button
                                                        key={
                                                            restaurant.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handleRestaurantSelect(
                                                                restaurant.id
                                                            )
                                                        }
                                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${isSelected
                                                                ? "bg-yellow-400 text-gray-950"
                                                                : "text-gray-300 hover:bg-white/5 hover:text-white"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isSelected
                                                                    ? "bg-gray-950/10"
                                                                    : "bg-white/5"
                                                                }`}
                                                        >
                                                            <Store className="h-4 w-4" />
                                                        </span>

                                                        <span className="min-w-0 flex-1">
                                                            <span
                                                                className={`block truncate text-sm font-bold ${isSelected
                                                                        ? "text-gray-950"
                                                                        : "text-gray-200"
                                                                    }`}
                                                            >
                                                                {
                                                                    restaurant.name
                                                                }
                                                            </span>

                                                            <span
                                                                className={`mt-0.5 block text-[11px] ${isSelected
                                                                        ? "text-gray-950/60"
                                                                        : "text-gray-600"
                                                                    }`}
                                                            >
                                                                {restaurant.is_active
                                                                    ? "Active"
                                                                    : "Disabled"}
                                                            </span>
                                                        </span>

                                                        {isSelected && (
                                                            <span className="text-xs font-black">
                                                                ✓
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                </div>

                {/* User */}
                <div className="hidden text-right sm:block">
                    <p className="text-xs text-gray-500">
                        Signed in as
                    </p>

                    <p className="max-w-48 truncate text-sm font-semibold text-gray-300">
                        {email || "Admin"}
                    </p>
                </div>

                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-sm font-bold text-yellow-400">
                    {email
                        ? email
                            .charAt(0)
                            .toUpperCase()
                        : "A"}
                </div>
            </div>
        </header>
    );
}

export default AdminHeader;