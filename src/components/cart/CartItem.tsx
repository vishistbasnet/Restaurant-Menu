import { useCart } from "../../context/CartContext";
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
        <div className="py-4">
            {/* Item information */}
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="text-base font-bold leading-6 text-white sm:text-lg">
                        {item.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        {optionLabel && (
                            <span className="rounded-md bg-yellow-400/10 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                                {optionLabel}
                            </span>
                        )}

                        {price !== null && (
                            <span className="text-sm text-gray-500">
                                ₹{price} each
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={() =>
                        removeFromCart(item.id, optionLabel)
                    }
                    className="shrink-0 text-xs font-semibold text-red-400 transition hover:text-red-300"
                >
                    Remove
                </button>
            </div>

            {/* Price + quantity */}
            <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-lg font-black text-yellow-400">
                    {itemTotal !== null
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
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-bold text-white transition hover:bg-white/10 active:scale-95"
                    >
                        −
                    </button>

                    <span
                        aria-label={`Quantity ${quantity}`}
                        className="flex h-10 min-w-8 items-center justify-center text-base font-bold text-white"
                    >
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
                        aria-label={`Increase quantity of ${item.name}`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-lg font-black text-gray-950 transition hover:bg-yellow-300 active:scale-95"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;