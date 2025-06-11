import { useState } from 'react';
import { createTransaction } from '../utils/apiUtils.js';
import { createTransactionPayload, createReceiptData } from '../utils/cashierUtils.js';
import { calculateCartTotal } from '../utils/formatUtils.js';
import { PAYMENT_METHODS } from '../constants/config.js';

export const useCheckout = () => {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const processCheckout = async (cart, user, clearCart) => {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    if (!user || !user.id) {
      alert("Silahkan login terlebih dahulu untuk melakukan transaksi.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sesi anda telah berakhir. Silahkan login kembali.");
      window.location.href = "/login";
      return;
    }

    setCheckoutLoading(true);
    try {
      const subTotal = calculateCartTotal(cart);
      const total = subTotal;
      
      const transactionPayload = createTransactionPayload(
        cart, 
        user, 
        paymentMethod, 
        total, 
        subTotal
      );

      const result = await createTransaction(transactionPayload);
      
      const receiptData = createReceiptData(result, cart);
      setLastTransaction(receiptData);
      setShowReceipt(true);
      clearCart();
    } catch (error) {
      console.error("❌ Error processing transaction:", error);
      if (error.message === "Authentication token not found") {
        window.location.href = "/login";
        return;
      }
      alert(`Failed to process transaction: ${error.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const resetTransaction = () => {
    setShowReceipt(false);
    setLastTransaction(null);
  };

  return {
    paymentMethod,
    setPaymentMethod,
    checkoutLoading,
    showReceipt,
    lastTransaction,
    processCheckout,
    resetTransaction
  };
};
