import { supabase } from "../lib/supabase";

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

/*
 * ---------------------------------------------------------
 * RESTAURANT
 * ---------------------------------------------------------
 */

export async function getRestaurant(): Promise<Restaurant> {
    const { data, error } = await supabase
        .from("restaurants")
        .select(`
            id,
            name,
            is_active,
            opening_time,
            closing_time,
            phone,
            whatsapp,
            order_type
        `)
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new Error(
            `Failed to fetch restaurant: ${error.message}`
        );
    }

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
) {
    const { data, error } = await supabase
        .from("categories")
        .select(`
            id,
            restaurant_id,
            name,
            sort_order,
            is_active
        `)
        .eq("restaurant_id", restaurantId)
        .eq("is_active", true)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        throw new Error(
            `Failed to fetch categories: ${error.message}`
        );
    }

    return data ?? [];
}

/*
 * ---------------------------------------------------------
 * MENU ITEMS + PRICING OPTIONS
 * ---------------------------------------------------------
 */

export async function getMenuItems(
    restaurantId: string
): Promise<SupabaseMenuItem[]> {
    const { data, error } = await supabase
        .from("menu_items")
        .select(`
            id,
            restaurant_id,
            category_id,
            name,
            description,
            is_veg,
            price,
            is_available,
            sort_order,
            menu_item_options (
                id,
                menu_item_id,
                label,
                price,
                sort_order,
                is_available
            )
        `)
        .eq("restaurant_id", restaurantId)
        .eq("is_available", true)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        throw new Error(
            `Failed to fetch menu items: ${error.message}`
        );
    }

    return (data ?? []) as SupabaseMenuItem[];
}