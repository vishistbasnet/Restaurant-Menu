import { useEffect, useState } from "react";

import {
    getRestaurantSettings,
    updateRestaurantSettings,
    type RestaurantSettings,
} from "../services/settingsAdminService";

function AdminSettings() {
    const [settings, setSettings] =
        useState<RestaurantSettings | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [openingTime, setOpeningTime] = useState("11:00");
    const [closingTime, setClosingTime] = useState("22:00");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        async function loadSettings() {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getRestaurantSettings();

                setSettings(data);
                setName(data.name);
                setPhone(data.phone ?? "");
                setWhatsapp(data.whatsapp ?? "");
                setIsActive(data.is_active);

                setOpeningTime(
                    data.opening_time?.slice(0, 5) ?? "11:00"
                );

                setClosingTime(
                    data.closing_time?.slice(0, 5) ?? "22:00"
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load settings."
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadSettings();
    }, []);

    async function handleSave(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        try {
            setIsSaving(true);
            setError(null);
            setSuccess(null);

            const updated = await updateRestaurantSettings({
                name,
                phone,
                whatsapp,
                isActive,
                openingTime,
                closingTime,
            });

            setSettings(updated);

            setSuccess("Restaurant settings saved successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save settings."
            );
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-400">
                    Loading restaurant settings...
                </div>
            </div>
        );
    }

    if (!settings && error) {
        return (
            <div className="p-6">
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-300">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-4 sm:p-6">
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-400">
                    Restaurant
                </p>

                <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                    Restaurant Settings
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    Manage your restaurant information and opening hours.
                </p>
            </div>

            {error && (
                <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-5 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm text-green-300">
                    {success}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
                {/* Basic Information */}
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-white">
                        Basic Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Information shown to customers on the menu.
                    </p>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-300">
                                Restaurant Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400/50"
                                placeholder="Restaurant name"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-300">
                                Phone
                            </label>

                            <input
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400/50"
                                placeholder="+91..."
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-300">
                                WhatsApp
                            </label>

                            <input
                                type="tel"
                                value={whatsapp}
                                onChange={(event) =>
                                    setWhatsapp(event.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400/50"
                                placeholder="91..."
                            />
                        </div>
                    </div>
                </section>

                {/* Opening Hours */}
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-white">
                        Opening Hours
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Set the daily opening and closing time.
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-300">
                                Opening Time
                            </label>

                            <input
                                type="time"
                                value={openingTime}
                                onChange={(event) =>
                                    setOpeningTime(event.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-300">
                                Closing Time
                            </label>

                            <input
                                type="time"
                                value={closingTime}
                                onChange={(event) =>
                                    setClosingTime(event.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-yellow-400/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-yellow-400/10 bg-yellow-400/5 px-4 py-3 text-sm text-yellow-200/80">
                        Customers will see the restaurant as closed outside
                        these hours.
                    </div>
                </section>

                {/* Restaurant Status */}
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-white">
                        Restaurant Status
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manually close the restaurant when needed.
                    </p>

                    <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-gray-900/60 p-4">
                        <div>
                            <p className="font-semibold text-white">
                                Accept Orders
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Turn this off for holidays, maintenance, or
                                temporary closure.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(event) =>
                                setIsActive(event.target.checked)
                            }
                            className="h-5 w-5 accent-yellow-400"
                        />
                    </label>

                    {!isActive && (
                        <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                            Restaurant is manually closed. Customers can still
                            browse the menu.
                        </div>
                    )}
                </section>

                {/* Order Type */}
                <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                    <h2 className="text-lg font-bold text-white">
                        Order Type
                    </h2>

                    <div className="mt-4 rounded-xl border border-white/10 bg-gray-900/60 p-4">
                        <p className="font-semibold text-white">
                            Pickup Only
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Customers place orders by phone and collect them
                            from the restaurant.
                        </p>
                    </div>
                </section>

                {/* Save */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminSettings;