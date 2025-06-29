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
  if (error.message?.includes("Failed to fetch")) {
    return "Koneksi ke server terputus. Periksa koneksi internet Anda.";
  }

  if (error.message?.includes("401")) {
    return "Sesi Anda telah berakhir. Silakan login kembali.";
  }

  if (error.message?.includes("403")) {
    return "Anda tidak memiliki akses untuk melakukan operasi ini.";
  }

  if (error.message?.includes("404")) {
    return "Data yang dicari tidak ditemukan.";
  }

  if (error.message?.includes("500")) {
    return "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
  }

  return error.message || "Terjadi kesalahan yang tidak diketahui.";
};

// Fetch all products function
export const fetchAllProducts = async (searchTerm = "", category = "", sortBy = "createdAt", sortOrder = "desc") => {
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
    params.append("productName", searchTerm);
  }

  if (category) {
    params.append("category", category);
  }

  try {
    const response = await apiRequest(`/api/products?${params}`);
    return response.data || [];  } catch (error) {
    throw error;
  }
};
