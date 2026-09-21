import { useEffect, useState } from "react";

import Header from "./components/Header";
import Hero from "./components/layout/Hero";
import CategoryTabs from "./components/menu/CategoryTabs";
import MenuSection from "./components/menu/MenuSection";
import CartBar from "./components/cart/CartBar";
import CartPanel from "./components/cart/CartPanel";
import Footer from "./components/layout/Footer";

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

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [categories, setCategories] =
    useState<string[]>([]);

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [menuError, setMenuError] =
    useState<string | null>(null);

  /*
   * ---------------------------------------------------------
   * RESTAURANT STATUS
   * ---------------------------------------------------------
   *
   * Manual closure:
   *     is_active = false
   *
   * always keeps the restaurant closed.
   *
   * When is_active = true:
   *     opening_time
   *     closing_time
   *
   * determine whether the restaurant is currently open.
   */
  const restaurantStatus = restaurant
    ? getRestaurantStatus(restaurant)
    : null;

  /*
   * ---------------------------------------------------------
   * LOAD RESTAURANT + MENU
   * ---------------------------------------------------------
   */
  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      try {
        setIsLoading(true);
        setMenuError(null);

        /*
         * Load restaurant.
         *
         * getRestaurant() is responsible for returning:
         *
         * id
         * name
         * is_active
         * opening_time
         * closing_time
         * phone
         * whatsapp
         * order_type
         */
        const restaurantData =
          await getRestaurant();

        if (!isMounted) {
          return;
        }

        setRestaurant(restaurantData);

        /*
         * Load categories and menu items
         * belonging to this restaurant.
         */
        const [
          categoryData,
          items,
        ] = await Promise.all([
          getCategories(
            restaurantData.id
          ),
          getMenuItems(
            restaurantData.id
          ),
        ]);

        if (!isMounted) {
          return;
        }

        /*
         * -----------------------------------------------------
         * CATEGORY MAP
         * -----------------------------------------------------
         *
         * Menu items store category_id.
         *
         * Customer UI needs the category name.
         */
        const categoryMap = new Map(
          categoryData.map(
            (category) => [
              category.id,
              category.name,
            ]
          )
        );

        /*
         * -----------------------------------------------------
         * MENU ITEM MAPPING
         * -----------------------------------------------------
         */
        const mappedItems =
          mapSupabaseMenuItems(
            items,
            {
              categoryMap,
            }
          );

        /*
         * -----------------------------------------------------
         * UPDATE STATE
         * -----------------------------------------------------
         */
        setCategories(
          categoryData.map(
            (category) =>
              category.name
          )
        );

        setMenuItems(
          mappedItems
        );
      } catch (error) {
        console.error(
          "Failed to load customer menu:",
          error
        );

        if (!isMounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load menu.";

        setMenuError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadMenu();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-950 pb-24 text-white">
        {/* Header */}
        <Header
          restaurant={restaurant}
          status={restaurantStatus}
        />

        <main>
          {/* Hero */}
          <Hero
            restaurant={restaurant}
            status={restaurantStatus}
          />

          {/* Categories */}
          <CategoryTabs
            categories={categories}
            selectedCategory={
              selectedCategory
            }
            onCategoryChange={
              setSelectedCategory
            }
          />

          {/* Menu */}
          <MenuSection
            selectedCategory={
              selectedCategory
            }
            menuItems={menuItems}
            isLoading={isLoading}
            error={menuError}
          />
        </main>

        {/* Footer */}
        <Footer />

        {/* Cart Bar */}
        <CartBar
          onViewCart={() =>
            setIsCartOpen(true)
          }
        />

        {/* Cart Panel */}
        {isCartOpen && (
          <CartPanel
            onClose={() =>
              setIsCartOpen(false)
            }
            restaurant={restaurant}
            status={restaurantStatus}
          />
        )}
      </div>
    </CartProvider>
  );
}

export default App;