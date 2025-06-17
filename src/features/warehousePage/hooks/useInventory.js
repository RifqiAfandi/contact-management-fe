import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { fetchAllInventory } from "../utils/apiUtils";
import { getStoredUser } from "../utils/storageUtils";
import { useMonthFilter } from "./useMonthFilter";

export const useInventory = () => {  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("entryDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [useMonthlyFilter, setUseMonthlyFilter] = useState(true); // Default to monthly view

  const { isLoading, error, setError, get, post, put, del } = useApi();
  const monthFilter = useMonthFilter();
  const fetchInventory = async () => {
    try {
      if (useMonthlyFilter) {
        // Fetch data for current month
        const inventoryData = await monthFilter.getInventoryForMonth(
          monthFilter.currentMonth, 
          sortBy, 
          sortOrder, 
          searchTerm
        );
        console.log("✅ Monthly inventory items loaded:", inventoryData.length);
        setInventoryItems(inventoryData);
        setFilteredItems(inventoryData);
      } else {
        // Fetch all data
        const inventoryData = await fetchAllInventory();
        console.log("✅ All inventory items loaded without pagination:", inventoryData.length);
        setInventoryItems(inventoryData);
        setFilteredItems(inventoryData);
      }
    } catch (error) {
      console.error("❌ Error fetching inventory:", error);
      setError(error.message);
    }
  };

  const refreshInventoryList = async () => {
    try {
      if (useMonthlyFilter) {
        // Refresh data for current month
        const inventoryData = await monthFilter.getInventoryForMonth(
          monthFilter.currentMonth, 
          sortBy, 
          sortOrder, 
          searchTerm
        );
        setInventoryItems(inventoryData);
        setFilteredItems(inventoryData);
        console.log("🔄 Monthly inventory list refreshed");
        
        // Also refresh month navigation state
        await monthFilter.checkAdjacentMonths(monthFilter.currentMonth);
      } else {
        // Refresh all data
        const inventoryData = await fetchAllInventory();
        setInventoryItems(inventoryData);
        setFilteredItems(inventoryData);
        console.log("🔄 Inventory list refreshed without pagination");
      }
    } catch (error) {
      console.error("❌ Error refreshing inventory:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      return;
    }

    try {
      console.log("🗑️ Deleting inventory item:", id);
      const result = await del(`/api/inventory/${id}`);

      if (result.isSuccess) {
        console.log("✅ Item deleted successfully");
        await refreshInventoryList();
      }
    } catch (error) {
      console.error("❌ Error deleting item:", error);
      alert(error.message);
    }
  };
  const handleSubmit = async (e, formData, editingItem) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("itemName", formData.itemName);
      formDataToSend.append("purchasePrice", formData.purchasePrice); 
      formDataToSend.append("expiredDate", formData.expiredDate);
      formDataToSend.append("entryDate", formData.entryDate);
      
      // Add new fields
      if (formData.supplierName) {
        formDataToSend.append("supplierName", formData.supplierName);
      }
      if (formData.useDate) {
        formDataToSend.append("useDate", formData.useDate);
      }

      const userData = getStoredUser();
      if (userData) {
        formDataToSend.append("userId", userData.id);
      }

      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      console.log(`🚀 ${editingItem ? "Updating" : "Creating"} inventory item...`);

      let result;
      if (editingItem) {
        result = await put(`/api/inventory/${editingItem.id}`, formDataToSend);
      } else {
        result = await post("/api/inventory", formDataToSend);
      }

      if (result.isSuccess) {
        console.log("✅ Item saved successfully");
        await refreshInventoryList();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("❌ Error saving item:", error);
      alert(error.message);
      return false;
    }
  };  const handleSearch = () => {
    let filtered = inventoryItems.filter((item) => {
      const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "" || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle null/undefined values - put them at the end
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;      if (sortBy === "itemName" || sortBy === "supplierName") {
        // Handle string comparison for alphabetical sorting
        const aString = String(aValue).toLowerCase().trim();
        const bString = String(bValue).toLowerCase().trim();
        
        // Use localeCompare for proper alphabetical sorting including special characters
        const comparison = aString.localeCompare(bString, 'id', { 
          sensitivity: 'base',
          numeric: true,
          ignorePunctuation: true
        });
        
        return sortOrder === "asc" ? comparison : -comparison;
      }
      else if (sortBy === "purchasePrice") {
        const aNum = parseFloat(aValue) || 0;
        const bNum = parseFloat(bValue) || 0;
        
        if (sortOrder === "asc") {
          return aNum - bNum;
        } else {
          return bNum - aNum;
        }
      } 
      else if (sortBy === "expiredDate" || sortBy === "entryDate" || sortBy === "useDate") {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        
        // Handle invalid dates - put them at the end
        if (isNaN(aDate.getTime()) && isNaN(bDate.getTime())) return 0;
        if (isNaN(aDate.getTime())) return 1;
        if (isNaN(bDate.getTime())) return -1;
        
        if (sortOrder === "asc") {
          return aDate.getTime() - bDate.getTime();
        } else {
          return bDate.getTime() - aDate.getTime();
        }
      }

      // Fallback for other data types
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setFilteredItems(filtered);
  };
  useEffect(() => {
    fetchInventory();
  }, [useMonthlyFilter, monthFilter.currentMonth]);
  useEffect(() => {
    if (useMonthlyFilter) {
      // For monthly view, refetch data instead of client-side filtering
      fetchInventory();
    } else {
      // For all data view, use client-side filtering
      handleSearch();
    }
  }, [searchTerm, sortBy, sortOrder, selectedStatus, useMonthlyFilter]);

  const handleMonthChange = async (newMonth) => {
    monthFilter.changeMonth(newMonth);
    // Data will be refetched automatically by useEffect
  };

  const toggleMonthlyFilter = () => {
    setUseMonthlyFilter(!useMonthlyFilter);
  };
  return {
    inventoryItems,
    filteredItems,
    isLoading: isLoading || monthFilter.isLoading,
    error,
    searchTerm,
    sortBy,
    sortOrder,
    selectedStatus,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setSelectedStatus,
    handleDelete,
    handleSubmit,
    refreshInventoryList,
    // Month filter related
    useMonthlyFilter,
    toggleMonthlyFilter,
    currentMonth: monthFilter.currentMonth,
    canGoPrevious: monthFilter.canGoPrevious,
    canGoNext: monthFilter.canGoNext,
    handleMonthChange,
  };
};