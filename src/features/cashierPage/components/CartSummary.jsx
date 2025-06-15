import React from 'react';
import PaymentMethods from './PaymentMethods.jsx';
import { formatCurrency } from '../utils/formatUtils.js';

const CartSummary = ({ 
  paymentMethod, 
  setPaymentMethod, 
  total, 
  onCheckout, 
  checkoutLoading,
  cartLength 
}) => {
  return (
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
        disabled={cartLength === 0 || checkoutLoading}
      >
        {checkoutLoading ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
};

export default CartSummary;
