import React from 'react';
import CartItems from './CartItems.jsx';
import CartSummary from './CartSummary.jsx';

const CartSection = ({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  paymentMethod, 
  setPaymentMethod, 
  total, 
  onCheckout, 
  checkoutLoading 
}) => {
  return (
    <section className="cart-section">
      <div className="cart-header">
        <h3 className="cart-title">Keranjang</h3>
        <p className="cart-subtitle">{cart.length} item</p>
      </div>

      <CartItems 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      <CartSummary 
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        total={total}
        onCheckout={onCheckout}
        checkoutLoading={checkoutLoading}
        cartLength={cart.length}
      />
    </section>
  );
};

export default CartSection;
