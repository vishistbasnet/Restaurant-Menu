import { supabase } from "../../lib/supabase";

export interface AdminCategory {
    id: string;
    restaurant_id: string;
    name: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
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

export async function getCategories(): Promise<
    AdminCategory[]
> {
    const restaurantId = await getAdminRestaurantId();

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order", {
            ascending: true,
        });

    if (error) {
        throw new Error(
            `Failed to load categories: ${error.message}`
        );
    }

    return data ?? [];
}

export async function createCategory(
    name: string,
    sortOrder: number
): Promise<AdminCategory> {
    const restaurantId = await getAdminRestaurantId();

    const { data, error } = await supabase
        .from("categories")
        .insert({
            restaurant_id: restaurantId,
            name: name.trim(),
            sort_order: sortOrder,
            is_active: true,
        })
        .select()
        .single();

    if (error) {
        throw new Error(
            `Failed to create category: ${error.message}`
        );
    }

    return data;
}

export async function updateCategory(
    id: string,
    name: string,
    sortOrder: number
): Promise<AdminCategory> {
    const { data, error } = await supabase
        .from("categories")
        .update({
            name: name.trim(),
            sort_order: sortOrder,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(
            `Failed to update category: ${error.message}`
        );
    }

    return data;
}

export async function toggleCategory(
    id: string,
    isActive: boolean
): Promise<void> {
    const { error } = await supabase
        .from("categories")
        .update({
            is_active: isActive,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        throw new Error(
            `Failed to update category status: ${error.message}`
        );
    }
}

export async function deleteCategory(
    id: string
): Promise<void> {
    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(
            `Failed to delete category: ${error.message}`
        );
    }
}