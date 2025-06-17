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
  const monthFilter = useMonthFilter();  const fetchInventory = async () => {
    try {
      console.log("🔄 Fetching inventory data...", {
        useMonthlyFilter,
        currentMonth: monthFilter.currentMonth,
        searchTerm,
        selectedStatus
      });

      if (useMonthlyFilter) {
        // Fetch data for current month
        const inventoryData = await monthFilter.getInventoryForMonth(
          monthFilter.currentMonth, 
          sortBy, 
          sortOrder, 
          searchTerm,
          selectedStatus
        );
        console.log("✅ Monthly inventory items loaded:", inventoryData.length);
        setInventoryItems(inventoryData);
        setFilteredItems(inventoryData);
      } else {
        // Fetch all data
        const inventoryData = await fetchAllInventory(searchTerm, selectedStatus, sortBy, sortOrder);
        console.log("✅ All inventory items loaded without pagination:", inventoryData.length);
        setInventoryItems(inventoryData);
        setFilteredItems(inventoryData);
      }
      
      // Clear any previous errors
      setError(null);
    } catch (error) {
      console.error("❌ Error fetching inventory:", error);
      setError(error.message || "Failed to fetch inventory data");
      setInventoryItems([]);
      setFilteredItems([]);
    }
  };  const refreshInventoryList = async () => {
    try {
      console.log("🔄 Refreshing inventory list...");
      
      if (useMonthlyFilter) {
        // Refresh data for current month
        const inventoryData = await monthFilter.getInventoryForMonth(
          monthFilter.currentMonth, 
          sortBy, 
          sortOrder, 
          searchTerm,
          selectedStatus
        );
        setInventoryItems(inventoryData);
        setFilteredItems(inventoryData);
        console.log("🔄 Monthly inventory list refreshed");
        
        // Also refresh month navigation state
        await monthFilter.checkAdjacentMonths(monthFilter.currentMonth);
      } else {
        // Refresh all data
        const inventoryData = await fetchAllInventory(searchTerm, selectedStatus, sortBy, sortOrder);
        setInventoryItems(inventoryData);
        setFilteredItems(inventoryData);
        console.log("🔄 Inventory list refreshed without pagination");
      }
      
      // Clear any previous errors
      setError(null);
    } catch (error) {
      console.error("❌ Error refreshing inventory:", error);
      setError(error.message || "Failed to refresh inventory data");
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
  };  const handleSubmit = async (e, formData, editingItem) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.itemName?.trim()) {
      alert("Nama barang harus diisi");
      return false;
    }

    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      alert("Harga beli harus diisi dengan nilai yang valid");
      return false;
    }

    if (!formData.entryDate) {
      alert("Tanggal masuk harus diisi");
      return false;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("itemName", formData.itemName.trim());
      formDataToSend.append("purchasePrice", parseFloat(formData.purchasePrice)); 
      formDataToSend.append("entryDate", formData.entryDate);
      
      // Optional fields - only append if they have values
      if (formData.expiredDate) {
        formDataToSend.append("expiredDate", formData.expiredDate);
      }
      
      if (formData.supplierName?.trim()) {
        formDataToSend.append("supplierName", formData.supplierName.trim());
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
      console.log("Form data being sent:", {
        itemName: formData.itemName,
        purchasePrice: formData.purchasePrice,
        entryDate: formData.entryDate,
        expiredDate: formData.expiredDate,
        supplierName: formData.supplierName,
        useDate: formData.useDate,
        hasImage: !!formData.imageFile
      });

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
      alert(`Error: ${error.message}`);
      return false;
    }
  };  // This function is now mainly for debugging since we use server-side filtering
  const handleSearch = () => {
    console.log("🔍 Server-side filtering is now active. Client-side filtering not needed.", {
      searchTerm,
      selectedStatus,
      totalItems: inventoryItems.length,
      sortBy,
      sortOrder
    });

    // Since server-side filtering is active, filteredItems should be same as inventoryItems
    setFilteredItems(inventoryItems);
    
    console.log(`📋 Items displayed: ${inventoryItems.length} (server-filtered)`);
    console.log(`🔍 Active filters - SearchTerm: "${searchTerm}", SelectedStatus: "${selectedStatus}"`);
  };useEffect(() => {
    console.log("🔄 Initial inventory fetch on mount");
    fetchInventory();
  }, [useMonthlyFilter, monthFilter.currentMonth]);  useEffect(() => {
    console.log("🔍 Search/Filter change detected:", {
      searchTerm,
      selectedStatus,
      sortBy,
      sortOrder,
      useMonthlyFilter
    });
    
    // Always refetch data from server with current filters
    // This ensures both monthly and all-data views use server-side filtering
    console.log("🔄 Refetching data with current filters");
    fetchInventory();
  }, [searchTerm, sortBy, sortOrder, selectedStatus]);

  // Separate useEffect for monthly filter toggle
  useEffect(() => {
    console.log("🔄 Monthly filter toggled:", useMonthlyFilter);
    fetchInventory();
  }, [useMonthlyFilter]);

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