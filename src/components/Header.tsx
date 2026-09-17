import type { Restaurant } from "../types/restaurant";
import type { RestaurantStatus } from "../utils/restaurantHours";

interface HeaderProps {
    restaurant: Restaurant | null;
    status: RestaurantStatus | null;
}

function Header({ restaurant, status }: HeaderProps) {
    const phone = restaurant?.phone;
    const isOpen = status?.isOpen ?? false;

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/90 backdrop-blur-xl">
            <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-lg font-black text-gray-950">
                        M
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                            {restaurant?.name ?? "Meal & Deal"}
                        </p>

                        <div className="flex items-center gap-1.5">
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-green-400" : "bg-red-400"
                                    }`}
                            />

                            <span
                                className={`text-[10px] font-semibold uppercase tracking-wider ${isOpen ? "text-green-300" : "text-red-300"
                                    }`}
                            >
                                {status?.label ?? "CLOSED"}
                            </span>
                        </div>
                    </div>
                </div>

                {phone && isOpen ? (
                    <a
                        href={`tel:${phone}`}
                        className="flex shrink-0 items-center gap-2 rounded-full bg-yellow-400 px-3.5 py-2 text-xs font-bold text-gray-950 transition hover:bg-yellow-300 active:scale-95 sm:px-4 sm:text-sm"
                    >
                        <span aria-hidden="true">📞</span>
                        <span>Call to Order</span>
                    </a>
                ) : (
                    <span className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 px-3.5 py-2 text-xs font-semibold text-gray-500 sm:px-4 sm:text-sm">
                        <span aria-hidden="true">🔒</span>
                        <span>Closed</span>
                    </span>
                )}
            </div>
        </header>
    );
}

export default Header;
