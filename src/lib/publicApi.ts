/*
 * Lightweight read-only client for the public customer menu.
 *
 * The customer site only reads data, so it does not need the full
 * supabase-js library (login, realtime, storage). Calling the REST
 * API directly keeps ~80 KB of JavaScript away from every visitor.
 *
 * The admin area still uses ./supabase.ts.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function restGet<T>(
    table: string,
    params: Record<string, string>
): Promise<T> {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            "Missing Supabase environment variables."
        );
    }

    const query = new URLSearchParams(params).toString();

    const response = await fetch(
        `${supabaseUrl}/rest/v1/${table}?${query}`,
        {
            headers: {
                apikey: supabaseKey,
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Request to "${table}" failed (${response.status}).`
        );
    }

    return (await response.json()) as T;
}
