import React from 'react';
import { RECEIPT_CONFIG } from '../constants/config.js';
import { formatCurrency } from '../utils/formatUtils.js';

const ReceiptModal = ({ showReceipt, lastTransaction, onResetTransaction }) => {
  if (!showReceipt || !lastTransaction) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="receipt">
          <div className="receipt-header">
            <h2 className="store-name">{RECEIPT_CONFIG.STORE_NAME}</h2>
            <p className="store-address">{RECEIPT_CONFIG.STORE_ADDRESS}</p>
            <p className="receipt-date">
              {new Date(lastTransaction.date).toLocaleString("id-ID")}
            </p>
          </div>

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

          <div className="receipt-footer">
            <p>Terima kasih telah berbelanja di {RECEIPT_CONFIG.STORE_NAME}</p>
          </div>

          <div className="receipt-actions">
            <button className="receipt-btn print-btn">Print Receipt</button>
            <button
              className="receipt-btn close-btn"
              onClick={onResetTransaction}
            >
              New Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
