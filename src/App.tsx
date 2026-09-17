import { useEffect, useState } from "react";

import Header from "./components/Header";
import Hero from "./components/layout/Hero";
import CategoryTabs from "./components/menu/CategoryTabs";
import MenuSection from "./components/menu/MenuSection";
import CartBar from "./components/cart/CartBar";
import CartPanel from "./components/cart/CartPanel";
import { CartProvider } from "./context/CartContext";

import {
  getCategories,
  getMenuItems,
  getRestaurant,
} from "./services/menuService";

import { mapSupabaseMenuItems } from "./services/menuMapper";

import { getRestaurantStatus } from "./utils/restaurantHours";

import type { MenuItem } from "./types/menu";
import type { Restaurant } from "./types/restaurant";
import Footer from "./components/layout/Footer";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [categories, setCategories] =
    useState<string[]>([])

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);
  const restaurantStatus = restaurant
    ? getRestaurantStatus(restaurant)
    : null;

  useEffect(() => {
    async function loadMenu() {
      try {
        setIsLoading(true);
        setMenuError(null);

        const restaurantData = await getRestaurant();

        setRestaurant(restaurantData);

        const [categoryData, items] = await Promise.all([
          getCategories(restaurantData.id),
          getMenuItems(restaurantData.id),
        ]);

        const categoryMap = new Map(
          categoryData.map((category) => [category.id, category.name])
        );

        const mappedItems = mapSupabaseMenuItems(items, {
          categoryMap,
        });

        setCategories(
          categoryData.map((category) => category.name)
        );

        setMenuItems(mappedItems);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load menu.";

        setMenuError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadMenu();
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-950 pb-24 text-white">
        <Header
          restaurant={restaurant}
          status={restaurantStatus}
        />

        <main>
          <Hero
            restaurant={restaurant}
            status={restaurantStatus}
          />

          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <MenuSection
            selectedCategory={selectedCategory}
            menuItems={menuItems}
            isLoading={isLoading}
            error={menuError}
          />
        </main>

        <Footer />

        <CartBar onViewCart={() => setIsCartOpen(true)} />

        {isCartOpen && (
          <CartPanel
            onClose={() => setIsCartOpen(false)}
            restaurant={restaurant}
            status={restaurantStatus}
          />
        )}
      </div>
    </CartProvider>

  );
}

export default App;