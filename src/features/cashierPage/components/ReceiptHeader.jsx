import React from 'react';
import { STORE_CONFIG } from '../constants/config.js';

const ReceiptHeader = ({ lastTransaction }) => {
  return (
    <div className="receipt-header">
      <h2 className="store-name">{STORE_CONFIG.NAME}</h2>
      <p className="store-address">{STORE_CONFIG.ADDRESS}</p>
      <p className="receipt-date">
        {new Date(lastTransaction.date).toLocaleString("id-ID")}
      </p>
    </div>
  );
};

export default ReceiptHeader;
