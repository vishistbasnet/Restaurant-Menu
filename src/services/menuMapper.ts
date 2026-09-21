import type { MenuItem, PriceOption } from "../types/menu";
import type {
    SupabaseMenuItem,
} from "./menuService";

interface MapMenuItemsOptions {
    categoryMap: Map<string, string>;
}

export function mapSupabaseMenuItems(
    items: SupabaseMenuItem[],
    { categoryMap }: MapMenuItemsOptions
): MenuItem[] {
    return items.map((item) => {
        const availableOptions = (
            item.menu_item_options ?? []
        )
            .filter(
                (option) => option.is_available
            )
            .sort(
                (a, b) =>
                    a.sort_order - b.sort_order
            );

        /*
         * Item has multiple pricing options.
         *
         * Example:
         * Half -> ₹40
         * Full -> ₹70
         */
        if (availableOptions.length > 0) {
            const options: PriceOption[] =
                availableOptions.map(
                    (option) => ({
                        id: option.id,
                        label: option.label,
                        price: option.price,
                    })
                );

            return {
                id: item.id,
                name: item.name,
                category:
                    categoryMap.get(
                        item.category_id
                    ) ?? "Uncategorized",
                description:
                    item.description ??
                    undefined,
                isVeg: item.is_veg,

                pricing: {
                    type: "options",
                    options,
                },
            };
        }

        /*
         * Normal single-price item.
         */
        return {
            id: item.id,
            name: item.name,
            category:
                categoryMap.get(
                    item.category_id
                ) ?? "Uncategorized",
            description:
                item.description ??
                undefined,
            isVeg: item.is_veg,

            pricing: {
                type: "single",
                price: item.price,
            },
        };
    });
}