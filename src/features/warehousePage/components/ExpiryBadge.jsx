import React from "react";
import { getExpiryStatus, getExpiryStatusText } from "../utils/inventoryUtils";

const ExpiryBadge = ({ expiredDate }) => {
  const status = getExpiryStatus(expiredDate);
  const statusText = getExpiryStatusText(expiredDate);

  return (
    <div className={`expiry-badge ${status}`}>
      {statusText}
    </div>
  );
};

export default ExpiryBadge;