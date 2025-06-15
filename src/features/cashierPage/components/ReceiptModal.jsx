import React from 'react';
import ReceiptHeader from './ReceiptHeader.jsx';
import ReceiptDetails from './ReceiptDetails.jsx';
import ReceiptItems from './ReceiptItems.jsx';
import ReceiptTotals from './ReceiptTotals.jsx';
import ReceiptFooter from './ReceiptFooter.jsx';
import ReceiptActions from './ReceiptActions.jsx';

const ReceiptModal = ({ showReceipt, lastTransaction, onResetTransaction }) => {
  if (!showReceipt || !lastTransaction) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="receipt">
          <ReceiptHeader lastTransaction={lastTransaction} />
          <ReceiptDetails lastTransaction={lastTransaction} />
          <ReceiptItems lastTransaction={lastTransaction} />
          <ReceiptTotals lastTransaction={lastTransaction} />
          <ReceiptFooter />
          <ReceiptActions onResetTransaction={onResetTransaction} />
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
