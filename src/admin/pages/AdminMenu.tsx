import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
    createMenuItem,
    deleteMenuItem,
    getAdminMenuItems,
    toggleMenuItem,
    updateMenuItem,
} from "../services/menuAdminService";

import { getCategories } from "../services/categoryService";
import type { AdminCategory } from "../services/categoryService";

interface MenuOptionForm {
    id?: string;
    label: string;
    price: string;
}

interface MenuForm {
    name: string;
    categoryId: string;
    description: string;
    isVeg: boolean;
    pricingMode: "single" | "options";
    price: string;
    options: MenuOptionForm[];
    isAvailable: boolean;
    sortOrder: string;
}

const emptyForm: MenuForm = {
    name: "",
    categoryId: "",
    description: "",
    isVeg: true,
    pricingMode: "single",
    price: "",
    options: [
        {
            label: "",
            price: "",
        },
    ],
    isAvailable: true,
    sortOrder: "0",
};

function AdminMenu() {
    const [items, setItems] = useState<
        Awaited<ReturnType<typeof getAdminMenuItems>>
    >([]);

    const [categories, setCategories] = useState<AdminCategory[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState<MenuForm>(emptyForm);

    async function loadData() {
        try {
            setIsLoading(true);
            setError(null);

            const [menuData, categoryData] = await Promise.all([
                getAdminMenuItems(),
                getCategories(),
            ]);

            setItems(menuData);
            setCategories(categoryData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load menu."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function openCreateModal() {
        setEditingId(null);

        setForm({
            ...emptyForm,
            categoryId: categories[0]?.id ?? "",
        });

        setError(null);
        setIsModalOpen(true);
    }

    function openEditModal(
        item: Awaited<ReturnType<typeof getAdminMenuItems>>[number]
    ) {
        const hasOptions = item.menu_item_options.length > 0;

        setEditingId(item.id);

        setForm({
            name: item.name,
            categoryId: item.category_id,
            description: item.description ?? "",
            isVeg: item.is_veg,
            pricingMode: hasOptions ? "options" : "single",
            price:
                item.price !== null
                    ? String(item.price)
                    : "",
            options: hasOptions
                ? item.menu_item_options
                    .sort(
                        (a, b) =>
                            a.sort_order - b.sort_order
                    )
                    .map((option) => ({
                        id: option.id,
                        label: option.label,
                        price:
                            option.price !== null
                                ? String(option.price)
                                : "",
                    }))
                : [
                    {
                        label: "",
                        price: "",
                    },
                ],
            isAvailable: item.is_available,
            sortOrder: String(item.sort_order),
        });

        setError(null);
        setIsModalOpen(true);
    }

    function closeModal() {
        if (isSaving) {
            return;
        }

        setIsModalOpen(false);
        setEditingId(null);
        setForm(emptyForm);
    }

    function updateForm(
        field: keyof MenuForm,
        value: string | boolean
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function updateOption(
        index: number,
        field: keyof MenuOptionForm,
        value: string
    ) {
        setForm((current) => ({
            ...current,
            options: current.options.map(
                (option, optionIndex) =>
                    optionIndex === index
                        ? {
                            ...option,
                            [field]: value,
                        }
                        : option
            ),
        }));
    }

    function addOption() {
        setForm((current) => ({
            ...current,
            options: [
                ...current.options,
                {
                    label: "",
                    price: "",
                },
            ],
        }));
    }

    function removeOption(index: number) {
        setForm((current) => ({
            ...current,
            options: current.options.filter(
                (_, optionIndex) =>
                    optionIndex !== index
            ),
        }));
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!form.name.trim()) {
            setError("Menu item name is required.");
            return;
        }

        if (!form.categoryId) {
            setError("Please select a category.");
            return;
        }

        if (
            form.pricingMode === "single" &&
            (form.price.trim() === "" ||
                Number(form.price) < 0)
        ) {
            setError("Please enter a valid price.");
            return;
        }

        if (form.pricingMode === "options") {
            if (form.options.length === 0) {
                setError(
                    "Add at least one pricing option."
                );
                return;
            }

            const invalidOption = form.options.some(
                (option) =>
                    !option.label.trim() ||
                    option.price.trim() === "" ||
                    Number(option.price) < 0
            );

            if (invalidOption) {
                setError(
                    "Every option needs a label and valid price."
                );
                return;
            }
        }

        try {
            setIsSaving(true);
            setError(null);

            const options =
                form.pricingMode === "options"
                    ? form.options.map(
                        (option, index) => ({
                            label: option.label.trim(),
                            price: Number(option.price),
                            sortOrder: index,
                            isAvailable: true,
                        })
                    )
                    : [];

            const payload = {
                categoryId: form.categoryId,
                name: form.name.trim(),
                description: form.description.trim(),
                isVeg: form.isVeg,
                price:
                    form.pricingMode === "single"
                        ? Number(form.price)
                        : null,
                isAvailable: form.isAvailable,
                sortOrder: Number(form.sortOrder) || 0,
                options,
            };

            if (editingId) {
                await updateMenuItem(
                    editingId,
                    payload
                );
            } else {
                await createMenuItem(payload);
            }

            await loadData();
            closeModal();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save menu item."
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function handleToggle(
        id: string,
        currentStatus: boolean
    ) {
        try {
            setError(null);

            await toggleMenuItem(
                id,
                !currentStatus
            );

            await loadData();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update availability."
            );
        }
    }

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            "Delete this menu item? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError(null);

            await deleteMenuItem(id);

            await loadData();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete menu item."
            );
        }
    }

    function getCategoryName(
        categoryId: string
    ) {
        return (
            categories.find(
                (category) =>
                    category.id === categoryId
            )?.name ?? "Unknown category"
        );
    }

    function formatPrice(
        price: number | null
    ) {
        if (price === null) {
            return "—";
        }

        return `₹${Number(price).toFixed(0)}`;
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="mb-1 text-sm font-medium text-yellow-400">
                            Menu Management
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Menu Items
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Manage dishes, pricing, availability
                            and categories.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        disabled={categories.length === 0}
                        className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-950 shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        + Add Menu Item
                    </button>
                </div>

                {/* Error */}
                {error && !isModalOpen && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {/* No categories */}
                {!isLoading &&
                    categories.length === 0 && (
                        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center">
                            <h2 className="text-lg font-semibold">
                                Create a category first
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                Menu items need a category before
                                they can be created.
                            </p>
                        </div>
                    )}

                {/* Loading */}
                {isLoading && (
                    <div className="grid gap-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/5"
                            />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!isLoading &&
                    categories.length > 0 &&
                    items.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10 text-2xl">
                                🍽️
                            </div>

                            <h2 className="text-lg font-semibold">
                                No menu items yet
                            </h2>

                            <p className="mt-2 text-sm text-gray-400">
                                Add your first dish to start building
                                the menu.
                            </p>
                        </div>
                    )}

                {/* Menu list */}
                {!isLoading &&
                    items.length > 0 && (
                        <div className="grid gap-4">
                            {items.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/15 hover:bg-white/[0.045]"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-md border border-green-500/20 bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-300">
                                                    {item.is_veg
                                                        ? "VEG"
                                                        : "NON-VEG"}
                                                </span>

                                                <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                                                    {getCategoryName(
                                                        item.category_id
                                                    )}
                                                </span>

                                                <span
                                                    className={`rounded-md px-2 py-1 text-xs font-semibold ${item.is_available
                                                            ? "bg-emerald-500/10 text-emerald-300"
                                                            : "bg-red-500/10 text-red-300"
                                                        }`}
                                                >
                                                    {item.is_available
                                                        ? "Available"
                                                        : "Unavailable"}
                                                </span>
                                            </div>

                                            <h2 className="mt-3 text-lg font-bold">
                                                {item.name}
                                            </h2>

                                            {item.description && (
                                                <p className="mt-1 max-w-2xl text-sm text-gray-400">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {item.menu_item_options.length >
                                                    0 ? (
                                                    item.menu_item_options.map(
                                                        (option) => (
                                                            <span
                                                                key={option.id}
                                                                className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-gray-300"
                                                            >
                                                                {option.label}{" "}
                                                                <span className="font-semibold text-white">
                                                                    {formatPrice(
                                                                        option.price
                                                                    )}
                                                                </span>
                                                            </span>
                                                        )
                                                    )
                                                ) : (
                                                    <span className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-sm text-gray-300">
                                                        {formatPrice(
                                                            item.price
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 lg:shrink-0">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleToggle(
                                                        item.id,
                                                        item.is_available
                                                    )
                                                }
                                                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
                                            >
                                                {item.is_available
                                                    ? "Disable"
                                                    : "Enable"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openEditModal(item)
                                                }
                                                className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-400/20"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center py-8">
                        <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gray-900 shadow-2xl">
                            {/* Modal header */}
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                                <div>
                                    <h2 className="text-xl font-bold">
                                        {editingId
                                            ? "Edit Menu Item"
                                            : "Add Menu Item"}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-400">
                                        Configure the item shown on the
                                        customer menu.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSaving}
                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                                    aria-label="Close modal"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6 p-6"
                            >
                                {/* Error */}
                                {error && (
                                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                        {error}
                                    </div>
                                )}

                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="menu-name"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Name
                                    </label>

                                    <input
                                        id="menu-name"
                                        value={form.name}
                                        onChange={(event) =>
                                            updateForm(
                                                "name",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Veg Momos"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label
                                        htmlFor="menu-category"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Category
                                    </label>

                                    <select
                                        id="menu-category"
                                        value={form.categoryId}
                                        onChange={(event) =>
                                            updateForm(
                                                "categoryId",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-gray-800 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                                    >
                                        <option value="">
                                            Select category
                                        </option>

                                        {categories.map(
                                            (category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                    {!category.is_active
                                                        ? " (Inactive)"
                                                        : ""}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="menu-description"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="menu-description"
                                        value={form.description}
                                        onChange={(event) =>
                                            updateForm(
                                                "description",
                                                event.target.value
                                            )
                                        }
                                        rows={3}
                                        placeholder="Steamed vegetarian momos"
                                        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
                                    />
                                </div>

                                {/* Pricing */}
                                <div>
                                    <div className="mb-3">
                                        <p className="text-sm font-medium text-gray-300">
                                            Pricing
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Choose a single price or multiple
                                            options such as Half / Full.
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateForm(
                                                    "pricingMode",
                                                    "single"
                                                )
                                            }
                                            className={`rounded-xl border p-4 text-left transition ${form.pricingMode ===
                                                    "single"
                                                    ? "border-yellow-400/50 bg-yellow-400/10"
                                                    : "border-white/10 bg-white/[0.03] hover:bg-white/5"
                                                }`}
                                        >
                                            <p className="font-semibold">
                                                Single Price
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Example: ₹80
                                            </p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateForm(
                                                    "pricingMode",
                                                    "options"
                                                )
                                            }
                                            className={`rounded-xl border p-4 text-left transition ${form.pricingMode ===
                                                    "options"
                                                    ? "border-yellow-400/50 bg-yellow-400/10"
                                                    : "border-white/10 bg-white/[0.03] hover:bg-white/5"
                                                }`}
                                        >
                                            <p className="font-semibold">
                                                Multiple Options
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Example: Half / Full
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                {/* Single price */}
                                {form.pricingMode ===
                                    "single" && (
                                        <div>
                                            <label
                                                htmlFor="menu-price"
                                                className="mb-2 block text-sm font-medium text-gray-300"
                                            >
                                                Price (₹)
                                            </label>

                                            <input
                                                id="menu-price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={form.price}
                                                onChange={(event) =>
                                                    updateForm(
                                                        "price",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="80"
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
                                            />
                                        </div>
                                    )}

                                {/* Options */}
                                {form.pricingMode ===
                                    "options" && (
                                        <div>
                                            <div className="mb-3 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-300">
                                                        Pricing Options
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Add sizes, portions or variants.
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={addOption}
                                                    className="rounded-lg border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-xs font-semibold text-yellow-300 transition hover:bg-yellow-400/20"
                                                >
                                                    + Add Option
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {form.options.map(
                                                    (option, index) => (
                                                        <div
                                                            key={index}
                                                            className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:grid-cols-[1fr_150px_auto]"
                                                        >
                                                            <input
                                                                value={option.label}
                                                                onChange={(event) =>
                                                                    updateOption(
                                                                        index,
                                                                        "label",
                                                                        event.target.value
                                                                    )
                                                                }
                                                                placeholder="Half"
                                                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-yellow-400/50"
                                                            />

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={option.price}
                                                                onChange={(event) =>
                                                                    updateOption(
                                                                        index,
                                                                        "price",
                                                                        event.target.value
                                                                    )
                                                                }
                                                                placeholder="80"
                                                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 focus:border-yellow-400/50"
                                                            />

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeOption(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={
                                                                    form.options.length ===
                                                                    1
                                                                }
                                                                className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Toggles */}
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                        <input
                                            type="checkbox"
                                            checked={form.isVeg}
                                            onChange={(event) =>
                                                updateForm(
                                                    "isVeg",
                                                    event.target.checked
                                                )
                                            }
                                            className="h-4 w-4 accent-yellow-400"
                                        />

                                        <span>
                                            <span className="block text-sm font-medium">
                                                Vegetarian
                                            </span>

                                            <span className="mt-1 block text-xs text-gray-500">
                                                Show this item as VEG.
                                            </span>
                                        </span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                        <input
                                            type="checkbox"
                                            checked={form.isAvailable}
                                            onChange={(event) =>
                                                updateForm(
                                                    "isAvailable",
                                                    event.target.checked
                                                )
                                            }
                                            className="h-4 w-4 accent-yellow-400"
                                        />

                                        <span>
                                            <span className="block text-sm font-medium">
                                                Available
                                            </span>

                                            <span className="mt-1 block text-xs text-gray-500">
                                                Customers can order this item.
                                            </span>
                                        </span>
                                    </label>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label
                                        htmlFor="menu-sort"
                                        className="mb-2 block text-sm font-medium text-gray-300"
                                    >
                                        Sort Order
                                    </label>

                                    <input
                                        id="menu-sort"
                                        type="number"
                                        value={form.sortOrder}
                                        onChange={(event) =>
                                            updateForm(
                                                "sortOrder",
                                                event.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10"
                                    />

                                    <p className="mt-1 text-xs text-gray-500">
                                        Lower numbers appear first.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isSaving}
                                        className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isSaving
                                            ? "Saving..."
                                            : editingId
                                                ? "Save Changes"
                                                : "Create Item"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminMenu;