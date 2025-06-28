import { useState } from "react";

export const useModal = (refreshCallback) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    sellingPrice: "",
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
    
    setFormData({
      productName: item.productName || "",
      category: item.category || "",
      sellingPrice: item.sellingPrice || "",
      imageFile: null,
    });
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      productName: "",
      category: "",
      sellingPrice: "",
      imageFile: null,
    });
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      category: "",
      sellingPrice: "",
      imageFile: null,
    });
  };

  return {
    isModalOpen,
    setIsModalOpen,
    editingItem,
    setEditingItem,
    formData,
    setFormData,
    handleInputChange,
    handleEdit,
    handleCloseModal,
    resetForm,
  };
};
