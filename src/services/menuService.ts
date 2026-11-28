import { restGet } from "../lib/publicApi";

import type { Restaurant } from "../types/restaurant";

export interface SupabaseMenuItemOption {
    id: string;
    menu_item_id: string;
    label: string;
    price: number | null;
    sort_order: number;
    is_available: boolean;
}

export interface SupabaseMenuItem {
    id: string;
    restaurant_id: string;
    category_id: string;
    name: string;
    description: string | null;
    is_veg: boolean;
    price: number | null;
    is_available: boolean;
    sort_order: number;
    menu_item_options: SupabaseMenuItemOption[];
}

export interface SupabaseCategory {
    id: string;
    restaurant_id: string;
    name: string;
    sort_order: number;
    is_active: boolean;
}

/*
 * ---------------------------------------------------------
 * RESTAURANT
 * ---------------------------------------------------------
 */

export async function getRestaurant(): Promise<Restaurant> {
    const rows = await restGet<Restaurant[]>("restaurants", {
        select:
            "id,name,is_active,opening_time,closing_time,phone,whatsapp,order_type",
        limit: "1",
    });

    const data = rows[0];

    if (!data) {
        throw new Error("No restaurant found.");
    }

    return {
        id: data.id,
        name: data.name,
        is_active: data.is_active,
        opening_time: data.opening_time,
        closing_time: data.closing_time,
        phone: data.phone ?? null,
        whatsapp: data.whatsapp ?? null,
        order_type: data.order_type,
    };
}

/*
 * ---------------------------------------------------------
 * CATEGORIES
 * ---------------------------------------------------------
 */

export async function getCategories(
    restaurantId: string
): Promise<SupabaseCategory[]> {
    return restGet<SupabaseCategory[]>("categories", {
        select: "id,restaurant_id,name,sort_order,is_active",
        restaurant_id: `eq.${restaurantId}`,
        is_active: "eq.true",
        order: "sort_order.asc",
    });
}

/*
 * ---------------------------------------------------------
 * MENU ITEMS + PRICING OPTIONS
 * ---------------------------------------------------------
 */

export async function getMenuItems(
    restaurantId: string
): Promise<SupabaseMenuItem[]> {
    return restGet<SupabaseMenuItem[]>("menu_items", {
        select:
            "id,restaurant_id,category_id,name,description,is_veg,price,is_available,sort_order," +
            "menu_item_options(id,menu_item_id,label,price,sort_order,is_available)",
        restaurant_id: `eq.${restaurantId}`,
        is_available: "eq.true",
        order: "sort_order.asc",
    });
}
