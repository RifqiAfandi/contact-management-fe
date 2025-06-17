import React, { useState, useEffect } from "react";
import { message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import StatCard from "./StatCard";

const StatsGrid = () => {
  const [statsData, setStatsData] = useState([
    {
      title: "Total Users",
      value: "0",
      icon: "users",
      iconColor: "icon-blue",
    },
    {
      title: "Total Produk",
      value: "0",
      icon: "product",
      iconColor: "icon-green",
    },
    {
      title: "Stok Tidak Expired",
      value: "0",
      icon: "stock",
      iconColor: "icon-orange",
    },
    {
      title: "Stok Akan Expired",
      value: "0",
      icon: "report",
      iconColor: "icon-purple",
    },
  ]);
  const fetchStatsData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      // Fetch all data in parallel
      const [usersResponse, productsResponse, stockResponse] = await Promise.allSettled([
        // Get all users to filter out admin
        axios.get("http://localhost:5000/api/auth/users", {
          params: { page: 1, limit: 1000 }, // Get all users to count properly
          headers,
        }),
        // Get all products to count them
        axios.get("http://localhost:5000/api/products", {
          params: { page: 1, limit: 1000 }, // Get all products to count properly
          headers,
        }),        // Get all stock data using the no-pagination endpoint
        axios.get("http://localhost:5000/api/inventory/all", {
          headers,
        }),
      ]);

      // Extract and count users (excluding admin)
      let totalUsers = 0;
      if (usersResponse.status === 'fulfilled') {
        const userData = usersResponse.value.data;
        const users = userData.data || [];
        // Count users excluding admin role
        totalUsers = users.filter(user => user.role !== 'admin').length;
        console.log("Users data:", users);
        console.log("Non-admin users count:", totalUsers);
      }

      // Extract and count all products
      let totalProducts = 0;
      if (productsResponse.status === 'fulfilled') {
        const productData = productsResponse.value.data;
        const products = productData.data || [];
        totalProducts = products.length;
        console.log("Products data:", products);
        console.log("Total products count:", totalProducts);
      }

      let nonExpiredStock = 0;
      let aboutToExpireStock = 0;      if (stockResponse.status === 'fulfilled') {
        const stockData = stockResponse.value.data;
        const stockItems = stockData.data || [];
        const now = dayjs();
        
        console.log("✅ Stock data loaded:", stockItems.length, "items");
        
        stockItems.forEach(item => {
          // Only count items that are not used (available stock)
          if (!item.useDate) {
            if (!item.expiredDate) {
              // Items without expiry date are considered non-expired
              nonExpiredStock++;
            } else {
              const expiry = dayjs(item.expiredDate);
              const daysUntilExpiry = expiry.diff(now, "day");
              
              if (daysUntilExpiry >= 0 && daysUntilExpiry < 30) {
                // Items expiring within 30 days
                aboutToExpireStock++;
              } else if (daysUntilExpiry >= 30) {
                // Items not expiring soon
                nonExpiredStock++;
              }
              // Items already expired are not counted in either category
            }
          }
        });
        
        console.log("📊 Stock analysis:", { 
          totalItems: stockItems.length, 
          availableItems: stockItems.filter(item => !item.useDate).length,
          nonExpiredStock, 
          aboutToExpireStock 
        });
      }

      console.log("Final stats:", { totalUsers, totalProducts, nonExpiredStock, aboutToExpireStock });

      // Update stats data
      setStatsData([
        {
          title: "Total Users",
          value: totalUsers.toLocaleString(),
          icon: "users",
          iconColor: "icon-blue",
        },
        {
          title: "Total Produk",
          value: totalProducts.toLocaleString(),
          icon: "product",
          iconColor: "icon-green",
        },
        {
          title: "Stok Tidak Expired",
          value: nonExpiredStock.toLocaleString(),
          icon: "stock",
          iconColor: "icon-orange",
        },
        {
          title: "Stok Akan Expired",
          value: aboutToExpireStock.toLocaleString(),
          icon: "report",
          iconColor: "icon-purple",
        },
      ]);

      // Log any failed requests
      [usersResponse, productsResponse, stockResponse].forEach((response, index) => {
        if (response.status === 'rejected') {
          console.warn(`Stats request ${index} failed:`, response.reason);
          if (response.reason?.response?.status === 401) {
            message.error("Session expired. Please login again.");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
        }
      });

    } catch (error) {
      console.error("Error fetching stats data:", error);
      message.error("Gagal memuat data statistik");
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);
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
