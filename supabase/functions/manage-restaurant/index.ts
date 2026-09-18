import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods":
        "POST, OPTIONS",
};

function jsonResponse(
    body: unknown,
    status: number,
) {
    return new Response(
        JSON.stringify(body),
        {
            status,
            headers: {
                ...corsHeaders,
                "Content-Type":
                    "application/json",
            },
        },
    );
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    if (req.method !== "POST") {
        return jsonResponse(
            {
                error: "Method not allowed",
            },
            405,
        );
    }

    try {
        const supabaseUrl =
            Deno.env.get("SUPABASE_URL");

        const anonKey =
            Deno.env.get("SUPABASE_ANON_KEY");

        const serviceRoleKey =
            Deno.env.get(
                "SUPABASE_SERVICE_ROLE_KEY",
            );

        if (
            !supabaseUrl ||
            !anonKey ||
            !serviceRoleKey
        ) {
            console.error(
                "Missing Supabase environment variables",
            );

            return jsonResponse(
                {
                    error:
                        "Server configuration error",
                },
                500,
            );
        }

        const authHeader =
            req.headers.get(
                "Authorization",
            );

        if (
            !authHeader?.startsWith(
                "Bearer ",
            )
        ) {
            return jsonResponse(
                {
                    error:
                        "Missing or invalid authorization",
                },
                401,
            );
        }

        /*
         * Client using the requester's JWT.
         */
        const userClient =
            createClient(
                supabaseUrl,
                anonKey,
                {
                    global: {
                        headers: {
                            Authorization:
                                authHeader,
                        },
                    },
                },
            );

        /*
         * Verify authenticated requester.
         */
        const {
            data: {
                user: requester,
            },
            error: requesterError,
        } =
            await userClient.auth.getUser();

        if (
            requesterError ||
            !requester
        ) {
            return jsonResponse(
                {
                    error:
                        "Unauthorized",
                },
                401,
            );
        }

        /*
         * Only active Super Admins
         * can manage restaurants.
         */
        const {
            data: isSuperAdmin,
            error: roleError,
        } =
            await userClient.rpc(
                "is_super_admin",
            );

        if (roleError) {
            console.error(
                "Super admin verification failed:",
                roleError,
            );

            return jsonResponse(
                {
                    error:
                        "Unable to verify administrator permissions",
                },
                500,
            );
        }

        if (!isSuperAdmin) {
            return jsonResponse(
                {
                    error:
                        "Only super admins can manage restaurants",
                },
                403,
            );
        }

        const body =
            await req.json();

        const action =
            typeof body.action ===
                "string"
                ? body.action.trim()
                : "";

        if (!action) {
            return jsonResponse(
                {
                    error:
                        "action is required",
                },
                400,
            );
        }

        /*
         * Service-role client.
         */
        const adminClient =
            createClient(
                supabaseUrl,
                serviceRoleKey,
            );

        /*
         * CREATE
         */
        if (action === "create") {
            const name =
                typeof body.name ===
                    "string"
                    ? body.name.trim()
                    : "";

            const phone =
                typeof body.phone ===
                    "string"
                    ? body.phone.trim()
                    : "";

            const whatsapp =
                typeof body.whatsapp ===
                    "string"
                    ? body.whatsapp.trim()
                    : "";

            const openingTime =
                typeof body.opening_time ===
                    "string"
                    ? body.opening_time.trim()
                    : "11:00";

            const closingTime =
                typeof body.closing_time ===
                    "string"
                    ? body.closing_time.trim()
                    : "22:00";

            if (!name) {
                return jsonResponse(
                    {
                        error:
                            "Restaurant name is required",
                    },
                    400,
                );
            }

            const {
                data: restaurant,
                error: createError,
            } =
                await adminClient
                    .from("restaurants")
                    .insert({
                        name,
                        phone:
                            phone || null,
                        whatsapp:
                            whatsapp ||
                            null,
                        order_type:
                            "pickup",
                        is_active:
                            true,
                        opening_time:
                            openingTime,
                        closing_time:
                            closingTime,
                    })
                    .select("*")
                    .single();

            if (createError) {
                console.error(
                    "Restaurant creation failed:",
                    createError,
                );

                return jsonResponse(
                    {
                        error:
                            "Failed to create restaurant",
                    },
                    400,
                );
            }

            return jsonResponse(
                {
                    success: true,
                    action: "create",
                    restaurant,
                },
                201,
            );
        }

        /*
         * UPDATE
         */
        if (action === "update") {
            const restaurantId =
                typeof body.restaurant_id ===
                    "string"
                    ? body.restaurant_id.trim()
                    : "";

            const name =
                typeof body.name ===
                    "string"
                    ? body.name.trim()
                    : "";

            const phone =
                typeof body.phone ===
                    "string"
                    ? body.phone.trim()
                    : "";

            const whatsapp =
                typeof body.whatsapp ===
                    "string"
                    ? body.whatsapp.trim()
                    : "";

            const openingTime =
                typeof body.opening_time ===
                    "string"
                    ? body.opening_time.trim()
                    : "";

            const closingTime =
                typeof body.closing_time ===
                    "string"
                    ? body.closing_time.trim()
                    : "";

            if (
                !restaurantId ||
                !name ||
                !openingTime ||
                !closingTime
            ) {
                return jsonResponse(
                    {
                        error:
                            "restaurant_id, name, opening_time and closing_time are required",
                    },
                    400,
                );
            }

            const {
                data: restaurant,
                error: updateError,
            } =
                await adminClient
                    .from("restaurants")
                    .update({
                        name,
                        phone:
                            phone || null,
                        whatsapp:
                            whatsapp ||
                            null,
                        order_type:
                            "pickup",
                        opening_time:
                            openingTime,
                        closing_time:
                            closingTime,
                        updated_at:
                            new Date().toISOString(),
                    })
                    .eq(
                        "id",
                        restaurantId,
                    )
                    .select("*")
                    .single();

            if (updateError) {
                console.error(
                    "Restaurant update failed:",
                    updateError,
                );

                return jsonResponse(
                    {
                        error:
                            "Failed to update restaurant",
                    },
                    400,
                );
            }

            return jsonResponse(
                {
                    success: true,
                    action: "update",
                    restaurant,
                },
                200,
            );
        }

        /*
         * TOGGLE ACTIVE STATUS
         */
        if (action === "toggle") {
            const restaurantId =
                typeof body.restaurant_id ===
                    "string"
                    ? body.restaurant_id.trim()
                    : "";

            const isActive =
                typeof body.is_active ===
                    "boolean"
                    ? body.is_active
                    : null;

            if (
                !restaurantId ||
                isActive === null
            ) {
                return jsonResponse(
                    {
                        error:
                            "restaurant_id and is_active are required",
                    },
                    400,
                );
            }

            const {
                data: restaurant,
                error: updateError,
            } =
                await adminClient
                    .from("restaurants")
                    .update({
                        is_active:
                            isActive,
                        updated_at:
                            new Date().toISOString(),
                    })
                    .eq(
                        "id",
                        restaurantId,
                    )
                    .select("*")
                    .single();

            if (updateError) {
                console.error(
                    "Restaurant status update failed:",
                    updateError,
                );

                return jsonResponse(
                    {
                        error:
                            "Failed to update restaurant status",
                    },
                    400,
                );
            }

            return jsonResponse(
                {
                    success: true,
                    action: "toggle",
                    restaurant,
                },
                200,
            );
        }

        /*
         * DELETE
         *
         * We intentionally do not physically
         * delete restaurants yet.
         *
         * Existing admin_users/menu/category
         * records may depend on the restaurant.
         *
         * Use disable instead.
         */
        if (action === "delete") {
            return jsonResponse(
                {
                    error:
                        "Restaurants cannot be permanently deleted. Disable the restaurant instead.",
                },
                400,
            );
        }

        return jsonResponse(
            {
                error:
                    "Invalid action. Use create, update or toggle",
            },
            400,
        );
    } catch (error) {
        console.error(
            "manage-restaurant error:",
            error,
        );

        return jsonResponse(
            {
                error:
                    "Unexpected server error",
            },
            500,
        );
    }
});