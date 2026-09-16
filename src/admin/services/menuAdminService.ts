import { supabase } from "../../lib/supabase";

export interface AdminMenuOption {
    id: string;
    menu_item_id: string;
    label: string;
    price: number | null;
    sort_order: number;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminMenuItem {
    id: string;
    restaurant_id: string;
    category_id: string;
    name: string;
    description: string | null;
    is_veg: boolean;
    price: number | null;
    is_available: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    menu_item_options: AdminMenuOption[];
}

export interface CreateMenuItemInput {
    categoryId: string;
    name: string;
    description: string;
    isVeg: boolean;
    price: number | null;
    isAvailable: boolean;
    sortOrder: number;
    options: {
        label: string;
        price: number | null;
        sortOrder: number;
        isAvailable: boolean;
    }[];
}

export async function getAdminRestaurantId(): Promise<string> {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        throw new Error("You must be logged in.");
    }

    const { data, error } = await supabase
        .from("admin_users")
        .select("restaurant_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        throw new Error(
            `Failed to verify admin restaurant: ${error.message}`
        );
    }

    if (!data) {
        throw new Error(
            "No restaurant is assigned to this admin account."
        );
    }

    return data.restaurant_id;
}

export async function getAdminMenuItems(): Promise<AdminMenuItem[]> {
    const restaurantId = await getAdminRestaurantId();

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
      created_at,
      updated_at,
      menu_item_options (
        id,
        menu_item_id,
        label,
        price,
        sort_order,
        is_available,
        created_at,
        updated_at
      )
    `)
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true });

    if (error) {
        throw new Error(
            `Failed to load menu items: ${error.message}`
        );
    }

    return (data ?? []) as AdminMenuItem[];
}

export async function createMenuItem(
    input: CreateMenuItemInput
): Promise<AdminMenuItem> {
    const restaurantId = await getAdminRestaurantId();

    const { data: item, error: itemError } = await supabase
        .from("menu_items")
        .insert({
            restaurant_id: restaurantId,
            category_id: input.categoryId,
            name: input.name.trim(),
            description: input.description.trim() || null,
            is_veg: input.isVeg,
            price: input.price,
            is_available: input.isAvailable,
            sort_order: input.sortOrder,
        })
        .select()
        .single();

    if (itemError || !item) {
        throw new Error(
            `Failed to create menu item: ${itemError?.message ?? "Unknown error."
            }`
        );
    }

    if (input.options.length > 0) {
        const { error: optionsError } = await supabase
            .from("menu_item_options")
            .insert(
                input.options.map((option) => ({
                    menu_item_id: item.id,
                    label: option.label.trim(),
                    price: option.price,
                    sort_order: option.sortOrder,
                    is_available: option.isAvailable,
                }))
            );

        if (optionsError) {
            await supabase
                .from("menu_items")
                .delete()
                .eq("id", item.id);

            throw new Error(
                `Failed to create menu options: ${optionsError.message}`
            );
        }
    }

    const createdItems = await getAdminMenuItems();

    const createdItem = createdItems.find(
        (menuItem) => menuItem.id === item.id
    );

    if (!createdItem) {
        throw new Error(
            "Menu item was created but could not be loaded."
        );
    }

    return createdItem;
}

export async function updateMenuItem(
    id: string,
    input: CreateMenuItemInput
): Promise<AdminMenuItem> {
    const { error: itemError } = await supabase
        .from("menu_items")
        .update({
            category_id: input.categoryId,
            name: input.name.trim(),
            description: input.description.trim() || null,
            is_veg: input.isVeg,
            price: input.price,
            is_available: input.isAvailable,
            sort_order: input.sortOrder,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (itemError) {
        throw new Error(
            `Failed to update menu item: ${itemError.message}`
        );
    }

    const { error: deleteOptionsError } = await supabase
        .from("menu_item_options")
        .delete()
        .eq("menu_item_id", id);

    if (deleteOptionsError) {
        throw new Error(
            `Failed to update menu options: ${deleteOptionsError.message}`
        );
    }

    if (input.options.length > 0) {
        const { error: optionsError } = await supabase
            .from("menu_item_options")
            .insert(
                input.options.map((option) => ({
                    menu_item_id: id,
                    label: option.label.trim(),
                    price: option.price,
                    sort_order: option.sortOrder,
                    is_available: option.isAvailable,
                }))
            );

        if (optionsError) {
            throw new Error(
                `Failed to save menu options: ${optionsError.message}`
            );
        }
    }

    const updatedItems = await getAdminMenuItems();

    const updatedItem = updatedItems.find(
        (menuItem) => menuItem.id === id
    );

    if (!updatedItem) {
        throw new Error(
            "Menu item was updated but could not be loaded."
        );
    }

    return updatedItem;
}

export async function toggleMenuItem(
    id: string,
    isAvailable: boolean
): Promise<void> {
    const { error } = await supabase
        .from("menu_items")
        .update({
            is_available: isAvailable,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        throw new Error(
            `Failed to update menu item availability: ${error.message}`
        );
    }
}

export async function deleteMenuItem(
    id: string
): Promise<void> {
    const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(
            `Failed to delete menu item: ${error.message}`
        );
    }
}