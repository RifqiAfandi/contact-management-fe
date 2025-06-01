import React from "react";
import StatCard from "./StatCard";
import { getExpiryStatus } from "../utils/inventoryUtils";
import { formatCurrency } from "../utils/formatUtils";

const StatsGrid = ({ inventoryItems }) => {
  const statsData = [
    {
      title: "Total Barang",
      value: inventoryItems.length,
      icon: "package",
      iconColor: "icon-blue",
    },
    {
      title: "Akan Expired",
      value: inventoryItems.filter(
        (item) => getExpiryStatus(item.expiredDate) === "warning"
      ).length,
      icon: "calendar",
      iconColor: "icon-orange",
    },
    {
      title: "Total Nilai",
      value: formatCurrency(
        inventoryItems.reduce((sum, item) => sum + item.purchasePrice, 0)
      ),
      icon: "money",
      iconColor: "icon-green",
    },
  ];

  return (
    <div className="stats-grid">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
};

export default StatsGrid;