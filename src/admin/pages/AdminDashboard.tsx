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
        navigate("/admin/login", { replace: true });
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <header className="border-b border-white/10 bg-gray-950/95">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
                            Meal & Deal
                        </p>

                        <h1 className="text-xl font-black">
                            Admin Dashboard
                        </h1>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <div className="mb-8">
                    <p className="text-sm text-gray-500">
                        Signed in as
                    </p>

                    <p className="font-semibold text-gray-200">
                        {email || "Admin"}
                    </p>
                </div>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <p className="text-sm text-gray-500">
                            Menu
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            Manage Menu
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            Add, edit, and manage menu items.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <p className="text-sm text-gray-500">
                            Categories
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            Manage Categories
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            Organize your restaurant menu.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <p className="text-sm text-gray-500">
                            Restaurant
                        </p>

                        <h2 className="mt-2 text-xl font-bold">
                            Restaurant Settings
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            Manage restaurant information.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;