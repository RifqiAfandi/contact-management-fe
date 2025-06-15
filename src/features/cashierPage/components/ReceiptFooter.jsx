import React from 'react';
import { STORE_CONFIG } from '../constants/config.js';

const ReceiptFooter = () => {
  return (
    <div className="receipt-footer">
      <p>Terima kasih telah berbelanja di {STORE_CONFIG.NAME}</p>
    </div>
  );
};

export default ReceiptFooter;
