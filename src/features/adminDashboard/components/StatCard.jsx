import React from "react";
import { renderIcon } from "../utils/IconUtils";

const StatCard = ({ title, value, icon, iconColor }) => {
  return (
    <div className="stat-card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          <div className="card-value">{value}</div>
        </div>
        <div className={`card-icon ${iconColor}`}>
          {renderIcon(icon)}
        </div>
      </div>
    </div>
  );
};

export default StatCard;