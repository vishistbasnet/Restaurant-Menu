import type { MenuItem } from "../types/menu";

export const menuItems: MenuItem[] = [
    // =========================
    // RICE COMBOS
    // =========================

    {
        id: "veg-manchurian-rice",
        name: "Veg Manchurian with Rice",
        category: "Rice Combos",
        isVeg: true,
        pricing: {
            type: "single",
            price: 90,
        },
    },

    {
        id: "paneer-manchurian-rice",
        name: "Paneer Manchurian with Rice",
        category: "Rice Combos",
        isVeg: true,
        pricing: {
            type: "single",
            price: 140,
        },
    },

    {
        id: "paneer-chilli-rice",
        name: "Paneer Chilli with Rice",
        category: "Rice Combos",
        isVeg: true,
        pricing: {
            type: "single",
            price: 140,
        },
    },

    // =========================
    // SOUP
    // =========================

    {
        id: "sweet-corn-soup",
        name: "Sweet Corn Soup",
        category: "Soup",
        isVeg: true,
        pricing: {
            type: "single",
            price: 50,
        },
    },

    {
        id: "hot-sour-soup",
        name: "Hot & Sour Soup",
        category: "Soup",
        isVeg: true,
        pricing: {
            type: "single",
            price: 40,
        },
    },

    {
        id: "veg-peking-soup",
        name: "Veg Peking Soup",
        category: "Soup",
        isVeg: true,
        pricing: {
            type: "single",
            price: 40,
        },
    },

    {
        id: "veg-manchow-soup",
        name: "Veg Manchow Soup",
        category: "Soup",
        isVeg: true,
        pricing: {
            type: "single",
            price: 40,
        },
    },

    // =========================
    // MAGGI
    // =========================

    {
        id: "veg-maggi",
        name: "Veg Maggi",
        category: "Maggi",
        isVeg: true,
        pricing: {
            type: "single",
            price: 40,
        },
    },

    {
        id: "cheese-maggi",
        name: "Cheese Maggi",
        category: "Maggi",
        isVeg: true,
        pricing: {
            type: "single",
            price: 60,
        },
    },

    {
        id: "paneer-maggi",
        name: "Paneer Maggi",
        category: "Maggi",
        isVeg: true,
        pricing: {
            type: "single",
            price: 70,
        },
    },

    // =========================
    // PAKODA
    // =========================

    {
        id: "bread-pakoda",
        name: "Bread Pakoda",
        category: "Pakoda",
        isVeg: true,
        pricing: {
            type: "single",
            price: null,
        },
    },

    {
        id: "paneer-pakoda",
        name: "Paneer Pakoda",
        category: "Pakoda",
        isVeg: true,
        pricing: {
            type: "single",
            price: null,
        },
    },

    // =========================
    // MANCHURIAN
    // =========================

    {
        id: "veg-manchurian",
        name: "Veg Manchurian",
        category: "Manchurian",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 70 },
                { label: "Full", price: 120 },
            ],
        },
    },

    {
        id: "paneer-manchurian",
        name: "Paneer Manchurian",
        category: "Manchurian",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 80 },
                { label: "Full", price: 150 },
            ],
        },
    },

    // =========================
    // SOYA CHAAP
    // =========================

    {
        id: "malai-chaap",
        name: "Malai Chaap",
        category: "Soya Chaap",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 80 },
                { label: "Full", price: 150 },
            ],
        },
    },

    {
        id: "afghani-chaap",
        name: "Afghani Chaap",
        category: "Soya Chaap",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 80 },
                { label: "Full", price: 150 },
            ],
        },
    },

    {
        id: "achari-chaap",
        name: "Achari Chaap",
        category: "Soya Chaap",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 80 },
                { label: "Full", price: 150 },
            ],
        },
    },

    {
        id: "tandoori-chaap",
        name: "Tandoori Chaap",
        category: "Soya Chaap",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 70 },
                { label: "Full", price: 130 },
            ],
        },
    },

    {
        id: "masala-chaap",
        name: "Masala Chaap",
        category: "Soya Chaap",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 70 },
                { label: "Full", price: 130 },
            ],
        },
    },

    // =========================
    // CHILLI SPECIALS
    // =========================

    {
        id: "chilli-paneer",
        name: "Chilli Paneer",
        category: "Chilli Specials",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 80 },
                { label: "Full", price: 150 },
            ],
        },
    },

    // =========================
    // SPRING ROLL & SNACKS
    // =========================

    {
        id: "veg-spring-roll",
        name: "Veg Spring Roll",
        category: "Spring Roll & Snacks",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 30 },
                { label: "Full", price: 60 },
            ],
        },
    },

    {
        id: "crispy-spring-roll",
        name: "Crispy Spring Roll",
        category: "Spring Roll & Snacks",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 40 },
                { label: "Full", price: 70 },
            ],
        },
    },

    {
        id: "paneer-pakoda-10pcs",
        name: "Paneer Pakoda",
        category: "Spring Roll & Snacks",
        description: "10 Pcs",
        isVeg: true,
        pricing: {
            type: "single",
            price: 100,
        },
    },

    // =========================
    // MOMOS
    // =========================

    {
        id: "veg-momos",
        name: "Veg Momos",
        category: "Momos",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 30 },
                { label: "Full", price: 50 },
            ],
        },
    },

    {
        id: "paneer-momos",
        name: "Paneer Momos",
        category: "Momos",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 40 },
                { label: "Full", price: 80 },
            ],
        },
    },

    {
        id: "kurkure-momos",
        name: "Kurkure Momos",
        category: "Momos",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 50 },
                { label: "Full", price: 100 },
            ],
        },
    },

    {
        id: "fried-momos",
        name: "Fried Momos",
        category: "Momos",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 40 },
                { label: "Full", price: 70 },
            ],
        },
    },

    {
        id: "paneer-kurkure-momos",
        name: "Paneer Kurkure Momos",
        category: "Momos",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 60 },
                { label: "Full", price: 100 },
            ],
        },
    },

    {
        id: "gravy-momos",
        name: "Gravy Momos",
        category: "Momos",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 50 },
                { label: "Full", price: 100 },
            ],
        },
    },

    {
        id: "cheese-lapeta-momos",
        name: "Cheese Lapeta Momos",
        category: "Momos",
        description: "10 Pcs",
        isVeg: true,
        pricing: {
            type: "single",
            price: 89,
        },
    },

    // =========================
    // NOODLES
    // =========================

    {
        id: "veg-chowmein",
        name: "Veg Chowmein",
        category: "Noodles",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 30 },
                { label: "Full", price: 50 },
            ],
        },
    },

    {
        id: "paneer-chowmein",
        name: "Paneer Chowmein",
        category: "Noodles",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 60 },
                { label: "Full", price: 120 },
            ],
        },
    },

    {
        id: "chilli-garlic-noodles",
        name: "Chilli Garlic Noodles",
        category: "Noodles",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 60 },
                { label: "Full", price: 100 },
            ],
        },
    },

    {
        id: "hakka-noodles",
        name: "Hakka Noodles",
        category: "Noodles",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 60 },
                { label: "Full", price: 100 },
            ],
        },
    },

    {
        id: "singapuri-noodles",
        name: "Singapuri Noodles",
        category: "Noodles",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 60 },
                { label: "Full", price: 100 },
            ],
        },
    },

    // =========================
    // BURGERS
    // =========================

    {
        id: "veg-burger",
        name: "Veg Burger",
        category: "Burgers",
        isVeg: true,
        pricing: {
            type: "single",
            price: 30,
        },
    },

    {
        id: "smash-burger",
        name: "Smash Burger",
        category: "Burgers",
        isVeg: true,
        pricing: {
            type: "single",
            price: 35,
        },
    },

    {
        id: "noodles-burger",
        name: "Noodles Burger",
        category: "Burgers",
        isVeg: true,
        pricing: {
            type: "single",
            price: 40,
        },
    },

    {
        id: "paneer-burger",
        name: "Paneer Burger",
        category: "Burgers",
        isVeg: true,
        pricing: {
            type: "single",
            price: 50,
        },
    },

    {
        id: "cheese-burger",
        name: "Cheese Burger",
        category: "Burgers",
        isVeg: true,
        pricing: {
            type: "single",
            price: 60,
        },
    },

    // =========================
    // POTATO SPECIALS
    // =========================

    {
        id: "french-fries",
        name: "French Fries",
        category: "Potato Specials",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 40 },
                { label: "Full", price: 70 },
            ],
        },
    },

    {
        id: "chilli-potato",
        name: "Chilli Potato",
        category: "Potato Specials",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 50 },
                { label: "Full", price: 90 },
            ],
        },
    },

    {
        id: "honey-chilli-potato",
        name: "Honey Chilli Potato",
        category: "Potato Specials",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 60 },
                { label: "Full", price: 100 },
            ],
        },
    },

    // =========================
    // PIZZA
    // =========================

    {
        id: "small-pizza",
        name: "Small Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 69,
        },
    },

    {
        id: "tomato-pizza",
        name: "Tomato Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 99,
        },
    },

    {
        id: "onion-pizza",
        name: "Onion Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 99,
        },
    },

    {
        id: "capsicum-pizza",
        name: "Capsicum Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 99,
        },
    },

    {
        id: "tomato-onion-capsicum-pizza",
        name: "Tomato Onion Capsicum Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 99,
        },
    },

    {
        id: "margherita-pizza",
        name: "Margherita Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 99,
        },
    },

    {
        id: "corn-pizza",
        name: "Corn Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 110,
        },
    },

    {
        id: "paneer-pizza",
        name: "Paneer Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 120,
        },
    },

    {
        id: "paneer-65-pizza",
        name: "Paneer 65 Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 130,
        },
    },

    {
        id: "paneer-chilli-pizza",
        name: "Paneer Chilli Pizza",
        category: "Pizza",
        isVeg: true,
        pricing: {
            type: "single",
            price: 130,
        },
    },

    // =========================
    // PASTA
    // =========================

    {
        id: "veg-pasta",
        name: "Veg Pasta",
        category: "Pasta",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 40 },
                { label: "Full", price: 70 },
            ],
        },
    },

    {
        id: "red-sauce-pasta",
        name: "Red Sauce Pasta",
        category: "Pasta",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 50 },
                { label: "Full", price: 80 },
            ],
        },
    },

    {
        id: "white-sauce-pasta",
        name: "White Sauce Pasta",
        category: "Pasta",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 60 },
                { label: "Full", price: 100 },
            ],
        },
    },

    {
        id: "crispy-paneer-pasta",
        name: "Crispy Paneer Pasta",
        category: "Pasta",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 70 },
                { label: "Full", price: 110 },
            ],
        },
    },

    // =========================
    // CORN SPECIALS
    // =========================

    {
        id: "crispy-corn",
        name: "Crispy Corn",
        category: "Corn Specials",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 70 },
                { label: "Full", price: 120 },
            ],
        },
    },

    {
        id: "cheese-crispy-corn",
        name: "Cheese Crispy Corn",
        category: "Corn Specials",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 70 },
                { label: "Full", price: 130 },
            ],
        },
    },

    {
        id: "peri-peri-masala-corn",
        name: "Peri Peri Masala Corn",
        category: "Corn Specials",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 70 },
                { label: "Full", price: 120 },
            ],
        },
    },

    {
        id: "honey-crispy-corn",
        name: "Honey Crispy Corn",
        category: "Corn Specials",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 70 },
                { label: "Full", price: 130 },
            ],
        },
    },

    // =========================
    // FRIED RICE
    // =========================

    {
        id: "veg-fried-rice",
        name: "Veg Fried Rice",
        category: "Fried Rice",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 50 },
                { label: "Full", price: 90 },
            ],
        },
    },

    {
        id: "paneer-fried-rice",
        name: "Paneer Fried Rice",
        category: "Fried Rice",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 70 },
                { label: "Full", price: 120 },
            ],
        },
    },

    {
        id: "chilli-garlic-rice",
        name: "Chilli Garlic Rice",
        category: "Fried Rice",
        isVeg: true,
        pricing: {
            type: "options",
            options: [
                { label: "Half", price: 60 },
                { label: "Full", price: 100 },
            ],
        },
    },
];