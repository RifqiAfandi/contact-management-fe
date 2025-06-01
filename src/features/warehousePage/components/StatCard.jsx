import React from "react";
import { renderIcon } from "../utils/iconUtils";

const StatCard = ({ title, value, icon, iconColor }) => {
  return (
    <div className="stat-card">
      <div className="card-content">
        <div className="card-info">
          <h3 className="card-title">{title}</h3>
          <p className="card-value">{value}</p>
        </div>
        <div className={`card-icon ${iconColor}`}>
          {renderIcon(icon)}
        </div>
      </div>
    </div>
  );
};

export default StatCard;