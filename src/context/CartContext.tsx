import {
    useState,
    type ReactNode,
} from "react";

import type {
    CartItem,
    MenuItem,
    PriceOption,
} from "../types/menu";

import { CartContext } from "./CartContextValue";

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    function addToCart(
        item: MenuItem,
        selectedOption?: PriceOption
    ) {
        setCartItems((currentItems) => {
            const existingItem = currentItems.find((cartItem) => {
                const sameItem = cartItem.item.id === item.id;

                const sameOption =
                    cartItem.selectedOption?.label ===
                    selectedOption?.label;

                return sameItem && sameOption;
            });

            if (existingItem) {
                return currentItems.map((cartItem) =>
                    cartItem === existingItem
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + 1,
                        }
                        : cartItem
                );
            }

            return [
                ...currentItems,
                {
                    item,
                    quantity: 1,
                    selectedOption,
                },
            ];
        });
    }

    function removeFromCart(
        itemId: string,
        selectedOptionLabel?: string
    ) {
        setCartItems((currentItems) =>
            currentItems.filter((cartItem) => {
                const sameItem = cartItem.item.id === itemId;

                const sameOption =
                    cartItem.selectedOption?.label ===
                    selectedOptionLabel;

                return !(sameItem && sameOption);
            })
        );
    }

    function updateQuantity(
        itemId: string,
        quantity: number,
        selectedOptionLabel?: string
    ) {
        if (quantity <= 0) {
            removeFromCart(itemId, selectedOptionLabel);
            return;
        }

        setCartItems((currentItems) =>
            currentItems.map((cartItem) => {
                const sameItem = cartItem.item.id === itemId;

                const sameOption =
                    cartItem.selectedOption?.label ===
                    selectedOptionLabel;

                if (sameItem && sameOption) {
                    return {
                        ...cartItem,
                        quantity,
                    };
                }

                return cartItem;
            })
        );
    }

    function clearCart() {
        setCartItems([]);
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}