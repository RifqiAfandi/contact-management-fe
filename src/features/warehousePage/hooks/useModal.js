import { useState } from "react";

export const useModal = (refreshInventoryList) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);  const [formData, setFormData] = useState({
    itemName: "",
    purchasePrice: "",
    expiredDate: "",
    entryDate: "",
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
    }
  };
  const handleEdit = (item) => {
    setEditingItem(item);
    const formattedExpiredDate = item.expiredDate
      ? new Date(item.expiredDate).toISOString().split("T")[0]
      : "";
    const formattedEntryDate = item.entryDate
      ? new Date(item.entryDate).toISOString().split("T")[0]
      : "";
    const formattedUseDate = item.useDate
      ? new Date(item.useDate).toISOString().split("T")[0]
      : "";

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
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      itemName: "",
      purchasePrice: "",
      expiredDate: "",
      entryDate: "",
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