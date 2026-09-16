export interface PriceOption {
    label: string;
    price: number | null;
}

export interface MenuItem {
    id: string;
    name: string;
    category: string;
    description?: string;
    isVeg: true;

    pricing:
    | {
        type: "single";
        price: number | null;
    }
    | {
        type: "options";
        options: PriceOption[];
    };
}

export interface CartItem {
    item: MenuItem;
    quantity: number;

    // Selected option for items with multiple prices.
    // Example: Half / Full
    selectedOption?: PriceOption;
}