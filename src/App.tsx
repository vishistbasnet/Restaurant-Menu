import { useState } from "react";

import Header from "./components/Header";
import Hero from "./components/layout/Hero";
import CategoryTabs from "./components/menu/CategoryTabs";
import MenuSection from "./components/menu/MenuSection";
import CartBar from "./components/cart/CartBar";
import CartPanel from "./components/cart/CartPanel";
import { CartProvider } from "./context/CartContext";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-950 pb-24 text-white">
        <Header />

        <main>
          <Hero />

          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <MenuSection selectedCategory={selectedCategory} />
        </main>

        <CartBar onViewCart={() => setIsCartOpen(true)} />

        {isCartOpen && (
          <CartPanel onClose={() => setIsCartOpen(false)} />
        )}
      </div>
    </CartProvider>
  );
}

export default App;