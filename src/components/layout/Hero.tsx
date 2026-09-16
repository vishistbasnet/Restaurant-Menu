import { restaurant } from "../../data/restaurant";
function Hero() {
    return (
        <section className="relative overflow-hidden border-b border-white/10 bg-gray-950">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
                <div className="max-w-2xl">

                    {/* Small label */}
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        100% Pure Vegetarian
                    </div>

                    {/* Main heading */}
                    <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
                        Delicious food.
                        <span className="block text-yellow-400">
                            Made fresh for you.
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="mt-5 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
                        Explore our vegetarian menu featuring Chinese, snacks,
                        burgers, pizza, pasta, momos and more.
                    </p>

                    {/* Pickup information */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                            🏪 Pickup Only
                        </div>

                        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                            📞 Call to Order
                        </div>
                    </div>

                    {/* CTA */}
                    <a
                        href={`tel:${restaurant.phone}`}
                        className="mt-8 inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-bold text-gray-950 shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300 active:scale-95"
                    >
                        📞 Call to Order
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Hero;