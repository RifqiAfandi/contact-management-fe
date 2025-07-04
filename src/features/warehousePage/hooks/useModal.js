import { useState } from "react";

export const useModal = (refreshInventoryList) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);  const [formData, setFormData] = useState({
    itemName: "",
    purchasePrice: "",
    expiredDate: "",
    entryDate: new Date().toISOString().split("T")[0], // Default to today
    supplierName: "",
    useDate: "",
    imageFile: null,
  });
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "imageFile") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // If useDate is being set and has a value, the item becomes "Terpakai" (Used)
      // If useDate is being cleared, status should be recalculated based on expiry
      if (name === "useDate") {
        console.log("📅 UseDate changed:", value);
        // The status will be handled by the backend based on useDate value
        // No need to calculate it here as backend has the logic
      }
    }
  };const handleEdit = (item) => {
    setEditingItem(item);
    
    // Format dates properly for input fields
    const formattedExpiredDate = item.expiredDate
      ? new Date(item.expiredDate).toISOString().split("T")[0]
      : "";
    const formattedEntryDate = item.entryDate
      ? new Date(item.entryDate).toISOString().split("T")[0]
      : "";
    const formattedUseDate = item.useDate
      ? new Date(item.useDate).toISOString().split("T")[0]
      : "";

    console.log("📝 Editing item:", item);
    console.log("Formatted dates:", {
      expiredDate: formattedExpiredDate,
      entryDate: formattedEntryDate,
      useDate: formattedUseDate
    });

    setFormData({
      itemName: item.itemName || "",
      purchasePrice: item.purchasePrice ? item.purchasePrice.toString() : "",
      expiredDate: formattedExpiredDate,
      entryDate: formattedEntryDate,
      supplierName: item.supplierName || "",
      useDate: formattedUseDate,
      imageFile: null,
      currentImageUrl: item.imageUrl || null,
    });
    setIsModalOpen(true);
  };  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      itemName: "",
      purchasePrice: "",
      expiredDate: "",
      entryDate: new Date().toISOString().split("T")[0], // Reset to today's date
      supplierName: "",
      useDate: "",
      imageFile: null,
    });
  };

  return {
    isModalOpen,
    editingItem,
    formData,
    setIsModalOpen,
    handleEdit,
    handleCloseModal,
    handleInputChange,
  };
};