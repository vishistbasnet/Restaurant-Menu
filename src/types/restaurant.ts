export interface Restaurant {
    id: string;
    name: string;

    phone: string | null;
    whatsapp: string | null;

    order_type: string;

    is_active: boolean;

    opening_time: string;
    closing_time: string;
}