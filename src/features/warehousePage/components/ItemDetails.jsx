import React from "react";
import { formatCurrency, formatDate } from "../utils/formatUtils";

const ItemDetails = ({ item }) => {
  return (
    <div className="item-details">
      <div className="detail-item">
        <span className="detail-label">Harga Beli</span>
        <span className="detail-value">
          {formatCurrency(item.purchasePrice)}
        </span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Tanggal Masuk</span>
        <span className="detail-value">{formatDate(item.entryDate)}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Expired</span>
        <span className="detail-value">
          {formatDate(item.expiredDate)}
        </span>
      </div>
    </div>
  );
};

export default ItemDetails;