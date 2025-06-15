import React from 'react';

const ReceiptActions = ({ onResetTransaction }) => {
  return (
    <div className="receipt-actions">
      <button className="receipt-btn print-btn">Print Receipt</button>
      <button
        className="receipt-btn close-btn"
        onClick={onResetTransaction}
      >
        New Transaction
      </button>
    </div>
  );
};

export default ReceiptActions;
