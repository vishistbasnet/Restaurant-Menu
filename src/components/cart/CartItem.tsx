import { useCart } from "../../context/useCart";
import {
    getItemPrice,
    getItemTotal,
} from "../../utils/orderSummary";
import type { CartItem as CartItemType } from "../../types/menu";

interface CartItemProps {
    cartItem: CartItemType;
}

function CartItem({ cartItem }: CartItemProps) {
    const { updateQuantity, removeFromCart } = useCart();

    const { item, quantity, selectedOption } = cartItem;

    const price = getItemPrice(cartItem);
    const itemTotal = getItemTotal(cartItem);

    const optionLabel = selectedOption?.label;

    return (
        <div className="w-full min-w-0 py-4">
            {/* Item header */}
            <div className="min-w-0">
                <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="break-words text-base font-bold leading-6 text-white sm:text-lg">
                            {item.name}
                        </h3>

                        <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-2">
                            {optionLabel && (
                                <span className="max-w-full truncate rounded-md bg-yellow-400/10 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                                    {optionLabel}
                                </span>
                            )}

                            {price !== null && (
                                <span className="text-xs text-gray-500 sm:text-sm">
                                    ₹{price} each
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            removeFromCart(item.id, optionLabel)
                        }
                        className="shrink-0 rounded-lg px-1 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-400/10 hover:text-red-300 active:scale-95"
                    >
                        Remove
                    </button>
                </div>
            </div>

            {/* Bottom row */}
            <div className="mt-4 flex min-w-0 items-center justify-between gap-3">
                {/* Total */}
                <div className="min-w-0 flex-1">
                    <p className="text-lg font-black text-yellow-400">
                        {itemTotal !== null
                            ? `₹${itemTotal}`
                            : "Price unavailable"}
                    </p>

                    {quantity > 1 && (
                        <p className="mt-0.5 text-xs text-gray-500">
                            {quantity} items
                        </p>
                    )}
                </div>

                {/* Quantity controls */}
                <div className="flex shrink-0 items-center rounded-xl border border-white/10 bg-white/[0.04] p-1">
                    <button
                        type="button"
                        onClick={() =>
                            updateQuantity(
                                item.id,
                                quantity - 1,
                                optionLabel
                            )
                        }
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-gray-300 transition hover:bg-white/10 hover:text-white active:scale-95"
                    >
                        −
                    </button>

                    <span
                        aria-label={`Quantity ${quantity}`}
                        className="flex h-9 min-w-9 items-center justify-center px-1 text-sm font-bold text-white"
                    >
                        {quantity}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            updateQuantity(
                                item.id,
                                quantity + 1,
                                optionLabel
                            )
                        }
                        aria-label={`Increase quantity of ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 text-lg font-black text-gray-950 transition hover:bg-yellow-300 active:scale-95"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
