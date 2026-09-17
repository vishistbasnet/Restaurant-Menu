import { MapPin, Map, Leaf, ShoppingBag, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const GOOGLE_MAPS_URL =
    "https://maps.app.goo.gl/vzYGXPYu2sq2LfF59";

function Footer() {
    return (
        <footer className="border-t border-white/10 bg-gray-950">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Brand */}
                    <div>
                        <h2 className="text-xl font-black text-white">
                            Meal <span className="text-yellow-400">&</span> Deal
                        </h2>

                        <p className="mt-2 text-sm font-medium text-gray-400">
                            100% Pure Vegetarian
                        </p>

                        <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
                            Fresh, delicious vegetarian food made with care.
                            Browse our menu and place your pickup order.
                        </p>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                            Find Us
                        </h3>

                        <div className="mt-4 flex items-start gap-3">
                            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />

                            <div>
                                <p className="text-sm font-medium leading-6 text-gray-300">
                                    QXQC+J23
                                    <br />
                                    Lucknow, Uttar Pradesh
                                </p>

                                <a
                                    href={GOOGLE_MAPS_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300"
                                >
                                    <Map className="h-4 w-4" />
                                    View Location on Google Maps
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Restaurant Info */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                            Restaurant
                        </h3>

                        <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Leaf className="h-4 w-4 text-yellow-400" />
                                100% Pure Vegetarian
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <ShoppingBag className="h-4 w-4 text-yellow-400" />
                                Pickup Only
                            </div>

                            <Link
                                to="/admin/login"
                                className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-gray-500 transition hover:text-yellow-400"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Staff / Admin Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} Meal & Deal. All rights reserved.
                    </p>

                    <p className="text-xs text-gray-600">
                        Good Food • Great Deals
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
