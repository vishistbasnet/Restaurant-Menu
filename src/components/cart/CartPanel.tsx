import { useCart } from "../../context/CartContext";
import CartItem from "./CartItem";

interface CartPanelProps {
    onClose: () => void;
}

function CartPanel({ onClose }: CartPanelProps) {
    const { cartItems } = useCart();

    const totalPrice = cartItems.reduce((total, cartItem) => {
        const price =
            cartItem.selectedOption?.price ??
            (cartItem.item.pricing.type === "single"
                ? cartItem.item.pricing.price
                : null);

        if (price !== null) {
            return total + price * cartItem.quantity;
        }

        return total;
    }, 0);

    return (
        <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <button
                aria-label="Close cart"
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-gray-950 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
                            Your Order
                        </p>

                        <h2 className="mt-1 text-2xl font-black text-white">
                            Your Cart
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Close cart"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xl text-gray-300 transition hover:bg-white/10 hover:text-white"
                    >
                        ×
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-5">
                    {cartItems.length > 0 ? (
                        cartItems.map((cartItem) => (
                            <CartItem
                                key={cartItem.item.id}
                                cartItem={cartItem}
                            />
                        ))
                    ) : (
                        <div className="flex h-full items-center justify-center text-center">
                            <div>
                                <div className="text-5xl">🛒</div>

                                <h3 className="mt-4 text-lg font-bold text-white">
                                    Your cart is empty
                                </h3>

                                <p className="mt-2 text-sm text-gray-400">
                                    Add some delicious vegetarian food to get started.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/10 bg-gray-900/80 p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400">
                            Subtotal
                        </span>

                        <span className="text-xl font-extrabold text-yellow-400">
                            ₹{totalPrice}
                        </span>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-2">
                            <span>🏪</span>

                            <div>
                                <p className="font-bold text-white">
                                    Pickup Only
                                </p>

                                <p className="text-xs text-gray-400">
                                    Please call the restaurant to confirm your order.
                                </p>
                            </div>
                        </div>
                    </div>

                    <a
                        href="tel:+910000000000"
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3.5 font-bold text-gray-950 transition hover:bg-yellow-300 active:scale-[0.98]"
                    >
                        📞 Call to Order
                    </a>
                </div>
            </aside>
        </div>
    );
}

export default CartPanel;