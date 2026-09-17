import { useEffect, useState } from "react";

import {
    createCategory,
    deleteCategory,
    getCategories,
    type AdminCategory,
    toggleCategory,
    updateCategory,
} from "../services/categoryService";

function AdminCategories() {
    const [categories, setCategories] = useState<
        AdminCategory[]
    >([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<AdminCategory | null>(null);

    const [name, setName] = useState("");
    const [sortOrder, setSortOrder] = useState("0");
    const [isSaving, setIsSaving] = useState(false);

    async function loadCategories() {
        try {
            setIsLoading(true);
            setError("");

            const data = await getCategories();

            setCategories(data);
        } catch (loadError) {
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Failed to load categories."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadCategories();
        }, 0);

        return () => {
            window.clearTimeout(timer);
        };
    }, []);

    function openCreateModal() {
        setEditingCategory(null);
        setName("");
        setSortOrder(String(categories.length));
        setIsModalOpen(true);
    }

    function openEditModal(category: AdminCategory) {
        setEditingCategory(category);
        setName(category.name);
        setSortOrder(String(category.sort_order));
        setIsModalOpen(true);
    }

    function closeModal() {
        if (isSaving) {
            return;
        }

        setIsModalOpen(false);
        setEditingCategory(null);
        setName("");
        setSortOrder("0");
    }

    async function handleSave() {
        if (!name.trim()) {
            setError("Category name is required.");
            return;
        }

        const parsedSortOrder = Number(sortOrder);

        if (!Number.isInteger(parsedSortOrder)) {
            setError("Sort order must be a whole number.");
            return;
        }

        try {
            setIsSaving(true);
            setError("");

            if (editingCategory) {
                await updateCategory(
                    editingCategory.id,
                    name,
                    parsedSortOrder
                );
            } else {
                await createCategory(
                    name,
                    parsedSortOrder
                );
            }

            closeModal();
            await loadCategories();
        } catch (saveError) {
            setError(
                saveError instanceof Error
                    ? saveError.message
                    : "Failed to save category."
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function handleToggle(category: AdminCategory) {
        try {
            setError("");

            await toggleCategory(
                category.id,
                !category.is_active
            );

            await loadCategories();
        } catch (toggleError) {
            setError(
                toggleError instanceof Error
                    ? toggleError.message
                    : "Failed to update category."
            );
        }
    }

    async function handleDelete(category: AdminCategory) {
        const confirmed = window.confirm(
            `Delete "${category.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteCategory(category.id);

            await loadCategories();
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : "Failed to delete category."
            );
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-yellow-400">
                        Menu Management
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                        Categories
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Organize your restaurant menu into clear sections.
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-gray-950 transition hover:bg-yellow-300"
                >
                    + Add Category
                </button>
            </div>

            {error && (
                <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
                {isLoading ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        Loading categories...
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="text-4xl">📁</div>

                        <h2 className="mt-4 text-xl font-black">
                            No categories yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Create your first menu category.
                        </p>

                        <button
                            onClick={openCreateModal}
                            className="mt-5 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-950"
                        >
                            Create Category
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {categories.map((category, index) => (
                            <div
                                key={category.id}
                                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-gray-400">
                                        {index + 1}
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-white">
                                            {category.name}
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-600">
                                            Sort order: {category.sort_order}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        onClick={() =>
                                            handleToggle(category)
                                        }
                                        className={`rounded-lg px-3 py-2 text-xs font-bold ${category.is_active
                                            ? "bg-green-400/10 text-green-400"
                                            : "bg-gray-400/10 text-gray-500"
                                            }`}
                                    >
                                        {category.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </button>

                                    <button
                                        onClick={() =>
                                            openEditModal(category)
                                        }
                                        className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-gray-300 transition hover:bg-white/5 hover:text-white"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(category)
                                        }
                                        className="rounded-lg border border-red-400/10 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-400/10"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gray-950 p-6 shadow-2xl">
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-yellow-400">
                                {editingCategory
                                    ? "Edit Category"
                                    : "New Category"}
                            </p>

                            <h2 className="mt-1 text-2xl font-black">
                                {editingCategory
                                    ? "Update category"
                                    : "Create category"}
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="category-name"
                                    className="mb-2 block text-sm font-semibold text-gray-300"
                                >
                                    Category Name
                                </label>

                                <input
                                    id="category-name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    placeholder="e.g. Momos"
                                    className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-yellow-400"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="sort-order"
                                    className="mb-2 block text-sm font-semibold text-gray-300"
                                >
                                    Sort Order
                                </label>

                                <input
                                    id="sort-order"
                                    type="number"
                                    value={sortOrder}
                                    onChange={(event) =>
                                        setSortOrder(event.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
                                />

                                <p className="mt-2 text-xs text-gray-600">
                                    Lower numbers appear first.
                                </p>
                            </div>
                        </div>

                        <div className="mt-7 flex gap-3">
                            <button
                                onClick={closeModal}
                                disabled={isSaving}
                                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-gray-950 transition hover:bg-yellow-300 disabled:opacity-50"
                            >
                                {isSaving
                                    ? "Saving..."
                                    : editingCategory
                                        ? "Save Changes"
                                        : "Create Category"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategories;