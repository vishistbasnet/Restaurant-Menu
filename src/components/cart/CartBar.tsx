import { useCart } from "../../context/CartContext";

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
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-gray-900/95 p-3 shadow-2xl backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-white">
                        🛒 {totalItems}{" "}
                        {totalItems === 1 ? "item" : "items"}
                    </p>

                    <p className="text-lg font-extrabold text-yellow-400">
                        ₹{totalPrice}
                    </p>
                </div>

                <button
                    onClick={onViewCart}
                    className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 active:scale-95"
                >
                    View Cart →
                </button>
            </div>
        </div>
    );
}

export default CartBar;