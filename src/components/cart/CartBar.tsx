import { useCart } from "../../context/CartContext";
import { getOrderSubtotal } from "../../utils/orderSummary";

interface CartBarProps {
    onViewCart: () => void;
}

function CartBar({ onViewCart }: CartBarProps) {
    const { cartItems } = useCart();

    if (cartItems.length === 0) {
        return null;
    }

    const totalItems = cartItems.reduce(
        (total, cartItem) => total + cartItem.quantity,
        0
    );

    const totalPrice = getOrderSubtotal(cartItems);

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-gray-950/95 px-3 pt-3 shadow-2xl backdrop-blur-xl pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto max-w-6xl">
                {/* Main cart row */}
                <div className="flex items-center gap-3">
                    {/* Cart information */}
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm">
                            🛒
                        </span>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                                {totalItems}{" "}
                                {totalItems === 1 ? "item" : "items"}
                            </p>

                            <p className="text-xs font-medium text-gray-500">
                                Pickup Only
                            </p>
                        </div>
                    </div>

                    {/* Desktop subtotal */}
                    <div className="hidden shrink-0 text-right sm:block">
                        <p className="text-xs font-medium text-gray-500">
                            Subtotal
                        </p>

                        <p className="text-lg font-extrabold text-yellow-400">
                            ₹{totalPrice}
                        </p>
                    </div>

                    {/* View cart */}
                    <button
                        onClick={onViewCart}
                        className="shrink-0 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-extrabold text-gray-950 shadow-lg shadow-yellow-400/10 transition hover:bg-yellow-300 active:scale-[0.97] sm:px-6"
                    >
                        <span className="sm:hidden">
                            View Cart
                        </span>

                        <span className="hidden sm:inline">
                            View Cart →
                        </span>
                    </button>
                </div>

                {/* Mobile subtotal */}
                <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 sm:hidden">
                    <span className="text-xs font-medium text-gray-500">
                        Subtotal
                    </span>

                    <span className="text-sm font-extrabold text-yellow-400">
                        ₹{totalPrice}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CartBar;