import React from 'react';
import { formatCurrency } from '../utils/formatUtils.js';

const ReceiptItems = ({ lastTransaction }) => {
  return (
    <div className="receipt-items">
      <div className="receipt-items-header">
        <span>Product</span>
        <span>Qty</span>
        <span>Price</span>
        <span>Total</span>
      </div>
      {lastTransaction.items.map((item) => (
        <div key={item.id} className="receipt-item">
          <span>{item.productName}</span>
          <span>{item.quantity}</span>
          <span>{formatCurrency(item.price)}</span>
          <span>{formatCurrency(item.total)}</span>
        </div>
      ))}
    </div>
  );
};

export default ReceiptItems;
