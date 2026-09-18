import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(
    body: unknown,
    status: number,
) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
        },
    });
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: corsHeaders,
        });
    }

    if (req.method !== "POST") {
        return jsonResponse(
            { error: "Method not allowed" },
            405,
        );
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
        const serviceRoleKey = Deno.env.get(
            "SUPABASE_SERVICE_ROLE_KEY",
        );

        if (!supabaseUrl || !anonKey || !serviceRoleKey) {
            console.error(
                "Missing required Supabase environment variables",
            );

            return jsonResponse(
                { error: "Server configuration error" },
                500,
            );
        }

        const authHeader = req.headers.get("Authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return jsonResponse(
                { error: "Missing or invalid authorization" },
                401,
            );
        }

        /*
         * Client representing the currently authenticated requester.
         *
         * The JWT is passed through so auth.uid() inside
         * is_super_admin() refers to the requester.
         */
        const userClient = createClient(
            supabaseUrl,
            anonKey,
            {
                global: {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            },
        );

        const {
            data: { user: requester },
            error: requesterError,
        } = await userClient.auth.getUser();

        if (requesterError || !requester) {
            return jsonResponse(
                { error: "Unauthorized" },
                401,
            );
        }

        /*
         * Your database function is:
         *
         * is_super_admin()
         *
         * It uses auth.uid() internally and checks:
         * role = 'super_admin'
         * is_active = true
         */
        const {
            data: isSuperAdmin,
            error: roleError,
        } = await userClient.rpc("is_super_admin");

        if (roleError) {
            console.error(
                "Super admin verification failed:",
                roleError,
            );

            return jsonResponse(
                { error: "Unable to verify administrator permissions" },
                500,
            );
        }

        if (!isSuperAdmin) {
            return jsonResponse(
                {
                    error:
                        "Only super admins can create users",
                },
                403,
            );
        }

        const body = await req.json();

        const email =
            typeof body.email === "string"
                ? body.email.trim().toLowerCase()
                : "";

        const password =
            typeof body.password === "string"
                ? body.password
                : "";

        const restaurantId =
            typeof body.restaurant_id === "string"
                ? body.restaurant_id.trim()
                : "";

        const role =
            typeof body.role === "string"
                ? body.role.trim()
                : "";

        if (
            !email ||
            !password ||
            !restaurantId ||
            !role
        ) {
            return jsonResponse(
                {
                    error:
                        "email, password, restaurant_id and role are required",
                },
                400,
            );
        }

        if (
            !["super_admin", "admin", "staff"].includes(
                role,
            )
        ) {
            return jsonResponse(
                {
                    error: "Invalid role",
                },
                400,
            );
        }

        if (password.length < 8) {
            return jsonResponse(
                {
                    error:
                        "Password must be at least 8 characters",
                },
                400,
            );
        }

        /*
         * Service-role client.
         *
         * NEVER expose this key to the React application.
         */
        const adminClient = createClient(
            supabaseUrl,
            serviceRoleKey,
        );

        /*
         * Verify that the restaurant exists before creating
         * the Auth account.
         */
        const {
            data: restaurant,
            error: restaurantError,
        } = await adminClient
            .from("restaurants")
            .select("id")
            .eq("id", restaurantId)
            .maybeSingle();

        if (restaurantError) {
            console.error(
                "Restaurant verification failed:",
                restaurantError,
            );

            return jsonResponse(
                { error: "Unable to verify restaurant" },
                500,
            );
        }

        if (!restaurant) {
            return jsonResponse(
                { error: "Restaurant not found" },
                400,
            );
        }

        /*
         * Create the Supabase Auth account.
         */
        const {
            data: createdUser,
            error: createUserError,
        } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });

        if (createUserError || !createdUser.user) {
            console.error(
                "Auth user creation failed:",
                createUserError,
            );

            return jsonResponse(
                {
                    error:
                        createUserError?.message ??
                        "Failed to create user",
                },
                400,
            );
        }

        /*
         * Add authorization record.
         */
        const { error: insertError } =
            await adminClient
                .from("admin_users")
                .insert({
                    user_id: createdUser.user.id,
                    restaurant_id: restaurantId,
                    role,
                    is_active: true,
                });

        /*
         * Roll back the Auth account if the
         * admin_users insert fails.
         */
        if (insertError) {
            console.error(
                "admin_users insert failed:",
                insertError,
            );

            await adminClient.auth.admin.deleteUser(
                createdUser.user.id,
            );

            return jsonResponse(
                {
                    error:
                        "Failed to create administrator record",
                },
                400,
            );
        }

        return jsonResponse(
            {
                success: true,
                user: {
                    id: createdUser.user.id,
                    email: createdUser.user.email,
                    restaurant_id: restaurantId,
                    role,
                    is_active: true,
                },
            },
            201,
        );
    } catch (error) {
        console.error(
            "create-admin-user error:",
            error,
        );

        return jsonResponse(
            {
                error: "Unexpected server error",
            },
            500,
        );
    }
});