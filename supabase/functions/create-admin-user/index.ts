import { createClient } from "npm:@supabase/supabase-js@2";

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
    return new Response(
        JSON.stringify(body),
        {
            status,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
            },
        },
    );
}

interface CreateAdminUserRequest {
    email: string;
    password: string;
    restaurant_id: string;
    role: "admin" | "staff";
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
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

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
                    error: "Server configuration error",
                },
                500,
            );
        }

        /*
         * --------------------------------------------------
         * 1. Authenticate the requester
         * --------------------------------------------------
         *
         * This function uses the service-role key for the
         * actual user-management operation, so we MUST verify
         * the caller before creating/updating any admin user.
         */
        const authHeader =
            req.headers.get("Authorization");

        if (
            !authHeader?.startsWith("Bearer ")
        ) {
            return jsonResponse(
                {
                    error: "Missing or invalid authorization",
                },
                401,
            );
        }

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

        if (
            requesterError ||
            !requester
        ) {
            return jsonResponse(
                {
                    error: "Unauthorized",
                },
                401,
            );
        }

        /*
         * --------------------------------------------------
         * 2. Verify requester is an active Super Admin
         * --------------------------------------------------
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
                        "Only super admins can create users",
                },
                403,
            );
        }

        /*
         * --------------------------------------------------
         * 3. Parse and validate request
         * --------------------------------------------------
         */
        const body =
            (await req.json()) as Partial<CreateAdminUserRequest>;

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

        const role = body.role;

        if (!email) {
            return jsonResponse(
                {
                    error: "Email is required.",
                },
                400,
            );
        }

        if (!password) {
            return jsonResponse(
                {
                    error: "Password is required.",
                },
                400,
            );
        }

        if (password.length < 8) {
            return jsonResponse(
                {
                    error: "Password must be at least 8 characters.",
                },
                400,
            );
        }

        if (!restaurantId) {
            return jsonResponse(
                {
                    error: "Restaurant is required.",
                },
                400,
            );
        }

        if (
            role !== "admin" &&
            role !== "staff"
        ) {
            return jsonResponse(
                {
                    error: "Role must be admin or staff.",
                },
                400,
            );
        }

        /*
         * --------------------------------------------------
         * 4. Service-role client
         * --------------------------------------------------
         *
         * Keep the service-role key on the server and only
         * use it after the requester has been authorized.
         */
        const supabaseAdmin = createClient(
            supabaseUrl,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            },
        );

        /*
         * --------------------------------------------------
         * 5. Verify restaurant exists
         * --------------------------------------------------
         */
        const {
            data: restaurant,
            error: restaurantError,
        } = await supabaseAdmin
            .from("restaurants")
            .select("id")
            .eq("id", restaurantId)
            .maybeSingle();

        if (restaurantError) {
            console.error(
                "Restaurant lookup failed:",
                restaurantError,
            );

            return jsonResponse(
                {
                    error: "Unable to verify restaurant.",
                },
                500,
            );
        }

        if (!restaurant) {
            return jsonResponse(
                {
                    error: "Restaurant not found.",
                },
                404,
            );
        }

        /*
         * --------------------------------------------------
         * 6. Find existing Auth user
         * --------------------------------------------------
         */
        let existingUser = null;

        let page = 1;
        const perPage = 1000;

        while (!existingUser) {
            const {
                data,
                error,
            } = await supabaseAdmin.auth.admin.listUsers({
                page,
                perPage,
            });

            if (error) {
                throw new Error(
                    `Failed to search existing users: ${error.message}`,
                );
            }

            existingUser = data.users.find(
                (user) =>
                    user.email?.toLowerCase() === email,
            );

            if (data.users.length < perPage) {
                break;
            }

            page++;
        }

        /*
         * --------------------------------------------------
         * 7. Create Auth user if needed
         * --------------------------------------------------
         */
        let userId: string;

        if (existingUser) {
            userId = existingUser.id;
        } else {
            const {
                data,
                error,
            } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
            });

            if (error) {
                throw new Error(
                    `Failed to create Auth user: ${error.message}`,
                );
            }

            if (!data.user) {
                throw new Error(
                    "Auth user was not created.",
                );
            }

            userId = data.user.id;
        }

        /*
         * --------------------------------------------------
         * 8. Create/update admin_users record
         * --------------------------------------------------
         */
        const {
            data: adminUser,
            error: adminUserError,
        } = await supabaseAdmin
            .from("admin_users")
            .upsert(
                {
                    user_id: userId,
                    restaurant_id: restaurantId,
                    role,
                },
                {
                    onConflict: "user_id",
                },
            )
            .select()
            .single();

        if (adminUserError) {
            throw new Error(
                `Failed to save administrator record: ${adminUserError.message}`,
            );
        }

        return jsonResponse(
            {
                success: true,
                existingUser: Boolean(existingUser),
                user: {
                    id: userId,
                    email,
                },
                adminUser,
            },
            200,
        );
    } catch (error) {
        console.error(
            "create-admin-user error:",
            error,
        );

        return jsonResponse(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unexpected server error.",
            },
            500,
        );
    }
});
