import React from "react";
import StatCard from "./StatCard";
import { statsData } from "../constants/statData";

const StatsGrid = () => {
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
