import { restaurant } from "../../data/restaurant";
import { createWhatsAppOrderUrl } from "../../utils/orderSummary";

function Hero() {
    const whatsappUrl = createWhatsAppOrderUrl(
        restaurant.whatsapp,
        "Hello Meal & Deal! I would like to know about the menu."
    );
    return (
        <section className="relative overflow-hidden border-b border-white/10 bg-gray-950">
            {/* Decorative glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl"
            />

            <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
                <div className="max-w-3xl">
                    {/* Restaurant identity */}
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-bold text-green-400">
                            <span className="h-2 w-2 rounded-full bg-green-400" />
                            100% Pure Vegetarian
                        </span>

                        <span className="text-sm font-medium text-gray-500">
                            Fresh • Delicious • Made with care
                        </span>
                    </div>

                    {/* Heading */}
                    <h2 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Good food.
                        <span className="block text-yellow-400">
                            Good mood.
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                        Explore our vegetarian menu featuring Chinese,
                        snacks, burgers, pizza, pasta, momos and more.
                        Choose your favorites, add them to your cart,
                        and call us to confirm your pickup order.
                    </p>

                    {/* Service information */}
                    <div className="mt-7 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="flex items-start gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-lg">
                                    🏪
                                </span>

                                <div>
                                    <p className="text-sm font-bold text-white">
                                        Pickup Only
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Order ahead and collect your food from
                                        the restaurant.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="flex items-start gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-lg">
                                    📞
                                </span>

                                <div>
                                    <p className="text-sm font-bold text-white">
                                        Easy Ordering
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Add items to your cart and call to
                                        confirm your order.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Primary CTA */}
                    <div className="mt-8">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <a
                                href={`tel:${restaurant.phone}`}
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 text-sm font-extrabold text-gray-950 shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300 active:scale-[0.98]"
                            >
                                📞 Call to Order
                            </a>

                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-green-400/30 bg-green-500/10 px-6 py-3 text-sm font-extrabold text-green-400 transition hover:bg-green-500/20 active:scale-[0.98]"
                            >
                                💬 WhatsApp
                            </a>
                        </div>

                        <p className="mt-3 text-center text-xs text-gray-500 sm:text-left">
                            Pickup only • No delivery
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;