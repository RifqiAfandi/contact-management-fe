import React from "react";
import { formatCurrency, formatDate } from "../utils/formatUtils";

// Helper function to get status badge class
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Baik':
      return 'status-normal';
    case 'Segera Expired':
      return 'status-warning';
    case 'Expired':
      return 'status-expired';
    case 'Terpakai':
      return 'status-used';
    default:
      return 'status-normal';
  }
};

const ItemDetails = ({ item }) => {
  return (
    <div className="item-details">
      <div className="detail-item">
        <span className="detail-label">Status</span>
        <span className={`detail-value status-badge ${getStatusBadgeClass(item.status || 'Baik')}`}>
          {item.status || 'Baik'}
        </span>
      </div>
      {item.supplierName && (
        <div className="detail-item">
          <span className="detail-label">Supplier</span>
          <span className="detail-value">{item.supplierName}</span>
        </div>
      )}
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
      {item.useDate && (
        <div className="detail-item">
          <span className="detail-label">Tanggal Terpakai</span>
          <span className="detail-value">{formatDate(item.useDate)}</span>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;