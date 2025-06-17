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

// New function to fetch all inventory items without pagination
export const fetchAllInventory = async (searchTerm = "", selectedStatus = "", sortBy = "entryDate", sortOrder = "desc") => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  // Build query parameters
  const params = new URLSearchParams({
    sortField: sortBy,
    sortOrder,
  });

  if (searchTerm) {
    params.append('itemName', searchTerm);
  }

  if (selectedStatus) {
    params.append('status', selectedStatus);
  }

  const url = `${BACKEND_URL}/api/inventory/all?${params}`;
  console.log("🔄 Fetching all inventory from:", url);
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("📡 Response status:", response.status);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    throw new Error("Failed to fetch inventory");
  }

  const result = await response.json();
  console.log("📦 API Response:", result);  if (result.isSuccess && Array.isArray(result.data)) {
    console.log("✅ All inventory items loaded without pagination:", result.data.length);
    if (selectedStatus) {
      console.log(`🔍 Filtered by status "${selectedStatus}":`, result.data.length, "items");
    }
    if (result.data.length > 0) {
      console.log("📋 Sample inventory item:", result.data[0]);
    }
    return result.data;
  } else {
    throw new Error(result.message || "Invalid response format");
  }
};

// Function to check if data exists for a specific month
export const checkMonthlyData = async (month) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  console.log(`🔍 Checking data for month: ${month}`);
  
  const response = await fetch(`${BACKEND_URL}/api/inventory/check-month?month=${month}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    throw new Error("Failed to check monthly data");
  }

  const result = await response.json();
  console.log(`📊 Monthly data check result for ${month}:`, result);
  if (result.isSuccess) {
    return result.data;
  } else {
    throw new Error(result.message || "Invalid response format");
  }
};

// Function to fetch inventory by month
export const fetchInventoryByMonth = async (month, sortBy = "entryDate", sortOrder = "desc", searchTerm = "", selectedStatus = "") => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  console.log(`🔄 Fetching inventory for month: ${month}`);
  
  const params = new URLSearchParams({
    month,
    sortField: sortBy,
    sortOrder,
  });

  if (searchTerm) {
    params.append('itemName', searchTerm);
  }

  if (selectedStatus) {
    params.append('status', selectedStatus);
  }
  
  const response = await fetch(`${BACKEND_URL}/api/inventory/by-month?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    throw new Error("Failed to fetch monthly inventory");
  }
  const result = await response.json();
  console.log(`📦 Monthly inventory result for ${month}:`, result);

  if (result.isSuccess) {
    return result.data;
  } else {
    throw new Error(result.message || "Invalid response format");
  }
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