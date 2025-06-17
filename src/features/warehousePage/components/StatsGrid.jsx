import React from "react";
import StatCard from "./StatCard";
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
      title: "Barang Baik",
      value: inventoryItems.filter(item => item.status === "Baik").length,
      icon: "check",
      iconColor: "icon-green",
    },
    {
      title: "Segera Expired",
      value: inventoryItems.filter(item => item.status === "Segera Expired").length,
      icon: "calendar",
      iconColor: "icon-orange",
    },
    {
      title: "Expired",
      value: inventoryItems.filter(item => item.status === "Expired").length,
      icon: "alert",
      iconColor: "icon-red",
    },
    {
      title: "Terpakai",
      value: inventoryItems.filter(item => item.status === "Terpakai").length,
      icon: "archive",
      iconColor: "icon-gray",
    },
    {
      title: "Total Nilai",
      value: formatCurrency(
        inventoryItems
          .filter(item => item.status !== "Terpakai") // Exclude used items from total value
          .reduce((sum, item) => sum + item.purchasePrice, 0)
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