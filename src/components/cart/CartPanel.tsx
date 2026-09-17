import { useState } from "react";

import { useCart } from "../../context/CartContext";

import type { Restaurant } from "../../types/restaurant";
import type { RestaurantStatus } from "../../utils/restaurantHours";

import {
    copyOrderSummary,
    createOrderData,
    createWhatsAppOrderUrl,
    formatOrderSummary,
} from "../../utils/orderSummary";

import CartItem from "./CartItem";

interface CartPanelProps {
    onClose: () => void;
    restaurant: Restaurant | null;
    status: RestaurantStatus | null;
}

function CartPanel({
    onClose,
    restaurant,
    status,
}: CartPanelProps) {
    const { cartItems } = useCart();

    const [isCopied, setIsCopied] = useState(false);

    const order = createOrderData(cartItems);

    const isOpen = status?.isOpen ?? false;

    const orderSummary = formatOrderSummary(order, {
        restaurantName: restaurant?.name,
        isOpen,
        statusMessage: status?.message,
    });

    const whatsappUrl = restaurant?.whatsapp
        ? createWhatsAppOrderUrl(
            restaurant.whatsapp,
            orderSummary
        )
        : null;

    const totalItems = cartItems.reduce(
        (total, cartItem) => total + cartItem.quantity,
        0
    );

    async function handleCopyOrder() {
        try {
            await copyOrderSummary(orderSummary);

            setIsCopied(true);

            window.setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy order:", error);

            window.alert(
                "Copy was blocked by your browser. Please select and copy the order text manually."
            );
        }
    }

    return (
        <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <button
                aria-label="Close cart"
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Cart panel */}
            <aside className="absolute inset-y-0 right-0 flex h-full w-full min-w-0 max-w-full flex-col overflow-x-hidden bg-gray-950 sm:max-w-md sm:border-l sm:border-white/10 sm:shadow-2xl">

                {/* Header */}
                <div className="mx-5 mt-4 shrink-0 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                                Your Order
                            </p>

                            <h2 className="mt-1 text-2xl font-black text-white">
                                Your Cart
                            </h2>

                            {totalItems > 0 && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {totalItems}{" "}
                                    {totalItems === 1
                                        ? "item"
                                        : "items"}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            aria-label="Close cart"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Cart items */}
                <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-2 sm:px-5">
                    {cartItems.length > 0 ? (
                        <div className="w-full min-w-0 space-y-3 py-3">
                            {cartItems.map((cartItem, index) => (
                                <div
                                    key={`${cartItem.item.id}-${cartItem.selectedOption?.label ?? "default"}-${index}`}
                                    className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4"
                                >
                                    <CartItem cartItem={cartItem} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center">
                            <div className="max-w-xs">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-4xl">
                                    🛒
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-white">
                                    Your cart is empty
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-400">
                                    Add some delicious vegetarian food
                                    to build your order.
                                </p>

                                <button
                                    onClick={onClose}
                                    className="mt-6 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 active:scale-95"
                                >
                                    Browse Menu
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="max-h-[48vh] min-w-0 shrink-0 overflow-y-auto overflow-x-hidden border-t border-white/10 bg-gray-900/95 p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">

                        {/* Summary */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="flex items-center justify-between gap-4">

                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-lg">
                                        🏪
                                    </span>

                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-white">
                                            Pickup Only
                                        </p>

                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {isOpen
                                                ? "Call to confirm your order"
                                                : status?.message ??
                                                "Ordering is closed"}
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-xs font-medium text-gray-500">
                                        Subtotal
                                    </p>

                                    <p className="mt-0.5 text-2xl font-black text-yellow-400">
                                        ₹{order.subtotal}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Closed warning */}
                        {!isOpen && (
                            <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-4 text-center">
                                <p className="text-sm font-bold text-red-300">
                                    🔴 Ordering is closed
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {status?.message}
                                </p>
                            </div>
                        )}

                        {/* Secondary actions */}
                        <div className="mt-4 grid grid-cols-2 gap-3">

                            {/* Copy always available */}
                            <button
                                onClick={handleCopyOrder}
                                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 active:scale-[0.98]"
                            >
                                {isCopied
                                    ? "✓ Copied"
                                    : "📋 Copy Order"}
                            </button>

                            {/* WhatsApp */}
                            {isOpen && whatsappUrl ? (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-green-400 active:scale-[0.98]"
                                >
                                    💬 WhatsApp
                                </a>
                            ) : (
                                <span className="flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-sm font-bold text-gray-600">
                                    🔒 WhatsApp
                                </span>
                            )}
                        </div>

                        {/* Call */}
                        {isOpen && restaurant?.phone ? (
                            <a
                                href={`tel:${restaurant.phone}`}
                                className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-extrabold text-gray-950 shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300 active:scale-[0.98]"
                            >
                                📞 Call to Order
                            </a>
                        ) : (
                            <span className="mt-4 flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/5 px-5 py-3.5 text-sm font-extrabold text-gray-600">
                                🔒 Ordering Closed
                            </span>
                        )}

                        <p className="mt-2 text-center text-xs font-medium text-gray-500">
                            No delivery • Pickup from restaurant
                        </p>
                    </div>
                )}
            </aside>
        </div>
    );
}

export default CartPanel;