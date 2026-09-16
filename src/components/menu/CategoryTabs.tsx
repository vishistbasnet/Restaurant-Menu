import { categories } from "../../data/categories";

interface CategoryTabsProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

function CategoryTabs({
    selectedCategory,
    onCategoryChange,
}: CategoryTabsProps) {
    return (
        <nav className="sticky top-[73px] z-40 border-b border-white/10 bg-gray-950/95 backdrop-blur">
            <div className="mx-auto max-w-6xl overflow-x-auto px-4">
                <div className="flex min-w-max gap-2 py-3">
                    {categories.map((category) => {
                        const isActive = selectedCategory === category;

                        return (
                            <button
                                key={category}
                                onClick={() => {
                                    onCategoryChange(category);

                                    document
                                        .getElementById("menu-section")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        });
                                }}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
                                    ? "bg-yellow-400 text-gray-950"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}

export default CategoryTabs;