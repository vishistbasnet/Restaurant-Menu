import type { Restaurant } from "../../types/restaurant";
import type { RestaurantStatus } from "../../utils/restaurantHours";
import heroBackground from "../../assets/meal-deal-food-hero.webp";

interface HeroProps {
    restaurant: Restaurant | null;
    status: RestaurantStatus | null;
}

function Hero({ restaurant, status }: HeroProps) {
    const phone = restaurant?.phone;
    const whatsapp = restaurant?.whatsapp;

    const isOpen = status?.isOpen ?? false;

    const whatsappUrl = whatsapp
        ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
        : null;

    return (
        <section className="relative min-h-[620px] overflow-hidden border-b border-white/10 bg-gray-950">
            {/* Food background */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `url(${heroBackground})`,
                    backgroundPosition: "center right",
                }}
            />

            {/* Left-side readability overlay */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/75 to-transparent"
            />

            {/* Bottom fade into the menu */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"
            />

            {/* Subtle ambient glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl"
            />

            {/* Content */}
            <div className="relative mx-auto flex min-h-[620px] max-w-6xl items-center px-4 py-12 sm:px-6 lg:py-16">
                <div className="max-w-2xl">
                    {/* Status badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold backdrop-blur-md ${isOpen
                                    ? "border-green-400/20 bg-green-400/10 text-green-300"
                                    : "border-red-400/20 bg-red-400/10 text-red-300"
                                }`}
                        >
                            <span>{isOpen ? "🟢" : "🔴"}</span>
                            {status?.label ?? "CLOSED"}
                        </span>

                        <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-xs font-semibold text-yellow-300 backdrop-blur-md">
                            Pickup Only
                        </span>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-bold text-green-300 backdrop-blur-md">
                            <span>🥬</span>
                            100% Pure Vegetarian
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="mt-7">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-yellow-400">
                            {restaurant?.name ?? "Meal & Deal"}
                        </p>

                        <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Fresh food.
                            <br />
                            <span className="text-yellow-400">
                                Simple ordering.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
                            Browse our menu, choose your favorites, and call us
                            to place your pickup order.
                        </p>
                    </div>

                    {/* Status message */}
                    {!isOpen && status && (
                        <div className="mt-6 max-w-xl rounded-2xl border border-red-400/20 bg-gray-950/60 px-4 py-4 backdrop-blur-md">
                            <div className="flex items-start gap-3">
                                <span className="text-lg">🔴</span>

                                <div>
                                    <p className="text-sm font-bold text-red-300">
                                        {status.label}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-300">
                                        {status.message}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        You can still browse our menu. Orders
                                        can be placed when we are open.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isOpen && status && (
                        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-green-400/20 bg-gray-950/50 px-4 py-3 backdrop-blur-md">
                            <span>🟢</span>

                            <span className="text-sm font-semibold text-green-300">
                                {status.message}
                            </span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        {phone && isOpen ? (
                            <a
                                href={`tel:${phone}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-bold text-gray-950 shadow-lg shadow-yellow-400/20 transition hover:bg-yellow-300 active:scale-[0.98]"
                            >
                                <span aria-hidden="true">📞</span>
                                Call to Order
                            </a>
                        ) : (
                            <span className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3.5 text-sm font-semibold text-gray-500 backdrop-blur-md">
                                <span aria-hidden="true">🔒</span>
                                Ordering Closed
                            </span>
                        )}

                        {isOpen && whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-gray-950/50 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                            >
                                <span aria-hidden="true">💬</span>
                                WhatsApp
                            </a>
                        )}
                    </div>

                    {/* Features */}
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Vegetarian menu
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-yellow-400">✓</span>
                            Pickup only
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-pink-400">✓</span>
                            Call to confirm
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
