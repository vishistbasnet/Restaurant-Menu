import { restaurant } from "../data/restaurant";
function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

                {/* Brand */}
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-yellow-400 sm:text-2xl">
                        Meal & Deal
                    </h1>

                    <p className="mt-0.5 text-xs font-medium text-gray-400">
                        100% Pure Vegetarian
                    </p>
                </div>

                {/* Call Button */}
                <a
                    href={`tel:${restaurant.phone}`}
                    className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 active:scale-95"
                >
                    📞 Call to Order
                </a>
            </div>
        </header>
    );
}

export default Header;