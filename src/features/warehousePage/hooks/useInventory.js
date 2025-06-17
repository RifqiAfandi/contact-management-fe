import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { fetchAllInventory } from "../utils/apiUtils";
import { getStoredUser } from "../utils/storageUtils";

export const useInventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("entryDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const { isLoading, error, setError, get, post, put, del } = useApi();

  const fetchInventory = async () => {
    try {
      const inventoryData = await fetchAllInventory();
      console.log("✅ All inventory items loaded without pagination:", inventoryData.length);
      setInventoryItems(inventoryData);
      setFilteredItems(inventoryData);
    } catch (error) {
      console.error("❌ Error fetching inventory:", error);
      setError(error.message);
    }
  };
  const refreshInventoryList = async () => {
    try {
      const inventoryData = await fetchAllInventory();
      setInventoryItems(inventoryData);
      setFilteredItems(inventoryData);
      console.log("🔄 Inventory list refreshed without pagination");
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
  };

  const handleSearch = () => {
    let filtered = inventoryItems.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "purchasePrice") {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      } else if (sortBy === "expiredDate" || sortBy === "entryDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredItems(filtered);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, inventoryItems, sortBy, sortOrder]);

  return {
    inventoryItems,
    filteredItems,
    isLoading,
    error,
    searchTerm,
    sortBy,
    sortOrder,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    handleDelete,
    handleSubmit,
    refreshInventoryList,
  };
};