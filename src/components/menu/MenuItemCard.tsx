import { useCart } from "../../context/CartContext";
import type { MenuItem } from "../../types/menu";

interface MenuItemCardProps {
    item: MenuItem;
}

function MenuItemCard({ item }: MenuItemCardProps) {
    const { addToCart } = useCart();

    return (
        <article className="group flex min-h-[190px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-200 hover:-translate-y-1 hover:border-yellow-400/30 hover:bg-white/[0.05] hover:shadow-xl hover:shadow-black/20">
            {/* Item header */}
            <div>
                <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/20 bg-green-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        Veg
                    </span>

                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                        {item.category}
                    </span>
                </div>

                <h3 className="mt-4 text-xl font-extrabold leading-7 text-white transition group-hover:text-yellow-50">
                    {item.name}
                </h3>

                {item.description ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                        {item.description}
                    </p>
                ) : (
                    <p className="mt-2 text-sm text-gray-600">
                        Freshly prepared vegetarian dish.
                    </p>
                )}
            </div>

            {/* Pricing */}
            <div className="mt-6">
                {item.pricing.type === "single" ? (
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-600">
                                Price
                            </p>

                            <p className="mt-0.5 text-2xl font-black text-yellow-400">
                                {item.pricing.price !== null
                                    ? `₹${item.pricing.price}`
                                    : "N/A"}
                            </p>
                        </div>

                        <button
                            disabled={item.pricing.price === null}
                            onClick={() => addToCart(item)}
                            className="min-h-11 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-extrabold text-gray-950 shadow-lg shadow-yellow-400/5 transition hover:bg-yellow-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            + Add
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {item.pricing.options.map((option) => (
                            <div
                                key={option.label}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 transition group-hover:border-white/10"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-300">
                                        {option.label}
                                    </p>

                                    <p className="mt-0.5 text-base font-extrabold text-yellow-400">
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