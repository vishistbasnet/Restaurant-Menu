import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

interface CreateAdminUserRequest {
    email: string;
    password: string;
    restaurant_id: string;
    role: "SUPER" | "ADMIN" | "STAFF";
}

Deno.serve(async (req) => {
    try {
        if (req.method !== "POST") {
            return new Response(
                JSON.stringify({
                    error: "Method not allowed",
                }),
                {
                    status: 405,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const body =
            (await req.json()) as CreateAdminUserRequest;

        const email = body.email?.trim().toLowerCase();
        const password = body.password;
        const restaurantId = body.restaurant_id;
        const role = body.role;

        if (!email) {
            return new Response(
                JSON.stringify({
                    error: "Email is required.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!password) {
            return new Response(
                JSON.stringify({
                    error: "Password is required.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!restaurantId) {
            return new Response(
                JSON.stringify({
                    error: "Restaurant is required.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        if (!["SUPER", "ADMIN", "STAFF"].includes(role)) {
            return new Response(
                JSON.stringify({
                    error: "Invalid role.",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        /*
         * --------------------------------------------------
         * 1. Find existing Auth user
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
                    `Failed to search existing users: ${error.message}`
                );
            }

            existingUser = data.users.find(
                (user) =>
                    user.email?.toLowerCase() === email
            );

            if (
                data.users.length < perPage
            ) {
                break;
            }

            page++;
        }

        /*
         * --------------------------------------------------
         * 2. Create user if it doesn't exist
         * --------------------------------------------------
         */

        let userId: string;

        if (existingUser) {
            userId = existingUser.id;
        } else {
            const {
                data,
                error,
            } =
                await supabaseAdmin.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true,
                });

            if (error) {
                throw new Error(
                    `Failed to create Auth user: ${error.message}`
                );
            }

            if (!data.user) {
                throw new Error(
                    "Auth user was not created."
                );
            }

            userId = data.user.id;
        }

        /*
         * --------------------------------------------------
         * 3. Create/update admin_users record
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
                }
            )
            .select()
            .single();

        if (adminUserError) {
            throw new Error(
                `Failed to save administrator record: ${adminUserError.message}`
            );
        }

        /*
         * --------------------------------------------------
         * 4. Success
         * --------------------------------------------------
         */

        return new Response(
            JSON.stringify({
                success: true,
                existingUser: Boolean(existingUser),
                user: {
                    id: userId,
                    email,
                },
                adminUser,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error(
            "create-admin-user error:",
            error
        );

        return new Response(
            JSON.stringify({
                error:
                    error instanceof Error
                        ? error.message
                        : "Unexpected server error.",
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
});