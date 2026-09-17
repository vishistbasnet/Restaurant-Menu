import { supabase } from "../../lib/supabase";

export interface RestaurantSettings {
    id: string;
    name: string;
    phone: string | null;
    whatsapp: string | null;
    order_type: "pickup";
    is_active: boolean;
    opening_time: string;
    closing_time: string;
    created_at: string;
    updated_at: string;
}

async function getAdminRestaurantId(): Promise<string> {
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

export async function getRestaurantSettings(): Promise<RestaurantSettings> {
    const restaurantId = await getAdminRestaurantId();

    const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .single();

    if (error) {
        throw new Error(
            `Failed to load restaurant settings: ${error.message}`
        );
    }

    return data as RestaurantSettings;
}

export interface UpdateRestaurantSettingsInput {
    name: string;
    phone: string;
    whatsapp: string;
    isActive: boolean;
    openingTime: string;
    closingTime: string;
}

export async function updateRestaurantSettings(
    input: UpdateRestaurantSettingsInput
): Promise<RestaurantSettings> {
    const restaurantId = await getAdminRestaurantId();

    const name = input.name.trim();

    if (!name) {
        throw new Error("Restaurant name is required.");
    }

    if (!input.openingTime) {
        throw new Error("Opening time is required.");
    }

    if (!input.closingTime) {
        throw new Error("Closing time is required.");
    }

    const { data, error } = await supabase
        .from("restaurants")
        .update({
            name,
            phone: input.phone.trim() || null,
            whatsapp: input.whatsapp.trim() || null,
            order_type: "pickup",
            is_active: input.isActive,
            opening_time: input.openingTime,
            closing_time: input.closingTime,
            updated_at: new Date().toISOString(),
        })
        .eq("id", restaurantId)
        .select("*")
        .single();

    if (error) {
        throw new Error(
            `Failed to update restaurant settings: ${error.message}`
        );
    }

    return data as RestaurantSettings;
}