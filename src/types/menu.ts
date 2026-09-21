export interface PriceOption {
    id?: string;
    label: string;
    price: number | null;
}

export interface MenuItem {
    id: string;
    name: string;
    category: string;
    description?: string;
    isVeg: boolean;

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
    selectedOption?: PriceOption;
}