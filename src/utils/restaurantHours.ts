import type { Restaurant } from "../types/restaurant";

export type RestaurantStatus =
    | {
        isOpen: true;
        label: "OPEN NOW";
        message: string;
    }
    | {
        isOpen: false;
        label: "CLOSED TODAY" | "CLOSED" | "STATUS UNAVAILABLE";
        message: string;
    };

/**
 * Convert a database TIME value such as:
 * "09:00:00"
 * "22:00:00"
 *
 * into a user-friendly local time.
 */
export function formatTime(time: string): string {
    const [hours, minutes] = time
        .split(":")
        .map(Number);

    const date = new Date();

    date.setHours(
        hours,
        minutes,
        0,
        0
    );

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

/**
 * Convert HH:MM or HH:MM:SS into minutes from midnight.
 */
function timeToMinutes(time: string): number {
    const [hours, minutes] = time
        .split(":")
        .map(Number);

    return (
        hours * 60 +
        minutes
    );
}

/**
 * Calculate the current restaurant status.
 *
 * Priority:
 *
 * 1. Manual admin closure
 * 2. Opening hours
 * 3. Current browser local time
 *
 * The browser's local timezone is used intentionally.
 */
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
            message: `Opens at ${formatTime(
                restaurant.opening_time
            )}`,
        };
    }

    const now = new Date();

    /*
     * Browser local time.
     *
     * Example:
     * India → Asia/Calcutta / Asia/Kolkata
     */
    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

    const openingMinutes =
        timeToMinutes(
            restaurant.opening_time
        );

    const closingMinutes =
        timeToMinutes(
            restaurant.closing_time
        );

    /*
     * Normal schedule.
     *
     * Example:
     * 09:00 → 22:00
     */
    if (openingMinutes < closingMinutes) {
        const isOpen =
            currentMinutes >=
            openingMinutes &&
            currentMinutes <
            closingMinutes;

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

    /*
     * Overnight schedule.
     *
     * Example:
     * 18:00 → 02:00
     *
     * Open when:
     *
     * current >= 18:00
     *
     * OR
     *
     * current < 02:00
     */
    if (openingMinutes > closingMinutes) {
        const isOpen =
            currentMinutes >=
            openingMinutes ||
            currentMinutes <
            closingMinutes;

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

    /*
     * opening === closing
     *
     * Example:
     * 00:00 → 00:00
     *
     * Treat this as open 24 hours.
     */
    return {
        isOpen: true,
        label: "OPEN NOW",
        message: "Open 24 hours",
    };
}