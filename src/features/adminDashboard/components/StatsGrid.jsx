import React, { useEffect } from "react";
import StatCard from "./StatCard";
import { useStats } from "../hooks/useStats";

const StatsGrid = () => {
  const { stats, loading, refreshStats } = useStats();

  useEffect(() => {
    refreshStats();
  }, []);

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
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
