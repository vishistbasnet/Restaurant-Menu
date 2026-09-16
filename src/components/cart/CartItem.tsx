import { useCart } from "../../context/CartContext";

import type { CartItem as CartItemType } from "../../types/menu";

import {
    getItemPrice,
    getItemTotal,
} from "../../utils/orderSummary";

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
        <div className="border-b border-white/10 py-4">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="font-semibold text-white">
                        {item.name}
                    </h3>

                    {optionLabel && (
                        <p className="mt-1 text-sm font-medium text-yellow-400">
                            {optionLabel}
                        </p>
                    )}

                    {price !== null ? (
                        <p className="mt-1 text-sm text-gray-400">
                            ₹{price} each
                        </p>
                    ) : (
                        <p className="mt-1 text-sm text-gray-400">
                            Price unavailable
                        </p>
                    )}
                </div>

                <button
                    onClick={() =>
                        removeFromCart(item.id, optionLabel)
                    }
                    className="text-xs font-semibold text-red-400 transition hover:text-red-300"
                >
                    Remove
                </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <p className="font-bold text-white">
                    {price !== null
                        ? `₹${itemTotal}`
                        : "Price unavailable"}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            updateQuantity(
                                item.id,
                                quantity - 1,
                                optionLabel
                            )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg font-bold text-white transition hover:bg-white/10"
                    >
                        −
                    </button>

                    <span className="w-6 text-center font-bold text-white">
                        {quantity}
                    </span>

                    <button
                        onClick={() =>
                            updateQuantity(
                                item.id,
                                quantity + 1,
                                optionLabel
                            )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 text-lg font-bold text-gray-950 transition hover:bg-yellow-300"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;