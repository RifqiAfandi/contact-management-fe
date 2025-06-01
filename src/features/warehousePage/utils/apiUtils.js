import { BACKEND_URL } from "../constants/config";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  };

  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, config);
  
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    const result = await response.json();
    throw new Error(result.message || "API request failed");
  }

  return response.json();
};

export const handleApiError = (error) => {
  console.error("❌ API Error:", error);
  
  if (error.message === "Authentication token not found") {
    window.location.href = "/login";
    return;
  }
  
  return error.message;
};

// components/WarehousePage/utils/validationUtils.js
export const validateFormData = (formData, isEditing = false) => {
  const errors = {};

  if (!formData.itemName?.trim()) {
    errors.itemName = "Nama barang harus diisi";
  }

  if (!formData.purchasePrice || formData.purchasePrice <= 0) {
    errors.purchasePrice = "Harga beli harus lebih dari 0";
  }

  if (!formData.entryDate) {
    errors.entryDate = "Tanggal masuk harus diisi";
  }

  if (!formData.expiredDate) {
    errors.expiredDate = "Tanggal expired harus diisi";
  }

  if (formData.entryDate && formData.expiredDate) {
    const entryDate = new Date(formData.entryDate);
    const expiredDate = new Date(formData.expiredDate);
    
    if (expiredDate <= entryDate) {
      errors.expiredDate = "Tanggal expired harus setelah tanggal masuk";
    }
  }

  if (!isEditing && !formData.imageFile) {
    errors.imageFile = "Gambar barang harus diupload";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};