import {
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    Check,
    Edit3,
    Loader2,
    Trash2,
    UserPlus,
    Users,
    X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

interface Restaurant {
    id: string;
    name: string;
}

interface AdminUser {
    user_id: string;
    restaurant_id: string;
    role:
    | "super_admin"
    | "admin"
    | "staff";
    is_active: boolean;
    created_at: string;
}

type EditableRole = "admin" | "staff";

function AdminUsers() {
    const [users, setUsers] = useState<
        AdminUser[]
    >([]);

    const [restaurants, setRestaurants] =
        useState<Restaurant[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isCreating, setIsCreating] =
        useState(false);

    const [processingUserId, setProcessingUserId] =
        useState<string | null>(null);

    const [currentUserId, setCurrentUserId] =
        useState<string | null>(null);

    const [editingUser, setEditingUser] =
        useState<AdminUser | null>(null);

    const [editRestaurantId, setEditRestaurantId] =
        useState("");

    const [editRole, setEditRole] =
        useState<EditableRole>("admin");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [restaurantId, setRestaurantId] =
        useState("");

    const [role, setRole] =
        useState<EditableRole>("admin");

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] =
        useState<string | null>(null);

    /*
     * Load users and restaurants.
     */
    const loadData = useCallback(
        async () => {
            try {
                setIsLoading(true);
                setError(null);

                const [
                    {
                        data: userData,
                        error: userError,
                    },
                    {
                        data: restaurantData,
                        error: restaurantError,
                    },
                ] = await Promise.all([
                    supabase
                        .from("admin_users")
                        .select(
                            "user_id, restaurant_id, role, is_active, created_at",
                        )
                        .order(
                            "created_at",
                            {
                                ascending:
                                    false,
                            },
                        ),

                    supabase
                        .from("restaurants")
                        .select(
                            "id, name",
                        )
                        .order("name"),
                ]);

                if (userError) {
                    throw new Error(
                        userError.message,
                    );
                }

                if (
                    restaurantError
                ) {
                    throw new Error(
                        restaurantError.message,
                    );
                }

                setUsers(
                    userData ?? [],
                );

                setRestaurants(
                    restaurantData ?? [],
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load users.",
                );
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    /*
     * Initial load.
     */
    useEffect(() => {
        let cancelled = false;

        async function initialize() {
            try {
                const {
                    data: {
                        session,
                    },
                } =
                    await supabase.auth.getSession();

                if (
                    session?.user?.id &&
                    !cancelled
                ) {
                    setCurrentUserId(
                        session.user.id,
                    );
                }

                const [
                    {
                        data: userData,
                        error: userError,
                    },
                    {
                        data: restaurantData,
                        error: restaurantError,
                    },
                ] = await Promise.all([
                    supabase
                        .from("admin_users")
                        .select(
                            "user_id, restaurant_id, role, is_active, created_at",
                        )
                        .order(
                            "created_at",
                            {
                                ascending:
                                    false,
                            },
                        ),

                    supabase
                        .from("restaurants")
                        .select(
                            "id, name",
                        )
                        .order("name"),
                ]);

                if (cancelled) {
                    return;
                }

                if (userError) {
                    throw new Error(
                        userError.message,
                    );
                }

                if (
                    restaurantError
                ) {
                    throw new Error(
                        restaurantError.message,
                    );
                }

                setUsers(
                    userData ?? [],
                );

                setRestaurants(
                    restaurantData ?? [],
                );
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load users.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void initialize();

        return () => {
            cancelled = true;
        };
    }, []);

    /*
     * Get restaurant name.
     */
    function getRestaurantName(
        id: string,
    ) {
        return (
            restaurants.find(
                (restaurant) =>
                    restaurant.id === id,
            )?.name ??
            "Unknown restaurant"
        );
    }

    /*
     * Create user.
     */
    async function handleCreateUser(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError(null);
        setSuccess(null);
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
                    "Your session has expired.",
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
                            email,
                            password,
                            restaurant_id:
                                restaurantId,
                            role,
                        },
                    },
                );

            if (functionError) {
                throw new Error(
                    functionError.message,
                );
            }

            if (data?.error) {
                throw new Error(
                    data.error,
                );
            }

            setSuccess(
                `${role === "admin"
                    ? "Admin"
                    : "Staff"
                } account created successfully.`,
            );

            setEmail("");
            setPassword("");
            setRestaurantId("");
            setRole("admin");

            await loadData();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create user.",
            );
        } finally {
            setIsCreating(false);
        }
    }

    /*
     * Open edit modal.
     */
    function openEditUser(
        user: AdminUser,
    ) {
        setError(null);
        setSuccess(null);

        setEditingUser(user);

        setEditRestaurantId(
            user.restaurant_id,
        );

        setEditRole(
            user.role === "staff"
                ? "staff"
                : "admin",
        );
    }

    /*
     * Close edit modal.
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
     * Update user.
     */
    async function handleUpdateUser() {
        if (!editingUser) {
            return;
        }

        setError(null);
        setSuccess(null);
        setProcessingUserId(
            editingUser.user_id,
        );

        try {
            const {
                data,
                error:
                functionError,
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
                    },
                );

            if (functionError) {
                throw new Error(
                    functionError.message,
                );
            }

            if (data?.error) {
                throw new Error(
                    data.error,
                );
            }

            setSuccess(
                "User updated successfully.",
            );

            setEditingUser(null);

            await loadData();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update user.",
            );
        } finally {
            setProcessingUserId(
                null,
            );
        }
    }

    /*
     * Activate / deactivate.
     */
    async function handleToggleUser(
        user: AdminUser,
    ) {
        if (
            user.user_id ===
            currentUserId
        ) {
            setError(
                "You cannot deactivate your own account.",
            );

            return;
        }

        setError(null);
        setSuccess(null);

        setProcessingUserId(
            user.user_id,
        );

        try {
            const {
                data,
                error:
                functionError,
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
                    },
                );

            if (functionError) {
                throw new Error(
                    functionError.message,
                );
            }

            if (data?.error) {
                throw new Error(
                    data.error,
                );
            }

            setSuccess(
                user.is_active
                    ? "User deactivated successfully."
                    : "User activated successfully.",
            );

            await loadData();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update user status.",
            );
        } finally {
            setProcessingUserId(
                null,
            );
        }
    }

    /*
     * Delete user.
     */
    async function handleDeleteUser(
        user: AdminUser,
    ) {
        if (
            user.user_id ===
            currentUserId
        ) {
            setError(
                "You cannot delete your own account.",
            );

            return;
        }

        const confirmed =
            window.confirm(
                `Delete this ${user.role} account?\n\nThis will permanently remove the user's administrator access.`,
            );

        if (!confirmed) {
            return;
        }

        setError(null);
        setSuccess(null);

        setProcessingUserId(
            user.user_id,
        );

        try {
            const {
                data,
                error:
                functionError,
            } =
                await supabase.functions.invoke(
                    "manage-admin-user",
                    {
                        body: {
                            action: "delete",
                            user_id:
                                user.user_id,
                        },
                    },
                );

            if (functionError) {
                throw new Error(
                    functionError.message,
                );
            }

            if (data?.error) {
                throw new Error(
                    data.error,
                );
            }

            setSuccess(
                "User deleted successfully.",
            );

            await loadData();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete user.",
            );
        } finally {
            setProcessingUserId(
                null,
            );
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
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

            {/* Error */}
            {error && (
                <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setError(null)
                        }
                        className="shrink-0 text-red-300 transition hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">
                    <span>{success}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setSuccess(null)
                        }
                        className="shrink-0 text-green-300 transition hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="grid min-w-0 gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
                {/* Create User */}
                <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-gray-950">
                            <UserPlus className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-black text-white">
                                Create User
                            </h2>

                            <p className="text-xs text-gray-500">
                                Admin or staff account
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={
                            handleCreateUser
                        }
                        className="space-y-4"
                    >
                        {/* Email */}
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
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="admin@example.com"
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400/50"
                            />
                        </div>

                        {/* Password */}
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
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="Minimum 8 characters"
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400/50"
                            />
                        </div>

                        {/* Restaurant */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-400">
                                Restaurant
                            </label>

                            <select
                                required
                                value={restaurantId}
                                onChange={(event) =>
                                    setRestaurantId(
                                        event.target
                                            .value,
                                    )
                                }
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                            >
                                <option value="">
                                    Select restaurant
                                </option>

                                {restaurants.map(
                                    (
                                        restaurant,
                                    ) => (
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
                                    ),
                                )}
                            </select>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-400">
                                Role
                            </label>

                            <select
                                value={role}
                                onChange={(event) =>
                                    setRole(
                                        event.target
                                            .value as EditableRole,
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

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={
                                isCreating
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
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

                {/* Users */}
                <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                <Users className="h-5 w-5 text-white" />
                            </div>

                            <div>
                                <h2 className="font-black text-white">
                                    Administrator Accounts
                                </h2>

                                <p className="text-xs text-gray-500">
                                    {
                                        users.length
                                    }{" "}
                                    account
                                    {users.length ===
                                        1
                                        ? ""
                                        : "s"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Loading */}
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

                    {/* Empty */}
                    {!isLoading &&
                        users.length ===
                        0 && (
                            <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-white/10">
                                <div className="text-center">
                                    <Users className="mx-auto h-8 w-8 text-gray-600" />

                                    <p className="mt-3 text-sm font-semibold text-gray-400">
                                        No administrator
                                        accounts
                                        found.
                                    </p>

                                    <p className="mt-1 text-xs text-gray-600">
                                        Create an
                                        account
                                        using the
                                        form.
                                    </p>
                                </div>
                            </div>
                        )}

                    {/* Users */}
                    {!isLoading &&
                        users.length >
                        0 && (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full min-w-[760px] text-left">
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

                                    <tbody>
                                        {users.map(
                                            (
                                                user,
                                            ) => {
                                                const isSelf =
                                                    user.user_id ===
                                                    currentUserId;

                                                const isProcessing =
                                                    processingUserId ===
                                                    user.user_id;

                                                const isSuperAdmin =
                                                    user.role ===
                                                    "super_admin";

                                                return (
                                                    <tr
                                                        key={
                                                            user.user_id
                                                        }
                                                        className="border-b border-white/5 transition hover:bg-white/[0.02]"
                                                    >
                                                        {/* User */}
                                                        <td className="px-3 py-4">
                                                            <div className="min-w-0">
                                                                <p className="max-w-[180px] truncate text-xs font-medium text-gray-400">
                                                                    {
                                                                        user.user_id
                                                                    }
                                                                </p>

                                                                {isSelf && (
                                                                    <span className="mt-1 inline-flex rounded-md bg-yellow-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow-400">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Restaurant */}
                                                        <td className="px-3 py-4 text-sm font-semibold text-white">
                                                            {
                                                                getRestaurantName(
                                                                    user.restaurant_id,
                                                                )
                                                            }
                                                        </td>

                                                        {/* Role */}
                                                        <td className="px-3 py-4">
                                                            <span
                                                                className={
                                                                    user.role ===
                                                                        "super_admin"
                                                                        ? "inline-flex rounded-lg bg-yellow-400/10 px-2.5 py-1 text-xs font-bold uppercase text-yellow-400"
                                                                        : user.role ===
                                                                            "admin"
                                                                            ? "inline-flex rounded-lg bg-blue-400/10 px-2.5 py-1 text-xs font-bold uppercase text-blue-400"
                                                                            : "inline-flex rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold uppercase text-gray-300"
                                                                }
                                                            >
                                                                {
                                                                    user.role
                                                                }
                                                            </span>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="px-3 py-4">
                                                            <span
                                                                className={
                                                                    user.is_active
                                                                        ? "inline-flex items-center gap-2 text-xs font-semibold text-green-400"
                                                                        : "inline-flex items-center gap-2 text-xs font-semibold text-red-400"
                                                                }
                                                            >
                                                                <span
                                                                    className={
                                                                        user.is_active
                                                                            ? "h-2 w-2 rounded-full bg-green-400"
                                                                            : "h-2 w-2 rounded-full bg-red-400"
                                                                    }
                                                                />

                                                                {user.is_active
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-3 py-4">
                                                            {isSuperAdmin ? (
                                                                <span className="text-xs font-medium text-gray-600">
                                                                    Protected
                                                                </span>
                                                            ) : (
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {/* Edit */}
                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            isProcessing
                                                                        }
                                                                        onClick={() =>
                                                                            openEditUser(
                                                                                user,
                                                                            )
                                                                        }
                                                                        title="Edit user"
                                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                                                                    >
                                                                        <Edit3 className="h-4 w-4" />
                                                                    </button>

                                                                    {/* Activate / Deactivate */}
                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            isProcessing ||
                                                                            isSelf
                                                                        }
                                                                        onClick={() =>
                                                                            void handleToggleUser(
                                                                                user,
                                                                            )
                                                                        }
                                                                        title={
                                                                            user.is_active
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

                                                                    {/* Delete */}
                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            isProcessing ||
                                                                            isSelf
                                                                        }
                                                                        onClick={() =>
                                                                            void handleDeleteUser(
                                                                                user,
                                                                            )
                                                                        }
                                                                        title="Delete user"
                                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-400/10 bg-red-400/5 text-red-400 transition hover:border-red-400/30 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </section>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gray-950 p-6 shadow-2xl">
                        {/* Modal Header */}
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                                    Super Admin
                                </p>

                                <h2 className="mt-1 text-xl font-black text-white">
                                    Edit User
                                </h2>

                                <p className="mt-1 max-w-sm truncate text-xs text-gray-500">
                                    {
                                        editingUser.user_id
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeEditUser
                                }
                                disabled={
                                    Boolean(
                                        processingUserId,
                                    )
                                }
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Restaurant */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-gray-400">
                                    Restaurant
                                </label>

                                <select
                                    value={
                                        editRestaurantId
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setEditRestaurantId(
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                                >
                                    {restaurants.map(
                                        (
                                            restaurant,
                                        ) => (
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
                                        ),
                                    )}
                                </select>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-gray-400">
                                    Role
                                </label>

                                <select
                                    value={
                                        editRole
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        setEditRole(
                                            event
                                                .target
                                                .value as EditableRole,
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

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={
                                        closeEditUser
                                    }
                                    disabled={
                                        Boolean(
                                            processingUserId,
                                        )
                                    }
                                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
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
                                            processingUserId,
                                        ) ||
                                        !editRestaurantId
                                    }
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                </div>
            )}
        </div>
    );
}

export default AdminUsers;