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

import type { MenuItem } from "./types/menu";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [menuError, setMenuError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        setIsLoading(true);
        setMenuError(null);

        const restaurant = await getRestaurant();

        const [categoryData, items] = await Promise.all([
          getCategories(restaurant.id),
          getMenuItems(restaurant.id),
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
        <Header />

        <main>
          <Hero />

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

        <CartBar onViewCart={() => setIsCartOpen(true)} />

        {isCartOpen && (
          <CartPanel
            onClose={() => setIsCartOpen(false)}
          />
        )}
      </div>
    </CartProvider>
  );
}

export default App;