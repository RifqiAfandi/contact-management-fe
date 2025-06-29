import { useState, useEffect } from "react";
import { message } from "antd";
import { apiRequest } from "../utils/apiUtils";

export const useInventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // Fetch all inventory items
  const fetchAllInventory = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? `/api/inventory/all?${queryParams}` : "/api/inventory/all";
      
      const response = await apiRequest(endpoint);
      
      if (response && response.data) {
        setInventoryItems(response.data);
        calculateStats(response.data);
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setError(error.message);
      message.error(error.message || "Gagal mengambil data inventory");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch low stock notification
  const fetchLowStockItems = async () => {
    try {
      const response = await apiRequest("/api/inventory/low-stock");
      
      if (response && response.data) {
        setLowStockItems(response.data);
        return response.data;
      }
      
      return [];
    } catch (error) {
      setError(error.message);
      message.error(error.message || "Gagal mengambil data stok rendah");
      return [];
    }
  };

  // Calculate inventory statistics
  const calculateStats = (items) => {
    if (!Array.isArray(items)) return;
    
    const available = items.filter(item => !item.useDate).length;
    const used = items.filter(item => item.useDate).length;
    
    setTotalAvailable(available);
    setTotalUsed(used);
  };

  // Filter inventory items by status
  const filterByStatus = (status) => {
    return inventoryItems.filter(item => {
      if (status === 'available') return !item.useDate;
      if (status === 'used') return item.useDate;
      if (status === 'expired') return item.status === 'Expired';
      if (status === 'warning') return item.status === 'Segera Expired';
      if (status === 'normal') return item.status === 'Baik';
      return true;
    });
  };

  // Get inventory items within date range
  const filterByDateRange = (startDate, endDate) => {
    return inventoryItems.filter(item => {
      const entryDate = new Date(item.entryDate);
      return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
    });
  };

  // Get inventory items by supplier
  const filterBySupplier = (supplierName) => {
    return inventoryItems.filter(item => 
      item.supplierName && item.supplierName.toLowerCase().includes(supplierName.toLowerCase())
    );
  };

  // Refresh all inventory data
  const refreshInventory = async () => {
    await Promise.all([
      fetchAllInventory(),
      fetchLowStockItems()
    ]);
  };

  // Initial load
  useEffect(() => {
    refreshInventory();
  }, []);

  return {
    // Data
    inventoryItems,
    lowStockItems,
    totalAvailable,
    totalUsed,
      // Loading states
    loading,
    error,
    
    // Functions
    fetchAllInventory,
    fetchLowStockItems,
    refreshInventory,
    filterByStatus,
    filterByDateRange,
    filterBySupplier,
    calculateStats,
    setError,
  };
};
