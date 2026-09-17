import type { CartItem } from "../types/menu";

export function getItemPrice(cartItem: CartItem): number | null {
    if (cartItem.selectedOption?.price !== undefined) {
        return cartItem.selectedOption.price;
    }

    if (cartItem.item.pricing.type === "single") {
        return cartItem.item.pricing.price;
    }

    return null;
}

export function getItemTotal(cartItem: CartItem): number | null {
    const price = getItemPrice(cartItem);

    if (price === null) {
        return null;
    }

    return price * cartItem.quantity;
}

export function getOrderSubtotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, cartItem) => {
        const itemTotal = getItemTotal(cartItem);

        if (itemTotal === null) {
            return total;
        }

        return total + itemTotal;
    }, 0);
}

export interface OrderItem {
    itemId: string;
    itemName: string;
    option?: string;
    quantity: number;
    unitPrice: number | null;
    totalPrice: number | null;
}

export interface OrderData {
    items: OrderItem[];
    subtotal: number;
    orderType: "pickup";
}

export function createOrderData(
    cartItems: CartItem[]
): OrderData {
    const items: OrderItem[] = cartItems.map((cartItem) => {
        const unitPrice = getItemPrice(cartItem);
        const totalPrice = getItemTotal(cartItem);

        return {
            itemId: cartItem.item.id,
            itemName: cartItem.item.name,
            option: cartItem.selectedOption?.label,
            quantity: cartItem.quantity,
            unitPrice,
            totalPrice,
        };
    });

    return {
        items,
        subtotal: getOrderSubtotal(cartItems),
        orderType: "pickup",
    };
}

interface FormatOrderSummaryOptions {
    restaurantName?: string;
    isOpen?: boolean;
    statusMessage?: string;
}

export function formatOrderSummary(
    order: OrderData,
    options: FormatOrderSummaryOptions = {}
): string {
    const restaurantName =
        options.restaurantName ?? "Meal & Deal";

    const isOpen = options.isOpen ?? true;

    const lines: string[] = [];

    lines.push(`🍽️ ${restaurantName}`);
    lines.push("100% Pure Vegetarian");
    lines.push("");

    if (!isOpen) {
        lines.push("🔴 RESTAURANT CURRENTLY CLOSED");
        lines.push(`⏰ ${options.statusMessage ?? "Please order later."}`);
        lines.push("");
    }

    lines.push("🧾 Order Summary");
    lines.push("--------------------");

    order.items.forEach((item, index) => {
        const optionText = item.option
            ? ` (${item.option})`
            : "";

        const priceText =
            item.totalPrice !== null
                ? `₹${item.totalPrice}`
                : "Price unavailable";

        lines.push(
            `${index + 1}. ${item.itemName}${optionText}`
        );

        lines.push(
            `   ${item.quantity} × ₹${item.unitPrice ?? "N/A"} = ${priceText}`
        );
    });

    lines.push("--------------------");
    lines.push(`Subtotal: ₹${order.subtotal}`);
    lines.push("Order Type: Pickup");
    lines.push("");

    if (isOpen) {
        lines.push(
            "📞 Please call the restaurant to confirm your order."
        );
        lines.push("🏪 Pickup Only");
    } else {
        lines.push("🚫 Ordering is currently closed.");
        lines.push("🏪 Pickup Only");
        lines.push("");
        lines.push("Please place your order when the restaurant is open.");
    }

    return lines.join("\n");
}

export async function copyOrderSummary(
    orderSummary: string
): Promise<void> {
    // Try the modern Clipboard API first.
    if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        window.isSecureContext
    ) {
        await navigator.clipboard.writeText(orderSummary);
        return;
    }

    // Mobile / non-HTTPS fallback.
    const textarea = document.createElement("textarea");

    textarea.value = orderSummary;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const copied = document.execCommand("copy");

    document.body.removeChild(textarea);

    if (!copied) {
        throw new Error("Unable to copy order summary.");
    }
}
export function createWhatsAppOrderUrl(
    phone: string,
    orderSummary: string
): string {
    const cleanPhone = phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(orderSummary);

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}