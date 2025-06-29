import { useState, useEffect } from "react";
import { message } from "antd";
import { apiRequest } from "../utils/apiUtils";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [filters, setFilters] = useState({
    name: "",
    role: undefined,
  });

  const fetchUsersList = async (params = {}) => {
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
      if (filters.name) requestParams.append("name", filters.name);
      if (filters.role) requestParams.append("role", filters.role);

      const response = await apiRequest(`/api/auth/users?${requestParams.toString()}`);

      if (response.isSuccess || response.data) {
        const newData = response.data || [];
        setUsers(newData);

        const newPagination = {
          current: params.current || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          total: response.pagination?.totalItems || 0,
        };

        setPagination(newPagination);
      }
    } catch (error) {
      setError(error.message);

      if (
        error.message.includes("404") ||
        error.message.includes("not found")
      ) {
        setUsers([]);
        setPagination((prev) => ({
          ...prev,
          current: params.current || prev.current,
          pageSize: params.pageSize || prev.pageSize,
          total: 0,
        }));
        message.info("Tidak ada pengguna yang ditemukan");
      } else {
        message.error(error.message || "Gagal memuat data pengguna");
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    await fetchUsersList({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleTableChange = (newPagination, tableFilters, sorter) => {
    const role = tableFilters.role?.[0];

    // Check if role filter changed
    const roleChanged = role !== filters.role;

    setFilters((prev) => ({
      ...prev,
      role: role,
    }));

    fetchUsersList({
      current: roleChanged ? 1 : newPagination.current,
      pageSize: newPagination.pageSize,
      sortField: sorter?.field,
      sortOrder: sorter?.order,
    });
  };

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchUsersList({ current: 1, pageSize: pagination.pageSize });
  };
  const createUser = async (userData) => {
    setLoading(true);
    try {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: userData
      });
      if (response.isSuccess) {
        message.success("Pengguna berhasil ditambahkan");
        await refreshUsers();
        return true;
      }
    } catch (error) {
      message.error(error.message || "Gagal menambahkan pengguna");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (userId, userData) => {
    try {
      const response = await apiRequest(`/api/auth/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.isSuccess) {
        message.success("Pengguna berhasil diperbarui");
        await refreshUsers();
        return true;
      }
    } catch (error) {
      message.error(error.message || "Gagal memperbarui pengguna");
      return false;
    }
  };
  const handleDelete = async (userId, userName) => {
    try {
      const response = await apiRequest(`/api/auth/users/${userId}`, {
        method: "DELETE"
      });
      if (response.isSuccess) {
        message.success("Pengguna berhasil dihapus");
        await refreshUsers();
        return true;
      }
    } catch (error) {
      message.error(error.message || "Gagal menghapus pengguna");
      return false;
    }
  };

  // Fetch users when filters change
  useEffect(() => {
    fetchUsersList();
  }, [JSON.stringify(filters)]);

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    fetchUsersList,
    handleDelete,
    refreshUsers,
    handleTableChange,
    handleSearch,
    createUser,
    handleUpdate,
  };
};
