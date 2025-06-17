import React, { useState } from "react";
import Header from "./components/Header.jsx";
import ProductsSection from "./components/ProductsSection.jsx";
import CartSection from "./components/CartSection.jsx";
import ReceiptModal from "./components/ReceiptModal.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { useProducts } from "./hooks/useProducts.js";
import { useCart } from "./hooks/useCart.js";
import { useCheckout } from "./hooks/useCheckout.js";
import { filterAndSortProducts } from "./utils/cashierUtils.js";
import { calculateCartTotal } from "./utils/formatUtils.js";
import { CATEGORIES } from "./constants/config.js";
import "./CashierPage.css";

const CashierPage = () => {
  const { user } = useAuth();
  const { products, loading, error } = useProducts();
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  const {
    paymentMethod,
    setPaymentMethod,
    checkoutLoading,
    showReceipt,
    lastTransaction,
    processCheckout,
    resetTransaction
  } = useCheckout();  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.ALL);
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredProducts = filterAndSortProducts(products, searchTerm, selectedCategory, "productName", sortOrder);
  const total = calculateCartTotal(cart);

  const handleCheckout = () => {
    processCheckout(cart, user, clearCart);
  };

  return (
    <div className="kasir-container">
      <Header user={user} />

      <main className="kasir-main">        <ProductsSection
          products={products}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          filteredProducts={filteredProducts}
          addToCart={addToCart}
        />

        <CartSection
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          total={total}
          onCheckout={handleCheckout}
          checkoutLoading={checkoutLoading}
        />
      </main>

      <ReceiptModal
        showReceipt={showReceipt}
        lastTransaction={lastTransaction}
        onResetTransaction={resetTransaction}
      />
    </div>
  );
};

export default CashierPage;
