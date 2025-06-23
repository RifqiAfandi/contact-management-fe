import { useState, useEffect } from "react";
import { message } from "antd";
import { apiRequest } from "../../warehousePage/utils/apiUtils";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filters, setFilters] = useState({
    productName: "",
    category: undefined,
    minPrice: null,
    maxPrice: null,
  });

  const fetchProducts = async (params = {}) => {
    console.log("🔄 Fetching products...", { params, filters, pagination });
    setLoading(true);
    setError(null);

    try {
      const requestParams = new URLSearchParams({
        page: params.current || pagination.current,
        limit: params.pageSize || pagination.pageSize,
        sortField: params.sortField || "",
        sortOrder: params.sortOrder || "",
        _t: Date.now(), // Prevent caching
      });

      // Add filters
      if (filters.productName)
        requestParams.append("productName", filters.productName);
      if (filters.category) requestParams.append("category", filters.category);
      if (filters.minPrice) requestParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) requestParams.append("maxPrice", filters.maxPrice);

      const response = await apiRequest(`/api/products?${requestParams}`);

      console.log("✅ Products fetched successfully:", response);

      if (response.isSuccess || response.data) {
        const newData = response.data || [];
        setProducts(newData);

        const newPagination = {
          current: params.current || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          total: response.pagination?.totalItems || 0,
        };

        setPagination(newPagination);
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setError(error.message);

      if (
        error.message.includes("404") ||
        error.message.includes("not found")
      ) {
        setProducts([]);
        setPagination((prev) => ({
          ...prev,
          current: params.current || prev.current,
          pageSize: params.pageSize || prev.pageSize,
          total: 0,
        }));
        message.info("Tidak ada produk yang ditemukan");
      } else {
        message.error(error.message || "Gagal memuat data produk");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    try {
      console.log("🗑️ Deleting product:", { productId, productName });

      const response = await apiRequest(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.isSuccess) {
        console.log("✅ Product deleted successfully");
        message.success("Produk berhasil dihapus");

        // Refresh the product list
        await refreshProducts();
        return true;
      }
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      message.error(error.message || "Gagal menghapus produk");
      return false;
    }
  };

  const refreshProducts = async () => {
    console.log("🔄 Refreshing products list...");
    await fetchProducts({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const category = tableFilters.category?.[0];

    // Check if category filter changed
    const categoryChanged = category !== filters.category;

    setFilters((prev) => ({
      ...prev,
      category: category,
    }));

    fetchProducts({
      current: categoryChanged ? 1 : newPagination.current,
      pageSize: newPagination.pageSize,
      sortField: sorter?.field,
      sortOrder: sorter?.order,
    });
  };

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchProducts({ current: 1, pageSize: pagination.pageSize });
  };

  const handleCreate = async (formData) => {
    try {
      console.log("➕ Creating product:", formData);

      const response = await apiRequest("/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.isSuccess) {
        console.log("✅ Product created successfully");
        message.success("Produk berhasil ditambahkan");
        await refreshProducts();
        return true;
      }
    } catch (error) {
      console.error("❌ Error creating product:", error);
      message.error(error.message || "Gagal menambahkan produk");
      return false;
    }
  };

  const handleUpdate = async (productId, formData) => {
    try {
      console.log("✏️ Updating product:", { productId, formData });

      const response = await apiRequest(`/api/products/${productId}`, {
        method: "PUT",
        body: formData,
      });

      if (response.isSuccess) {
        console.log("✅ Product updated successfully");
        message.success("Produk berhasil diperbarui");
        await refreshProducts();
        return true;
      }
    } catch (error) {
      console.error("❌ Error updating product:", error);
      message.error(error.message || "Gagal memperbarui produk");
      return false;
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return {
    products,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    fetchProducts,
    handleDelete,
    refreshProducts,
    handleTableChange,
    handleSearch,
    handleCreate,
    handleUpdate,
  };
};
