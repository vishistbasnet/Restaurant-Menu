import type { MenuItem, PriceOption } from "../types/menu";

interface SupabaseMenuOption {
    id: string;
    label: string;
    price: number | null;
    sort_order: number;
    is_available: boolean;
}

interface SupabaseMenuItem {
    id: string;
    name: string;
    description: string | null;
    is_veg: true;
    price: number | null;
    menu_item_options: SupabaseMenuOption[];
    category_id: string;
}

interface MapMenuItemsOptions {
    categoryMap: Map<string, string>;
}

export function mapSupabaseMenuItems(
    items: SupabaseMenuItem[],
    { categoryMap }: MapMenuItemsOptions
): MenuItem[] {
    return items.map((item) => {
        const availableOptions = item.menu_item_options
            .filter((option) => option.is_available)
            .sort((a, b) => a.sort_order - b.sort_order);

        const pricing =
            availableOptions.length > 0
                ? {
                    type: "options" as const,
                    options: availableOptions.map(
                        (option): PriceOption => ({
                            label: option.label,
                            price: option.price,
                        })
                    ),
                }
                : {
                    type: "single" as const,
                    price: item.price,
                };

        return {
            id: item.id,
            name: item.name,
            category: categoryMap.get(item.category_id) ?? "Uncategorized",
            description: item.description ?? undefined,
            isVeg: item.is_veg,
            pricing,
        };
    });
}