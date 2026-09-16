import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

function AdminDashboard() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    useEffect(() => {
        async function loadUser() {
            const { data } = await supabase.auth.getUser();

            if (data.user?.email) {
                setEmail(data.user.email);
            }
        }

        loadUser();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();

        navigate("/admin/login", {
            replace: true,
        });
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-yellow-400">
                        Overview
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                        Welcome back 👋
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Here's what's happening with Meal & Deal.
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-fit rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white"
                >
                    Sign Out
                </button>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-gray-500">
                        Restaurant
                    </p>

                    <p className="mt-2 text-xl font-black">
                        Meal & Deal
                    </p>

                    <p className="mt-1 text-xs text-green-400">
                        ● Active
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-gray-500">
                        Ordering
                    </p>

                    <p className="mt-2 text-xl font-black">
                        Pickup Only
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        No delivery
                    </p>
                </div>

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

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
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

                        <button
                            onClick={() =>
                                navigate("/admin/categories")
                            }
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

                        <button
                            onClick={() =>
                                navigate("/admin/settings")
                            }
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
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AdminDashboard;