import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const { data, error: loginError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

            if (loginError) {
                throw new Error(loginError.message);
            }

            if (!data.user) {
                throw new Error("Login failed. Please try again.");
            }

            const { data: adminUser, error: adminError } =
                await supabase
                    .from("admin_users")
                    .select("user_id, restaurant_id")
                    .eq("user_id", data.user.id)
                    .maybeSingle();

            if (adminError) {
                await supabase.auth.signOut();

                throw new Error(
                    "Unable to verify admin access. Please try again."
                );
            }

            if (!adminUser) {
                await supabase.auth.signOut();

                throw new Error(
                    "This account does not have admin access."
                );
            }

            setIsLoggedIn(true);

            navigate("/admin", {
                replace: true,
            });
        } catch (loginError) {
            setError(
                loginError instanceof Error
                    ? loginError.message
                    : "Something went wrong."
            );
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoggedIn) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 text-white">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-xl font-black text-gray-950">
                        M&D
                    </div>

                    <h1 className="text-3xl font-black">
                        Admin Login
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Manage your Meal & Deal menu
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl"
                >
                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-gray-300"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="admin@example.com"
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-gray-300"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-xl bg-yellow-400 px-4 py-3 font-bold text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-xs text-gray-600">
                    Meal & Deal • Admin Portal
                </p>
            </div>
        </div>
    );
}

export default AdminLogin;