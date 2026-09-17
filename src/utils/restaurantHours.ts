import type { Restaurant } from "../types/restaurant";

export type RestaurantStatus =
    | {
        isOpen: true;
        label: "OPEN NOW";
        message: string;
    }
    | {
        isOpen: false;
        label: "CLOSED TODAY" | "CLOSED";
        message: string;
    };

function formatTime(time: string): string {
    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
}

export function getRestaurantStatus(
    restaurant: Restaurant
): RestaurantStatus {
    /*
     * Manual admin closure always takes priority.
     */
    if (!restaurant.is_active) {
        return {
            isOpen: false,
            label: "CLOSED TODAY",
            message: `Opens at ${formatTime(restaurant.opening_time)}`,
        };
    }

    const now = new Date();

    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    const openingMinutes = timeToMinutes(
        restaurant.opening_time
    );

    const closingMinutes = timeToMinutes(
        restaurant.closing_time
    );

    /*
     * Normal schedule:
     * opening < closing
     *
     * Example:
     * 11:00 → 22:00
     */
    if (openingMinutes < closingMinutes) {
        if (
            currentMinutes >= openingMinutes &&
            currentMinutes < closingMinutes
        ) {
            return {
                isOpen: true,
                label: "OPEN NOW",
                message: `Open until ${formatTime(
                    restaurant.closing_time
                )}`,
            };
        }

        return {
            isOpen: false,
            label: "CLOSED",
            message: `Opens at ${formatTime(
                restaurant.opening_time
            )}`,
        };
    }

    /*
     * Overnight schedule:
     * opening >= closing
     *
     * Example:
     * 18:00 → 02:00
     */
    const isOpen =
        currentMinutes >= openingMinutes ||
        currentMinutes < closingMinutes;

    if (isOpen) {
        return {
            isOpen: true,
            label: "OPEN NOW",
            message: `Open until ${formatTime(
                restaurant.closing_time
            )}`,
        };
    }

    return {
        isOpen: false,
        label: "CLOSED",
        message: `Opens at ${formatTime(
            restaurant.opening_time
        )}`,
    };
}