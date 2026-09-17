import { useEffect, useRef } from "react";

interface CategoryTabsProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

function CategoryTabs({
    categories,
    selectedCategory,
    onCategoryChange,
}: CategoryTabsProps) {
    const activeCategoryRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        activeCategoryRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [selectedCategory]);

    const allCategories = ["All", ...categories];

    return (
        <nav className="sticky top-[60px] z-40 border-b border-white/10 bg-gray-950/95 backdrop-blur">
            <div className="relative mx-auto max-w-6xl">
                <div className="overflow-x-auto scrollbar-hide px-4">
                    <div className="flex min-w-max gap-2 py-3">
                        {allCategories.map((category) => {
                            const isActive = selectedCategory === category;

                            return (
                                <button
                                    key={category}
                                    ref={isActive ? activeCategoryRef : undefined}
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

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-950 to-transparent sm:hidden"
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-950 to-transparent sm:hidden"
                />
            </div>
        </nav>
    );
}

export default CategoryTabs;
