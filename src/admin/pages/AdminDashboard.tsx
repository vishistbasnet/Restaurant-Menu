import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

interface RestaurantData {
    id: string;
    name: string;
    is_active: boolean;
    order_type: "pickup";
}

function AdminDashboard() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [restaurant, setRestaurant] =
        useState<RestaurantData | null>(null);
    const [isLoadingRestaurant, setIsLoadingRestaurant] =
        useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                setIsLoadingRestaurant(true);

                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (user?.email) {
                    setEmail(user.email);
                }

                if (!user) {
                    return;
                }

                /*
                 * Find the restaurant assigned to this admin.
                 */
                const { data: adminData, error: adminError } =
                    await supabase
                        .from("admin_users")
                        .select("restaurant_id")
                        .eq("user_id", user.id)
                        .maybeSingle();

                if (adminError) {
                    throw new Error(
                        `Failed to load admin access: ${adminError.message}`
                    );
                }

                if (!adminData) {
                    throw new Error(
                        "No restaurant is assigned to this admin account."
                    );
                }

                /*
                 * Load the current restaurant status.
                 *
                 * This is the same is_active value changed
                 * from Restaurant Settings.
                 */
                const { data: restaurantData, error: restaurantError } =
                    await supabase
                        .from("restaurants")
                        .select(
                            "id, name, is_active, order_type"
                        )
                        .eq("id", adminData.restaurant_id)
                        .single();

                if (restaurantError) {
                    throw new Error(
                        `Failed to load restaurant: ${restaurantError.message}`
                    );
                }

                setRestaurant(restaurantData as RestaurantData);
            } catch (error) {
                console.error("Failed to load dashboard:", error);
            } finally {
                setIsLoadingRestaurant(false);
            }
        }

        loadDashboard();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();

        navigate("/admin/login", {
            replace: true,
        });
    }

    const isActive = restaurant?.is_active ?? false;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-yellow-400">
                        Overview
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                        Welcome back 👋
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Here's what's happening with{" "}
                        {restaurant?.name ?? "your restaurant"}.
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-fit rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white"
                >
                    Sign Out
                </button>
            </div>

            {/* Overview Cards */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Restaurant */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-gray-500">
                        Restaurant
                    </p>

                    <p className="mt-2 text-xl font-black">
                        {isLoadingRestaurant
                            ? "Loading..."
                            : restaurant?.name ?? "Unknown"}
                    </p>

                    {!isLoadingRestaurant && restaurant && (
                        <p
                            className={`mt-1 text-xs font-semibold ${isActive
                                ? "text-green-400"
                                : "text-red-400"
                                }`}
                        >
                            {isActive
                                ? "● Active"
                                : "● Closed"}
                        </p>
                    )}
                </div>

                {/* Ordering */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-gray-500">
                        Ordering
                    </p>

                    <p className="mt-2 text-xl font-black">
                        Pickup Only
                    </p>

                    <p
                        className={`mt-1 text-xs font-semibold ${isActive
                            ? "text-green-400"
                            : "text-red-400"
                            }`}
                    >
                        {isActive
                            ? "Accepting orders"
                            : "Orders closed"}
                    </p>
                </div>

                {/* Menu */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-gray-500">
                        Menu
                    </p>

                    <p className="mt-2 text-xl font-black">
                        Manage Items
                    </p>

                    <button
                        onClick={() => navigate("/admin/menu")}
                        className="mt-2 text-xs font-semibold text-yellow-400 hover:underline"
                    >
                        Open menu →
                    </button>
                </div>

                {/* Categories */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-gray-500">
                        Categories
                    </p>

                    <p className="mt-2 text-xl font-black">
                        Organize Menu
                    </p>

                    <button
                        onClick={() =>
                            navigate("/admin/categories")
                        }
                        className="mt-2 text-xs font-semibold text-yellow-400 hover:underline"
                    >
                        Open categories →
                    </button>
                </div>
            </section>

            {/* Main Dashboard */}
            <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                {/* Quick Actions */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-yellow-400">
                            Quick Actions
                        </p>

                        <h2 className="mt-1 text-xl font-black">
                            Manage your restaurant
                        </h2>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {/* Manage Menu */}
                        <button
                            onClick={() => navigate("/admin/menu")}
                            className="rounded-2xl border border-white/10 bg-gray-900 p-5 text-left transition hover:border-yellow-400/30 hover:bg-gray-900/80"
                        >
                            <span className="text-2xl">🍽️</span>

                            <p className="mt-4 font-bold">
                                Manage Menu
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Add and update dishes, prices and availability.
                            </p>
                        </button>

                        {/* Manage Categories */}
                        <button
                            onClick={() => navigate("/admin/categories")}
                            className="rounded-2xl border border-white/10 bg-gray-900 p-5 text-left transition hover:border-yellow-400/30 hover:bg-gray-900/80"
                        >
                            <span className="text-2xl">📁</span>

                            <p className="mt-4 font-bold">
                                Manage Categories
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Organize your menu into clear sections.
                            </p>
                        </button>

                        {/* QR Code */}
                        <button
                            onClick={() => navigate("/admin/qr")}
                            className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.04] p-5 text-left transition hover:border-yellow-400/40 hover:bg-yellow-400/[0.08]"
                        >
                            <span className="text-2xl">📱</span>

                            <p className="mt-4 font-bold">
                                Menu QR Code
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Generate, download and print your customer menu QR code.
                            </p>

                            <p className="mt-3 text-xs font-semibold text-yellow-400">
                                Open QR Code →
                            </p>
                        </button>

                        {/* Settings */}
                        <button
                            onClick={() => navigate("/admin/settings")}
                            className="rounded-2xl border border-white/10 bg-gray-900 p-5 text-left transition hover:border-yellow-400/30 hover:bg-gray-900/80"
                        >
                            <span className="text-2xl">⚙️</span>

                            <p className="mt-4 font-bold">
                                Restaurant Settings
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Update restaurant information and ordering settings.
                            </p>
                        </button>

                        {/* Customer Menu */}
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-2xl border border-white/10 bg-gray-900 p-5 text-left transition hover:border-yellow-400/30 hover:bg-gray-900/80"
                        >
                            <span className="text-2xl">👀</span>

                            <p className="mt-4 font-bold">
                                View Customer Menu
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Preview what customers see.
                            </p>
                        </a>
                    </div>
                </div>

                {/* Admin Account */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                    <p className="text-sm font-semibold text-yellow-400">
                        Admin Account
                    </p>

                    <h2 className="mt-1 text-xl font-black">
                        Account Details
                    </h2>

                    <div className="mt-6 space-y-4">
                        <div>
                            <p className="text-xs text-gray-600">
                                Email
                            </p>

                            <p className="mt-1 break-all text-sm text-gray-300">
                                {email || "Loading..."}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-600">
                                Access
                            </p>

                            <p className="mt-1 text-sm font-semibold text-green-400">
                                ✓ Authorized Administrator
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-600">
                                Ordering Mode
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-300">
                                Pickup Only
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-600">
                                Restaurant Status
                            </p>

                            <p
                                className={`mt-1 text-sm font-semibold ${isActive
                                    ? "text-green-400"
                                    : "text-red-400"
                                    }`}
                            >
                                {isActive
                                    ? "● Accepting Orders"
                                    : "● Orders Closed"}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AdminDashboard;