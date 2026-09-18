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
                error:
                    "Method not allowed",
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
         * Verify requester.
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
         * Verify requester is
         * an active Super Admin.
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
                        "Only super admins can manage users",
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

        const userId =
            typeof body.user_id ===
                "string"
                ? body.user_id.trim()
                : "";

        if (!action || !userId) {
            return jsonResponse(
                {
                    error:
                        "action and user_id are required",
                },
                400,
            );
        }

        /*
         * Never allow a Super Admin
         * to modify their own account
         * through this function.
         */
        if (
            userId ===
            requester.id
        ) {
            return jsonResponse(
                {
                    error:
                        "You cannot modify your own account",
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
         * Get target administrator.
         */
        const {
            data: targetUser,
            error: targetError,
        } =
            await adminClient
                .from("admin_users")
                .select(
                    "user_id, restaurant_id, role, is_active",
                )
                .eq(
                    "user_id",
                    userId,
                )
                .maybeSingle();

        if (targetError) {
            console.error(
                "Target user lookup failed:",
                targetError,
            );

            return jsonResponse(
                {
                    error:
                        "Unable to find user",
                },
                500,
            );
        }

        if (!targetUser) {
            return jsonResponse(
                {
                    error:
                        "User not found",
                },
                404,
            );
        }

        /*
         * Never modify another
         * Super Admin account.
         *
         * Super Admin accounts should
         * be managed separately.
         */
        if (
            targetUser.role ===
            "super_admin"
        ) {
            return jsonResponse(
                {
                    error:
                        "Super Admin accounts cannot be modified here",
                },
                403,
            );
        }

        /*
         * UPDATE
         *
         * Change restaurant and/or role.
         */
        if (action === "update") {
            const restaurantId =
                typeof body.restaurant_id ===
                    "string"
                    ? body.restaurant_id.trim()
                    : "";

            const role =
                typeof body.role ===
                    "string"
                    ? body.role.trim()
                    : "";

            if (
                !restaurantId ||
                !role
            ) {
                return jsonResponse(
                    {
                        error:
                            "restaurant_id and role are required",
                    },
                    400,
                );
            }

            if (
                !["admin", "staff"].includes(
                    role,
                )
            ) {
                return jsonResponse(
                    {
                        error:
                            "Role must be admin or staff",
                    },
                    400,
                );
            }

            /*
             * Verify restaurant exists.
             */
            const {
                data: restaurant,
                error:
                restaurantError,
            } =
                await adminClient
                    .from(
                        "restaurants",
                    )
                    .select("id")
                    .eq(
                        "id",
                        restaurantId,
                    )
                    .maybeSingle();

            if (
                restaurantError
            ) {
                console.error(
                    "Restaurant lookup failed:",
                    restaurantError,
                );

                return jsonResponse(
                    {
                        error:
                            "Unable to verify restaurant",
                    },
                    500,
                );
            }

            if (!restaurant) {
                return jsonResponse(
                    {
                        error:
                            "Restaurant not found",
                    },
                    400,
                );
            }

            const {
                data: updatedUser,
                error: updateError,
            } =
                await adminClient
                    .from(
                        "admin_users",
                    )
                    .update({
                        restaurant_id:
                            restaurantId,
                        role,
                    })
                    .eq(
                        "user_id",
                        userId,
                    )
                    .select(
                        "user_id, restaurant_id, role, is_active, created_at",
                    )
                    .single();

            if (updateError) {
                console.error(
                    "User update failed:",
                    updateError,
                );

                return jsonResponse(
                    {
                        error:
                            "Failed to update user",
                    },
                    400,
                );
            }

            return jsonResponse(
                {
                    success: true,
                    action: "update",
                    user: updatedUser,
                },
                200,
            );
        }

        /*
         * TOGGLE
         *
         * Activate/deactivate user.
         */
        if (action === "toggle") {
            const isActive =
                typeof body.is_active ===
                    "boolean"
                    ? body.is_active
                    : null;

            if (
                isActive === null
            ) {
                return jsonResponse(
                    {
                        error:
                            "is_active must be true or false",
                    },
                    400,
                );
            }

            const {
                data: updatedUser,
                error: updateError,
            } =
                await adminClient
                    .from(
                        "admin_users",
                    )
                    .update({
                        is_active:
                            isActive,
                    })
                    .eq(
                        "user_id",
                        userId,
                    )
                    .select(
                        "user_id, restaurant_id, role, is_active, created_at",
                    )
                    .single();

            if (updateError) {
                console.error(
                    "Status update failed:",
                    updateError,
                );

                return jsonResponse(
                    {
                        error:
                            "Failed to update user status",
                    },
                    400,
                );
            }

            return jsonResponse(
                {
                    success: true,
                    action: "toggle",
                    user: updatedUser,
                },
                200,
            );
        }

        /*
         * DELETE
         *
         * Delete authorization record
         * and Supabase Auth account.
         */
        if (action === "delete") {
            const {
                error:
                deleteRecordError,
            } =
                await adminClient
                    .from(
                        "admin_users",
                    )
                    .delete()
                    .eq(
                        "user_id",
                        userId,
                    );

            if (
                deleteRecordError
            ) {
                console.error(
                    "admin_users delete failed:",
                    deleteRecordError,
                );

                return jsonResponse(
                    {
                        error:
                            "Failed to remove administrator record",
                    },
                    400,
                );
            }

            const {
                error:
                deleteAuthError,
            } =
                await adminClient.auth.admin.deleteUser(
                    userId,
                );

            if (
                deleteAuthError
            ) {
                console.error(
                    "Auth user deletion failed:",
                    deleteAuthError,
                );

                /*
                 * At this point the database
                 * record has already been removed.
                 *
                 * Return the error rather than
                 * pretending the operation succeeded.
                 */
                return jsonResponse(
                    {
                        error:
                            "Administrator record removed, but Auth account could not be deleted",
                    },
                    500,
                );
            }

            return jsonResponse(
                {
                    success: true,
                    action: "delete",
                    user_id: userId,
                },
                200,
            );
        }

        return jsonResponse(
            {
                error:
                    "Invalid action. Use update, toggle or delete",
            },
            400,
        );
    } catch (error) {
        console.error(
            "manage-admin-user error:",
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