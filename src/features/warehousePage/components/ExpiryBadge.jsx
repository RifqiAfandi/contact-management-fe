import React from "react";

// Helper function to get badge class based on status
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Baik':
      return 'normal';
    case 'Segera Expired':
      return 'warning';
    case 'Expired':
      return 'expired';
    case 'Terpakai':
      return 'used';
    default:
      return 'normal';
  }
};

// Helper function to get display text for status
const getStatusDisplayText = (status) => {
  switch (status) {
    case 'Baik':
      return 'Baik';
    case 'Segera Expired':
      return 'Segera Expired';
    case 'Expired':
      return 'Expired';
    case 'Terpakai':
      return 'Terpakai';
    default:
      return 'Baik';
  }
};

const ExpiryBadge = ({ status }) => {
  const badgeClass = getStatusBadgeClass(status || 'Baik');
  const displayText = getStatusDisplayText(status || 'Baik');

  return (
    <div className={`expiry-badge ${badgeClass}`}>
      {displayText}
    </div>
  );
};

export default ExpiryBadge;