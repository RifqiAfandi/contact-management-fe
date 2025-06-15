import React from 'react';

const ReceiptDetails = ({ lastTransaction }) => {
  return (
    <div className="receipt-details">
      <div className="receipt-row">
        <span>Customer:</span>
        <span>{lastTransaction.customerName}</span>
      </div>
      <div className="receipt-row">
        <span>Transaction ID:</span>
        <span>#{lastTransaction.id}</span>
      </div>
      <div className="receipt-row">
        <span>Payment Method:</span>
        <span>{lastTransaction.paymentMethod.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default ReceiptDetails;
