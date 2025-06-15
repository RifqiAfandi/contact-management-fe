import React from 'react';
import { formatCurrency } from '../utils/formatUtils.js';

const ReceiptTotals = ({ lastTransaction }) => {
  return (
    <div className="receipt-totals">
      <div className="receipt-total-row">
        <span>Sub Total:</span>
        <span>{formatCurrency(lastTransaction.subTotal)}</span>
      </div>
      <div className="receipt-total-row grand-total">
        <span>Total:</span>
        <span>{formatCurrency(lastTransaction.total)}</span>
      </div>
    </div>
  );
};

export default ReceiptTotals;
