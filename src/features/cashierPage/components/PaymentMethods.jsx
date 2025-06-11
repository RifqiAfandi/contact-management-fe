import React from 'react';
import { PAYMENT_METHODS } from '../constants/config.js';

const PaymentMethods = ({ paymentMethod, setPaymentMethod }) => {
  const methods = [
    { key: PAYMENT_METHODS.CASH, label: 'Cash' },
    { key: PAYMENT_METHODS.CARD, label: 'Card' },
    { key: PAYMENT_METHODS.QRIS, label: 'QRIS' }
  ];

  return (
    <div className="payment-methods">
      {methods.map((method) => (
        <div
          key={method.key}
          className={`payment-method ${
            paymentMethod === method.key ? "active" : ""
          }`}
          onClick={() => setPaymentMethod(method.key)}
        >
          {method.label}
        </div>
      ))}
    </div>
  );
};

export default PaymentMethods;
