import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import { supabase } from "../../lib/supabase";

export interface Restaurant {
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

interface RestaurantContextValue {
    restaurants: Restaurant[];
    selectedRestaurant: Restaurant | null;
    isLoading: boolean;
    error: string | null;
    selectRestaurant: (restaurantId: string) => void;
    refreshRestaurants: () => Promise<void>;
}

const RestaurantContext =
    createContext<RestaurantContextValue | undefined>(
        undefined
    );

const STORAGE_KEY =
    "restaurant-menu-selected-restaurant";

interface RestaurantProviderProps {
    children: ReactNode;
}

export function RestaurantProvider({
    children,
}: RestaurantProviderProps) {
    const [restaurants, setRestaurants] =
        useState<Restaurant[]>([]);

    const [selectedRestaurantId, setSelectedRestaurantId] =
        useState<string | null>(() => {
            return localStorage.getItem(STORAGE_KEY);
        });

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    async function refreshRestaurants() {
        try {
            setIsLoading(true);
            setError(null);

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                throw new Error(
                    userError.message
                );
            }

            if (!user) {
                throw new Error(
                    "You must be logged in."
                );
            }

            /*
             * First determine the current user's role.
             */
            const {
                data: adminUser,
                error: adminUserError,
            } = await supabase
                .from("admin_users")
                .select(
                    "role, restaurant_id, is_active"
                )
                .eq("user_id", user.id)
                .maybeSingle();

            if (adminUserError) {
                throw new Error(
                    adminUserError.message
                );
            }

            if (
                !adminUser ||
                !adminUser.is_active
            ) {
                throw new Error(
                    "Your administrator account is not active."
                );
            }

            /*
             * Super Admin:
             *
             * Can see every restaurant.
             */
            if (
                adminUser.role ===
                "super_admin"
            ) {
                const {
                    data,
                    error: restaurantsError,
                } = await supabase
                    .from("restaurants")
                    .select("*")
                    .order("created_at", {
                        ascending: false,
                    });

                if (restaurantsError) {
                    throw new Error(
                        restaurantsError.message
                    );
                }

                const loadedRestaurants =
                    (data ?? []) as Restaurant[];

                setRestaurants(
                    loadedRestaurants
                );

                /*
                 * Keep the saved restaurant if
                 * it still exists.
                 *
                 * Otherwise select the first
                 * available restaurant.
                 */
                const savedRestaurantExists =
                    loadedRestaurants.some(
                        (restaurant) =>
                            restaurant.id ===
                            selectedRestaurantId
                    );

                if (
                    !savedRestaurantExists
                ) {
                    const firstRestaurant =
                        loadedRestaurants[0];

                    if (
                        firstRestaurant
                    ) {
                        setSelectedRestaurantId(
                            firstRestaurant.id
                        );

                        localStorage.setItem(
                            STORAGE_KEY,
                            firstRestaurant.id
                        );
                    } else {
                        setSelectedRestaurantId(
                            null
                        );

                        localStorage.removeItem(
                            STORAGE_KEY
                        );
                    }
                }

                return;
            }

            /*
             * Normal Admin / Staff:
             *
             * They only get access to their
             * assigned restaurant.
             */
            if (!adminUser.restaurant_id) {
                throw new Error(
                    "No restaurant is assigned to this account."
                );
            }

            const {
                data: restaurant,
                error: restaurantError,
            } = await supabase
                .from("restaurants")
                .select("*")
                .eq(
                    "id",
                    adminUser.restaurant_id
                )
                .maybeSingle();

            if (restaurantError) {
                throw new Error(
                    restaurantError.message
                );
            }

            if (!restaurant) {
                throw new Error(
                    "Assigned restaurant could not be found."
                );
            }

            const assignedRestaurant =
                restaurant as Restaurant;

            setRestaurants([
                assignedRestaurant,
            ]);

            /*
             * Normal admins/staff cannot switch
             * to another restaurant.
             */
            setSelectedRestaurantId(
                assignedRestaurant.id
            );

            localStorage.setItem(
                STORAGE_KEY,
                assignedRestaurant.id
            );
        } catch (err) {
            console.error(
                "Failed to load restaurants:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load restaurants."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void refreshRestaurants();
    }, []);

    function selectRestaurant(
        restaurantId: string
    ) {
        const restaurant =
            restaurants.find(
                (item) =>
                    item.id ===
                    restaurantId
            );

        if (!restaurant) {
            console.warn(
                "Restaurant not found:",
                restaurantId
            );

            return;
        }

        setSelectedRestaurantId(
            restaurant.id
        );

        localStorage.setItem(
            STORAGE_KEY,
            restaurant.id
        );
    }

    const selectedRestaurant =
        useMemo(() => {
            if (
                !selectedRestaurantId
            ) {
                return null;
            }

            return (
                restaurants.find(
                    (restaurant) =>
                        restaurant.id ===
                        selectedRestaurantId
                ) ?? null
            );
        }, [
            restaurants,
            selectedRestaurantId,
        ]);

    const value =
        useMemo<RestaurantContextValue>(
            () => ({
                restaurants,
                selectedRestaurant,
                isLoading,
                error,
                selectRestaurant,
                refreshRestaurants,
            }),
            [
                restaurants,
                selectedRestaurant,
                isLoading,
                error,
            ]
        );

    return (
        <RestaurantContext.Provider
            value={value}
        >
            {children}
        </RestaurantContext.Provider>
    );
}

export function useRestaurant() {
    const context =
        useContext(
            RestaurantContext
        );

    if (!context) {
        throw new Error(
            "useRestaurant must be used inside RestaurantProvider."
        );
    }

    return context;
}