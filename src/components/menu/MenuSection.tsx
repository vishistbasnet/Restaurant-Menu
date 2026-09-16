import { menuItems } from "../../data/menu";
import MenuItemCard from "./MenuItemCard";

interface MenuSectionProps {
    selectedCategory: string;
}

function MenuSection({ selectedCategory }: MenuSectionProps) {
    const filteredItems =
        selectedCategory === "All"
            ? menuItems
            : menuItems.filter(
                (item) => item.category === selectedCategory
            );

    return (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
                    Explore
                </p>

                <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                    {selectedCategory === "All"
                        ? "Our Menu"
                        : selectedCategory}
                </h2>

                <p className="mt-2 text-gray-400">
                    Fresh vegetarian food prepared with care.
                </p>
            </div>

            {filteredItems.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item) => (
                        <MenuItemCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                    <p className="text-gray-400">
                        No items available in this category.
                    </p>
                </div>
            )}
        </section>
    );
}

export default MenuSection;