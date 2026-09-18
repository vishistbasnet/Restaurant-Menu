import { useEffect, useState } from "react";
import {
    Building2,
    Check,
    Edit3,
    Plus,
    Power,
    X,
} from "lucide-react";

import { supabase } from "../../lib/supabase";

interface Restaurant {
    id: string;
    name: string;
    phone: string | null;
    whatsapp: string | null;
    order_type: "pickup";
    is_active: boolean;
    opening_time: string;
    closing_time: string;
    created_at: string;
    updated_at: string;
}

interface RestaurantForm {
    name: string;
    phone: string;
    whatsapp: string;
    opening_time: string;
    closing_time: string;
}

const emptyForm: RestaurantForm = {
    name: "",
    phone: "",
    whatsapp: "",
    opening_time: "11:00",
    closing_time: "22:00",
};

function AdminRestaurants() {
    const [restaurants, setRestaurants] =
        useState<Restaurant[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] =
        useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [editingRestaurant, setEditingRestaurant] =
        useState<Restaurant | null>(null);

    const [form, setForm] =
        useState<RestaurantForm>(emptyForm);

    async function loadRestaurants() {
        try {
            setIsLoading(true);
            setError(null);

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                throw new Error(
                    "You must be logged in."
                );
            }

            const {
                data,
                error: restaurantError,
            } = await supabase
                .from("restaurants")
                .select("*")
                .order("created_at", {
                    ascending: false,
                });

            if (restaurantError) {
                throw new Error(
                    restaurantError.message
                );
            }

            setRestaurants(data ?? []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load restaurants."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadRestaurants();
    }, []);

    function openCreateModal() {
        setEditingRestaurant(null);
        setForm(emptyForm);
        setError(null);
        setSuccess(null);
        setIsModalOpen(true);
    }

    function openEditModal(
        restaurant: Restaurant
    ) {
        setEditingRestaurant(restaurant);

        setForm({
            name: restaurant.name,
            phone: restaurant.phone ?? "",
            whatsapp: restaurant.whatsapp ?? "",
            opening_time:
                restaurant.opening_time.slice(
                    0,
                    5
                ),
            closing_time:
                restaurant.closing_time.slice(
                    0,
                    5
                ),
        });

        setError(null);
        setSuccess(null);
        setIsModalOpen(true);
    }

    function closeModal() {
        if (isSaving) {
            return;
        }

        setIsModalOpen(false);
        setEditingRestaurant(null);
        setForm(emptyForm);
    }

    function updateField(
        field: keyof RestaurantForm,
        value: string
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError(null);
        setSuccess(null);

        const name = form.name.trim();

        if (!name) {
            setError(
                "Restaurant name is required."
            );
            return;
        }

        if (!form.opening_time) {
            setError(
                "Opening time is required."
            );
            return;
        }

        if (!form.closing_time) {
            setError(
                "Closing time is required."
            );
            return;
        }

        setIsSaving(true);

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                throw new Error(
                    "Your session has expired."
                );
            }

            const action =
                editingRestaurant
                    ? "update"
                    : "create";

            const body = {
                action,
                ...(editingRestaurant
                    ? {
                        restaurant_id:
                            editingRestaurant.id,
                    }
                    : {}),
                name,
                phone:
                    form.phone.trim(),
                whatsapp:
                    form.whatsapp.trim(),
                opening_time:
                    form.opening_time,
                closing_time:
                    form.closing_time,
            };

            const {
                data,
                error: functionError,
            } =
                await supabase.functions.invoke(
                    "manage-restaurant",
                    {
                        body,
                    }
                );

            if (functionError) {
                throw new Error(
                    functionError.message
                );
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            setSuccess(
                editingRestaurant
                    ? "Restaurant updated successfully."
                    : "Restaurant created successfully."
            );

            setIsModalOpen(false);
            setEditingRestaurant(null);
            setForm(emptyForm);

            await loadRestaurants();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save restaurant."
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function toggleRestaurant(
        restaurant: Restaurant
    ) {
        const nextStatus =
            !restaurant.is_active;

        const confirmed = window.confirm(
            nextStatus
                ? `Enable "${restaurant.name}"?`
                : `Disable "${restaurant.name}"?`
        );

        if (!confirmed) {
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

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
                    "manage-restaurant",
                    {
                        body: {
                            action: "toggle",
                            restaurant_id:
                                restaurant.id,
                            is_active:
                                nextStatus,
                        },
                    }
                );

            if (functionError) {
                throw new Error(
                    functionError.message
                );
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            setSuccess(
                nextStatus
                    ? `${restaurant.name} is now active.`
                    : `${restaurant.name} has been disabled.`
            );

            await loadRestaurants();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update restaurant status."
            );
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-yellow-400">
                        Super Admin
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
                        Restaurants
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm text-gray-500">
                        Create and manage all restaurants
                        connected to your platform.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-300"
                >
                    <Plus className="h-4 w-4" />
                    Add Restaurant
                </button>
            </div>

            {/* Alerts */}
            {error && !isModalOpen && (
                <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                    {error}
                </div>
            )}

            {success && !isModalOpen && (
                <div className="mb-6 rounded-2xl border border-green-400/20 bg-green-400/5 p-4 text-sm text-green-300">
                    {success}
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex min-h-60 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04]">
                    <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-yellow-400" />

                        <p className="mt-4 text-sm text-gray-500">
                            Loading restaurants...
                        </p>
                    </div>
                </div>
            )}

            {/* Empty */}
            {!isLoading &&
                restaurants.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">
                        <Building2 className="mx-auto h-10 w-10 text-gray-600" />

                        <h2 className="mt-4 text-lg font-bold text-white">
                            No restaurants yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Create your first restaurant
                            to get started.
                        </p>

                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-950 hover:bg-yellow-300"
                        >
                            <Plus className="h-4 w-4" />
                            Add Restaurant
                        </button>
                    </div>
                )}

            {/* Restaurant cards */}
            {!isLoading &&
                restaurants.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {restaurants.map(
                            (restaurant) => (
                                <article
                                    key={restaurant.id}
                                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-gray-950">
                                                    <Building2 className="h-5 w-5" />
                                                </div>

                                                <div className="min-w-0">
                                                    <h2 className="truncate font-black text-white">
                                                        {
                                                            restaurant.name
                                                        }
                                                    </h2>

                                                    <p className="mt-1 text-xs text-gray-600">
                                                        {
                                                            restaurant.id
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${restaurant.is_active
                                                    ? "bg-green-400/10 text-green-400"
                                                    : "bg-red-400/10 text-red-400"
                                                    }`}
                                            >
                                                {restaurant.is_active
                                                    ? "Active"
                                                    : "Disabled"}
                                            </span>
                                        </div>

                                        <div className="mt-6 space-y-3 text-sm">
                                            <div className="flex justify-between gap-4">
                                                <span className="text-gray-600">
                                                    Phone
                                                </span>

                                                <span className="truncate text-gray-300">
                                                    {restaurant.phone ??
                                                        "Not set"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-gray-600">
                                                    WhatsApp
                                                </span>

                                                <span className="truncate text-gray-300">
                                                    {restaurant.whatsapp ??
                                                        "Not set"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-gray-600">
                                                    Hours
                                                </span>

                                                <span className="text-gray-300">
                                                    {restaurant.opening_time.slice(
                                                        0,
                                                        5
                                                    )}{" "}
                                                    –{" "}
                                                    {restaurant.closing_time.slice(
                                                        0,
                                                        5
                                                    )}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-gray-600">
                                                    Orders
                                                </span>

                                                <span className="capitalize text-gray-300">
                                                    {
                                                        restaurant.order_type
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex border-t border-white/10">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditModal(
                                                    restaurant
                                                )
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                void toggleRestaurant(
                                                    restaurant
                                                )
                                            }
                                            className={`flex flex-1 items-center justify-center gap-2 border-l border-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/5 ${restaurant.is_active
                                                ? "text-red-400 hover:text-red-300"
                                                : "text-green-400 hover:text-green-300"
                                                }`}
                                        >
                                            <Power className="h-4 w-4" />

                                            {restaurant.is_active
                                                ? "Disable"
                                                : "Enable"}
                                        </button>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-gray-950 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                            <div>
                                <h2 className="font-black text-white">
                                    {editingRestaurant
                                        ? "Edit Restaurant"
                                        : "Add Restaurant"}
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    {editingRestaurant
                                        ? "Update restaurant information."
                                        : "Create a new restaurant."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={isSaving}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >
                            {error && (
                                <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">
                                    {error}
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-gray-400">
                                    Restaurant Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(event) =>
                                        updateField(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Restaurant name"
                                    className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400/50"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-gray-400">
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(event) =>
                                        updateField(
                                            "phone",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Phone number"
                                    className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400/50"
                                />
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold text-gray-400">
                                    WhatsApp
                                </label>

                                <input
                                    type="tel"
                                    value={form.whatsapp}
                                    onChange={(event) =>
                                        updateField(
                                            "whatsapp",
                                            event.target.value
                                        )
                                    }
                                    placeholder="WhatsApp number"
                                    className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400/50"
                                />
                            </div>

                            {/* Hours */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold text-gray-400">
                                        Opening Time
                                    </label>

                                    <input
                                        type="time"
                                        required
                                        value={
                                            form.opening_time
                                        }
                                        onChange={(event) =>
                                            updateField(
                                                "opening_time",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold text-gray-400">
                                        Closing Time
                                    </label>

                                    <input
                                        type="time"
                                        required
                                        value={
                                            form.closing_time
                                        }
                                        onChange={(event) =>
                                            updateField(
                                                "closing_time",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSaving}
                                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-950/20 border-t-gray-950" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            {editingRestaurant
                                                ? "Save Changes"
                                                : "Create Restaurant"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminRestaurants;