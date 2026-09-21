import {
    useCallback,
    useEffect,
    useState,
} from "react";
import type { FormEvent } from "react";

import {
    Check,
    Edit3,
    Loader2,
    Trash2,
    UserPlus,
    Users,
    X,
} from "lucide-react";

import {
    FunctionsFetchError,
    FunctionsHttpError,
    FunctionsRelayError,
} from "@supabase/supabase-js";

import { supabase } from "../../lib/supabase";

interface Restaurant {
    id: string;
    name: string;
}

interface AdminUser {
    id: string;
    user_id: string;
    email: string | null;
    restaurant_id: string;
    restaurant_name: string | null;
    role: "super_admin" | "admin" | "staff";
    is_active: boolean;
    created_at: string;
}

type EditableRole = "admin" | "staff";

function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const [processingUserId, setProcessingUserId] =
        useState<string | null>(null);

    const [currentUserId, setCurrentUserId] =
        useState<string | null>(null);

    const [editingUser, setEditingUser] =
        useState<AdminUser | null>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [restaurantId, setRestaurantId] = useState("");
    const [role, setRole] = useState<EditableRole>("admin");

    const [editRestaurantId, setEditRestaurantId] =
        useState("");

    const [editRole, setEditRole] =
        useState<EditableRole>("admin");

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] =
        useState<string | null>(null);

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    /*
     * ---------------------------------------------------------
     * LOAD ADMIN USERS
     * ---------------------------------------------------------
     */

    const loadAdminUsers = useCallback(async () => {
        const {
            data,
            error: rpcError,
        } = await supabase.rpc(
            "get_admin_users_for_super_admin"
        );

        if (rpcError) {
            throw new Error(rpcError.message);
        }

        setUsers(
            (data ?? []) as AdminUser[]
        );
    }, []);

    /*
     * ---------------------------------------------------------
     * LOAD RESTAURANTS
     * ---------------------------------------------------------
     */

    const loadRestaurants = useCallback(async () => {
        const {
            data,
            error: restaurantError,
        } = await supabase
            .from("restaurants")
            .select("id, name")
            .order("name");

        if (restaurantError) {
            throw new Error(
                restaurantError.message
            );
        }

        setRestaurants(
            (data ?? []) as Restaurant[]
        );
    }, []);

    /*
     * ---------------------------------------------------------
     * LOAD EVERYTHING
     * ---------------------------------------------------------
     */

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            await Promise.all([
                loadAdminUsers(),
                loadRestaurants(),
            ]);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load administrator accounts."
            );
        } finally {
            setIsLoading(false);
        }
    }, [
        loadAdminUsers,
        loadRestaurants,
    ]);

    /*
     * ---------------------------------------------------------
     * INITIAL LOAD
     * ---------------------------------------------------------
     */

    useEffect(() => {
        let cancelled = false;

        async function initialize() {
            try {
                const {
                    data: {
                        session,
                    },
                } = await supabase.auth.getSession();

                if (
                    session?.user?.id &&
                    !cancelled
                ) {
                    setCurrentUserId(
                        session.user.id
                    );
                }

                if (!cancelled) {
                    await loadData();
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load administrator accounts."
                    );

                    setIsLoading(false);
                }
            }
        }

        void initialize();

        return () => {
            cancelled = true;
        };
    }, [loadData]);

    /*
     * ---------------------------------------------------------
     * CREATE USER
     * ---------------------------------------------------------
     */

    async function handleCreateUser(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        clearMessages();

        const cleanEmail =
            email.trim().toLowerCase();

        if (!cleanEmail) {
            setError("Email is required.");
            return;
        }

        if (password.length < 8) {
            setError(
                "Password must be at least 8 characters."
            );
            return;
        }

        if (!restaurantId) {
            setError(
                "Please select a restaurant."
            );
            return;
        }

        setIsCreating(true);

        try {
            const {
                data: {
                    session,
                },
            } =
                await supabase.auth.getSession();

            if (!session) {
                throw new Error(
                    "Your session has expired."
                );
            }

            const {
                data,
                error: functionError,
            } =
                await supabase.functions.invoke(
                    "create-admin-user",
                    {
                        body: {
                            email: cleanEmail,
                            password,
                            restaurant_id:
                                restaurantId,
                            role,
                        },
                    }
                );

            if (functionError) {
                console.error(
                    "CREATE ADMIN ERROR:",
                    functionError
                );

                if (
                    functionError instanceof
                    FunctionsHttpError
                ) {
                    let details =
                        "Unknown Edge Function error.";

                    try {
                        const body =
                            await functionError.context.json();

                        details =
                            body?.error ??
                            body?.message ??
                            JSON.stringify(body);
                    } catch {
                        details =
                            functionError.message;
                    }

                    throw new Error(
                        `create-admin-user failed: ${details}`
                    );
                }

                if (
                    functionError instanceof
                    FunctionsRelayError
                ) {
                    throw new Error(
                        `Edge Function relay error: ${functionError.message}`
                    );
                }

                if (
                    functionError instanceof
                    FunctionsFetchError
                ) {
                    throw new Error(
                        `Could not reach Edge Function: ${functionError.message}`
                    );
                }

                throw new Error(
                    functionError.message
                );
            }

            if (data?.error) {
                throw new Error(
                    data.error
                );
            }

            setSuccess(
                `${role === "admin"
                    ? "Admin"
                    : "Staff"
                } account created successfully.`
            );

            setEmail("");
            setPassword("");
            setRestaurantId("");
            setRole("admin");

            await loadAdminUsers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create user."
            );
        } finally {
            setIsCreating(false);
        }
    }

    /*
     * ---------------------------------------------------------
     * OPEN EDIT
     * ---------------------------------------------------------
     */

    function openEditUser(
        user: AdminUser
    ) {
        clearMessages();

        setEditingUser(user);
        setEditRestaurantId(
            user.restaurant_id
        );

        setEditRole(
            user.role === "staff"
                ? "staff"
                : "admin"
        );
    }

    /*
     * ---------------------------------------------------------
     * CLOSE EDIT
     * ---------------------------------------------------------
     */

    function closeEditUser() {
        if (processingUserId) {
            return;
        }

        setEditingUser(null);
        setEditRestaurantId("");
        setEditRole("admin");
    }

    /*
     * ---------------------------------------------------------
     * UPDATE USER
     * ---------------------------------------------------------
     */

    async function handleUpdateUser() {
        if (!editingUser) {
            return;
        }

        clearMessages();

        if (!editRestaurantId) {
            setError(
                "Please select a restaurant."
            );
            return;
        }

        setProcessingUserId(
            editingUser.user_id
        );

        try {
            const {
                data,
                error: functionError,
            } =
                await supabase.functions.invoke(
                    "manage-admin-user",
                    {
                        body: {
                            action: "update",
                            user_id:
                                editingUser.user_id,
                            restaurant_id:
                                editRestaurantId,
                            role: editRole,
                        },
                    }
                );

            if (functionError) {
                throw new Error(
                    functionError.message
                );
            }

            if (data?.error) {
                throw new Error(
                    data.error
                );
            }

            setSuccess(
                "User updated successfully."
            );

            closeEditUser();

            await loadAdminUsers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update user."
            );
        } finally {
            setProcessingUserId(null);
        }
    }

    /*
     * ---------------------------------------------------------
     * TOGGLE USER
     * ---------------------------------------------------------
     */

    async function handleToggleUser(
        user: AdminUser
    ) {
        if (
            user.user_id ===
            currentUserId
        ) {
            setError(
                "You cannot deactivate your own account."
            );
            return;
        }

        clearMessages();

        setProcessingUserId(
            user.user_id
        );

        try {
            const {
                data,
                error: functionError,
            } =
                await supabase.functions.invoke(
                    "manage-admin-user",
                    {
                        body: {
                            action: "toggle",
                            user_id:
                                user.user_id,
                            is_active:
                                !user.is_active,
                        },
                    }
                );

            if (functionError) {
                throw new Error(
                    functionError.message
                );
            }

            if (data?.error) {
                throw new Error(
                    data.error
                );
            }

            setSuccess(
                user.is_active
                    ? "User deactivated successfully."
                    : "User activated successfully."
            );

            await loadAdminUsers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update user status."
            );
        } finally {
            setProcessingUserId(null);
        }
    }

    /*
     * ---------------------------------------------------------
     * DELETE USER
     * ---------------------------------------------------------
     */

    async function handleDeleteUser(
        user: AdminUser
    ) {
        if (
            user.user_id ===
            currentUserId
        ) {
            setError(
                "You cannot delete your own account."
            );
            return;
        }

        const confirmed =
            window.confirm(
                `Delete this ${user.role} account?\n\nThis will permanently remove the user's administrator access.`
            );

        if (!confirmed) {
            return;
        }

        clearMessages();

        setProcessingUserId(
            user.user_id
        );

        try {
            const {
                data,
                error: functionError,
            } =
                await supabase.functions.invoke(
                    "manage-admin-user",
                    {
                        body: {
                            action: "delete",
                            user_id:
                                user.user_id,
                        },
                    }
                );

            if (functionError) {
                throw new Error(
                    functionError.message
                );
            }

            if (data?.error) {
                throw new Error(
                    data.error
                );
            }

            setSuccess(
                "User deleted successfully."
            );

            await loadAdminUsers();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete user."
            );
        } finally {
            setProcessingUserId(null);
        }
    }

    /*
     * ---------------------------------------------------------
     * RENDER
     * ---------------------------------------------------------
     */

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            <div className="mb-8">
                <p className="text-sm font-semibold text-yellow-400">
                    Super Admin
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
                    User Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                    Create and manage administrator
                    accounts across your restaurants.
                </p>
            </div>

            {error && (
                <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setError(null)
                        }
                        className="shrink-0 text-red-300 transition hover:text-white"
                        aria-label="Close error"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">
                    <span>{success}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess(null)
                        }
                        className="shrink-0 text-green-300 transition hover:text-white"
                        aria-label="Close success"
                    >
                        <Check className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">

                {/* CREATE USER */}

                <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400">
                            <UserPlus className="h-6 w-6 text-gray-950" />
                        </div>

                        <div>
                            <h2 className="font-black text-white">
                                Create User
                            </h2>

                            <p className="text-sm text-gray-500">
                                Admin or staff account
                            </p>
                        </div>

                    </div>

                    <form
                        onSubmit={handleCreateUser}
                        className="space-y-4"
                    >

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-400">
                                Email
                            </label>

                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                placeholder="admin@example.com"
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400/50"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-400">
                                Temporary Password
                            </label>

                            <input
                                type="password"
                                required
                                minLength={8}
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                placeholder="Minimum 8 characters"
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400/50"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-400">
                                Restaurant
                            </label>

                            <select
                                required
                                value={restaurantId}
                                onChange={(event) =>
                                    setRestaurantId(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                            >
                                <option value="">
                                    Select restaurant
                                </option>

                                {restaurants.map(
                                    (restaurant) => (
                                        <option
                                            key={
                                                restaurant.id
                                            }
                                            value={
                                                restaurant.id
                                            }
                                        >
                                            {
                                                restaurant.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-400">
                                Role
                            </label>

                            <select
                                value={role}
                                onChange={(event) =>
                                    setRole(
                                        event.target
                                            .value as EditableRole
                                    )
                                }
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                            >
                                <option value="admin">
                                    Admin
                                </option>

                                <option value="staff">
                                    Staff
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isCreating ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <UserPlus className="h-4 w-4" />
                            )}

                            {isCreating
                                ? "Creating..."
                                : "Create User"}
                        </button>

                    </form>
                </section>

                {/* ADMIN USERS */}

                <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                            <Users className="h-5 w-5 text-white" />
                        </div>

                        <div>
                            <h2 className="font-black text-white">
                                Administrator Accounts
                            </h2>

                            <p className="text-xs text-gray-500">
                                {users.length}{" "}
                                account
                                {users.length === 1
                                    ? ""
                                    : "s"}
                            </p>
                        </div>

                    </div>

                    {isLoading && (
                        <div className="flex min-h-52 items-center justify-center">
                            <div className="text-center">
                                <Loader2 className="mx-auto h-7 w-7 animate-spin text-yellow-400" />

                                <p className="mt-3 text-sm text-gray-500">
                                    Loading users...
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading &&
                        users.length === 0 && (
                            <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-white/10">
                                <div className="text-center">
                                    <Users className="mx-auto h-8 w-8 text-gray-600" />

                                    <p className="mt-3 text-sm font-semibold text-gray-400">
                                        No administrator accounts found.
                                    </p>

                                    <p className="mt-1 text-xs text-gray-600">
                                        Create an account using the form.
                                    </p>
                                </div>
                            </div>
                        )}

                    {!isLoading &&
                        users.length > 0 && (
                            <div className="w-full overflow-x-auto">

                                <table className="w-full min-w-[850px] text-left">

                                    <thead>
                                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-600">

                                            <th className="px-3 py-3">
                                                User
                                            </th>

                                            <th className="px-3 py-3">
                                                Restaurant
                                            </th>

                                            <th className="px-3 py-3">
                                                Role
                                            </th>

                                            <th className="px-3 py-3">
                                                Status
                                            </th>

                                            <th className="px-3 py-3 text-right">
                                                Actions
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/5">

                                        {users.map(
                                            (user) => {
                                                const isSelf =
                                                    user.user_id ===
                                                    currentUserId;

                                                const isProcessing =
                                                    processingUserId ===
                                                    user.user_id;

                                                return (
                                                    <tr
                                                        key={
                                                            user.id
                                                        }
                                                        className="transition hover:bg-white/[0.02]"
                                                    >

                                                        <td className="px-3 py-4">
                                                            <div className="max-w-[280px]">

                                                                <p className="truncate text-sm font-semibold text-white">
                                                                    {user.email ??
                                                                        user.user_id}
                                                                </p>

                                                                <p className="mt-1 truncate text-[10px] text-gray-600">
                                                                    {user.user_id}
                                                                </p>

                                                                {isSelf && (
                                                                    <span className="mt-1 inline-flex rounded-md bg-yellow-400/10 px-2 py-1 text-[10px] font-bold uppercase text-yellow-400">
                                                                        You
                                                                    </span>
                                                                )}

                                                            </div>
                                                        </td>

                                                        <td className="px-3 py-4 text-sm text-gray-300">
                                                            {user.restaurant_name ??
                                                                "Unknown restaurant"}
                                                        </td>

                                                        <td className="px-3 py-4">

                                                            <span
                                                                className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${user.role ===
                                                                        "super_admin"
                                                                        ? "bg-yellow-400/10 text-yellow-400"
                                                                        : user.role ===
                                                                            "admin"
                                                                            ? "bg-blue-400/10 text-blue-300"
                                                                            : "bg-white/10 text-gray-300"
                                                                    }`}
                                                            >
                                                                {user.role
                                                                    .replace(
                                                                        "_",
                                                                        " "
                                                                    )
                                                                    .toUpperCase()}
                                                            </span>

                                                        </td>

                                                        <td className="px-3 py-4">

                                                            <span
                                                                className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${user.is_active
                                                                        ? "bg-green-400/10 text-green-400"
                                                                        : "bg-red-400/10 text-red-400"
                                                                    }`}
                                                            >
                                                                {user.is_active
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>

                                                        </td>

                                                        <td className="px-3 py-4">

                                                            <div className="flex items-center justify-end gap-2">

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isProcessing ||
                                                                        user.role ===
                                                                        "super_admin"
                                                                    }
                                                                    onClick={() =>
                                                                        openEditUser(
                                                                            user
                                                                        )
                                                                    }
                                                                    title={
                                                                        user.role ===
                                                                            "super_admin"
                                                                            ? "Super admin cannot be edited"
                                                                            : "Edit user"
                                                                    }
                                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-yellow-400/10 bg-yellow-400/5 text-yellow-400 transition hover:border-yellow-400/30 hover:bg-yellow-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                                >
                                                                    <Edit3 className="h-4 w-4" />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isProcessing ||
                                                                        isSelf ||
                                                                        user.role ===
                                                                        "super_admin"
                                                                    }
                                                                    onClick={() =>
                                                                        void handleToggleUser(
                                                                            user
                                                                        )
                                                                    }
                                                                    title={
                                                                        isSelf
                                                                            ? "You cannot deactivate yourself"
                                                                            : user.is_active
                                                                                ? "Deactivate user"
                                                                                : "Activate user"
                                                                    }
                                                                    className={
                                                                        user.is_active
                                                                            ? "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/10 bg-red-400/5 text-red-400 transition hover:border-red-400/30 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                                            : "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-green-400/10 bg-green-400/5 text-green-400 transition hover:border-green-400/30 hover:bg-green-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                                    }
                                                                >
                                                                    {isProcessing ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : user.is_active ? (
                                                                        <X className="h-4 w-4" />
                                                                    ) : (
                                                                        <Check className="h-4 w-4" />
                                                                    )}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        isProcessing ||
                                                                        isSelf ||
                                                                        user.role ===
                                                                        "super_admin"
                                                                    }
                                                                    onClick={() =>
                                                                        void handleDeleteUser(
                                                                            user
                                                                        )
                                                                    }
                                                                    title={
                                                                        isSelf
                                                                            ? "You cannot delete yourself"
                                                                            : "Delete user"
                                                                    }
                                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/10 bg-red-400/5 text-red-400 transition hover:border-red-400/30 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>
                                                );
                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}

                </section>

            </div>

            {/* EDIT MODAL */}

            {editingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gray-950 p-6 shadow-2xl">

                        <div className="mb-6 flex items-start justify-between gap-4">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                                    Super Admin
                                </p>

                                <h2 className="mt-1 text-xl font-black text-white">
                                    Edit User
                                </h2>

                                <p className="mt-1 max-w-sm truncate text-xs text-gray-500">
                                    {editingUser.email ??
                                        editingUser.user_id}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closeEditUser}
                                disabled={
                                    Boolean(
                                        processingUserId
                                    )
                                }
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        <div className="mb-5">

                            <label className="mb-2 block text-xs font-semibold text-gray-400">
                                Restaurant
                            </label>

                            <select
                                value={
                                    editRestaurantId
                                }
                                onChange={(event) =>
                                    setEditRestaurantId(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                            >

                                <option value="">
                                    Select restaurant
                                </option>

                                {restaurants.map(
                                    (restaurant) => (
                                        <option
                                            key={
                                                restaurant.id
                                            }
                                            value={
                                                restaurant.id
                                            }
                                        >
                                            {
                                                restaurant.name
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        <div className="mb-6">

                            <label className="mb-2 block text-xs font-semibold text-gray-400">
                                Role
                            </label>

                            <select
                                value={editRole}
                                onChange={(event) =>
                                    setEditRole(
                                        event.target
                                            .value as EditableRole
                                    )
                                }
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                            >

                                <option value="admin">
                                    Admin
                                </option>

                                <option value="staff">
                                    Staff
                                </option>

                            </select>

                        </div>

                        <div className="flex gap-3">

                            <button
                                type="button"
                                onClick={closeEditUser}
                                disabled={
                                    Boolean(
                                        processingUserId
                                    )
                                }
                                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    void handleUpdateUser()
                                }
                                disabled={
                                    Boolean(
                                        processingUserId
                                    ) ||
                                    !editRestaurantId
                                }
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {processingUserId ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4" />
                                )}

                                Save Changes

                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminUsers;