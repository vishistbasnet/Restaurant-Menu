import { createContext } from "react";

import type { CartItem, MenuItem, PriceOption } from "../types/menu";

export interface CartContextType {
    cartItems: CartItem[];

    addToCart: (
        item: MenuItem,
        selectedOption?: PriceOption
    ) => void;

    removeFromCart: (
        itemId: string,
        selectedOptionLabel?: string
    ) => void;

    updateQuantity: (
        itemId: string,
        quantity: number,
        selectedOptionLabel?: string
    ) => void;

    clearCart: () => void;
}

export const CartContext = createContext<
    CartContextType | undefined
>(undefined);