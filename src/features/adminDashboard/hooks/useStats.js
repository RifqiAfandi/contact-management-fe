import { useState } from "react";
import { message } from "antd";
import { apiRequest } from "../utils/apiUtils";
import dayjs from "dayjs";

export const useStats = () => {
  const [stats, setStats] = useState([
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
      icon: "expired",
      iconColor: "icon-purple",
    },
  ]);  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [usersResponse, productsResponse, stockResponse] =
        await Promise.allSettled([
          // Get all users to filter out admin
          apiRequest("/api/auth/users?page=1&limit=1000"),
          // Get all products to count them
          apiRequest("/api/products?page=1&limit=1000"),
          // Get all stock data using the no-pagination endpoint
          apiRequest("/api/inventory/all"),
        ]);      // Extract and count users (excluding admin)
      let totalUsers = 0;
      if (usersResponse.status === "fulfilled" && usersResponse.value.data) {
        const users = usersResponse.value.data || [];
        // Count users excluding admin role
        totalUsers = users.filter((user) => user.role !== "admin").length;
      }

      // Extract and count all products
      let totalProducts = 0;
      if (productsResponse.status === "fulfilled" && productsResponse.value.data) {
        const products = productsResponse.value.data || [];
        totalProducts = products.length;
      }

      let nonExpiredStock = 0;
      let aboutToExpireStock = 0;
      if (stockResponse.status === "fulfilled" && stockResponse.value.data) {
        const stockItems = stockResponse.value.data || [];
        const now = dayjs();

        stockItems.forEach((item) => {
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
      }

      // Update stats data
      setStats([
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
          icon: "expired",
          iconColor: "icon-purple",
        },
      ]);
    } catch (error) {
      setError(error.message);
      message.error(error.message || "Gagal memuat data statistik");
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats,
  };
};
