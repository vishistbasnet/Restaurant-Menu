import type { MenuItem } from "../../types/menu";
import MenuItemCard from "./MenuItemCard";

interface MenuSectionProps {
    selectedCategory: string;
    menuItems: MenuItem[];
    isLoading: boolean;
    error: string | null;
}

function MenuSection({
    selectedCategory,
    menuItems,
    isLoading,
    error,
}: MenuSectionProps) {
    const filteredItems =
        selectedCategory === "All"
            ? menuItems
            : menuItems.filter((item) => item.category === selectedCategory);

    if (isLoading) {
        return (
            <section
                id="menu-section"
                className="scroll-mt-[130px] mx-auto max-w-6xl px-4 py-10 sm:py-14"
            >
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
                        Explore
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                        Our Menu
                    </h2>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-yellow-400" />
                    <p className="mt-4 text-sm text-gray-400">
                        Loading menu...
                    </p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section
                id="menu-section"
                className="scroll-mt-[130px] mx-auto max-w-6xl px-4 py-10 sm:py-14"
            >
                <div className="rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-400/10 text-3xl">
                        ⚠️
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-white">
                        Unable to load menu
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
                        Please try refreshing the page.
                    </p>

                    <p className="mx-auto mt-3 max-w-lg break-words text-xs text-red-300/80">
                        {error}
                    </p>
                </div>
            </section>
        );
    }

    const hasMenuItems = menuItems.length > 0;
    const hasCategoryItems = filteredItems.length > 0;

    return (
        <section
            id="menu-section"
            className="scroll-mt-[130px] mx-auto max-w-6xl px-4 py-10 sm:py-14"
        >
            <div className="mb-8">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
                            Explore
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                            {selectedCategory === "All"
                                ? "Our Menu"
                                : selectedCategory}
                        </h2>
                    </div>

                    {hasCategoryItems && (
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-400">
                            {filteredItems.length}{" "}
                            {filteredItems.length === 1 ? "item" : "items"}
                        </span>
                    )}
                </div>

                <p className="mt-3 text-gray-400">
                    Fresh vegetarian food prepared with care.
                </p>
            </div>

            {!hasMenuItems ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
                        🍽️
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-white">
                        Menu coming soon
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        We're preparing our vegetarian menu. Please check back soon.
                    </p>
                </div>
            ) : !hasCategoryItems ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-3xl">
                        🔎
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-white">
                        No items available
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        There are currently no items available in{" "}
                        <span className="font-semibold text-gray-400">
                            {selectedCategory}
                        </span>
                        .
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default MenuSection;
