import { useCart } from "../../context/useCart";
import type { MenuItem } from "../../types/menu";

interface MenuItemCardProps {
    item: MenuItem;
}

function MenuItemCard({ item }: MenuItemCardProps) {
    const { addToCart } = useCart();

    return (
        <article className="group flex min-h-[180px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-yellow-400/30 hover:bg-white/[0.05]">
            <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                    <span className="rounded-md border border-green-400/20 bg-green-400/10 px-2 py-1 text-xs font-bold text-green-400">
                        VEG
                    </span>

                    <span className="text-xs font-medium text-gray-500">
                        {item.category}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                    {item.name}
                </h3>

                {item.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                        {item.description}
                    </p>
                )}
            </div>

            <div className="mt-5">
                {/* Single price item */}
                {item.pricing.type === "single" ? (
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xl font-extrabold text-yellow-400">
                            {item.pricing.price !== null
                                ? `₹${item.pricing.price}`
                                : "Price unavailable"}
                        </span>

                        <button
                            disabled={item.pricing.price === null}
                            onClick={() => addToCart(item)}
                            className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            + Add
                        </button>
                    </div>
                ) : (
                    /* Multiple price options */
                    <div className="space-y-2">
                        {item.pricing.options.map((option) => (
                            <div
                                key={option.label}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3.5 py-3 transition group-hover:border-white/10"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-300">
                                        {option.label}
                                    </p>

                                    <p className="mt-1 text-lg font-black leading-none text-yellow-400">
                                        {option.price !== null
                                            ? `₹${option.price}`
                                            : "Price unavailable"}
                                    </p>
                                </div>

                                <button
                                    disabled={option.price === null}
                                    onClick={() => addToCart(item, option)}
                                    className="min-h-10 shrink-0 rounded-lg bg-yellow-400 px-4 py-2 text-xs font-extrabold text-gray-950 transition hover:bg-yellow-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    + Add
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}

export default MenuItemCard;
