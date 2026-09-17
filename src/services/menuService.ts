import { supabase } from "../lib/supabase";

export async function getRestaurant() {
    const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .limit(1)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to fetch restaurant: ${error.message}`);
    }

    if (!data) {
        throw new Error("No active restaurant found.");
    }

    return data;
}

export async function getCategories(restaurantId: string) {
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data;
}

export async function getMenuItems(restaurantId: string) {
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
        label,
        price,
        sort_order,
        is_available
      )
    `)
        .eq("restaurant_id", restaurantId)
        .eq("is_available", true)
        .order("sort_order", { ascending: true });

    if (error) {
        throw new Error(`Failed to fetch menu items: ${error.message}`);
    }

    return data;
}