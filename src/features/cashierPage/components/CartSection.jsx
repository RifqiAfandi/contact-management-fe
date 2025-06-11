import React from 'react';
import CartItem from './CartItem.jsx';
import PaymentMethods from './PaymentMethods.jsx';
import { formatCurrency } from '../utils/formatUtils.js';

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

      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <span className="empty-icon">🛒</span>
            <p className="empty-text">Keranjang kosong</p>
            <p className="empty-subtext">
              Pilih produk untuk ditambahkan ke keranjang
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
            />
          ))
        )}
      </div>

      <div className="cart-summary">
        <PaymentMethods 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
        />

        <div className="summary-row">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <button
          className="checkout-btn"
          onClick={onCheckout}
          disabled={cart.length === 0 || checkoutLoading}
        >
          {checkoutLoading ? "Processing..." : "Checkout"}
        </button>
      </div>
    </section>
  );
};

export default CartSection;
