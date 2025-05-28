import React, { useState, useEffect } from "react";
import "./Gudang.css";

const BACKEND_URL = "http://localhost:3000"; // Make sure this matches your backend URL

const WarehousePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("entryDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    purchasePrice: "",
    expiredDate: "",
    entryDate: "",
    imageFile: null,
  });
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        console.log(
          "🔄 Fetching inventory from:",
          `${BACKEND_URL}/api/inventory`
        );
        const response = await fetch(`${BACKEND_URL}/api/inventory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to fetch inventory");
        }

        const result = await response.json();
        console.log("📦 API Response:", result);

        if (result.isSuccess && result.data) {
          console.log("✅ Inventory items loaded:", result.data.length);
          console.log("📋 Sample item:", result.data[0]);
          setInventoryItems(result.data);
          setFilteredItems(result.data);
        } else {
          throw new Error(result.message || "Invalid response format");
        }
      } catch (error) {
        console.error("❌ Error fetching inventory:", error);
        setError(error.message);
        if (error.message === "Authentication token not found") {
          window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, inventoryItems, sortBy, sortOrder]);

  const handleSearch = () => {
    let filtered = inventoryItems.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort items
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
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      console.log("📝 Preparing form data...");

      const formDataToSend = new FormData();
      formDataToSend.append("itemName", formData.itemName);
      formDataToSend.append("purchasePrice", formData.purchasePrice);
      formDataToSend.append("expiredDate", formData.expiredDate);
      formDataToSend.append("entryDate", formData.entryDate);

      // Get userId from localStorage
      const storedUser = localStorage.getItem("user");
      const userData = JSON.parse(storedUser);
      formDataToSend.append("userId", userData.id);

      // PERBAIKAN: Pastikan nama field konsisten dengan multer config
      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      // Debug: Log FormData contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`📋 FormData ${key}:`, value);
      }

      console.log(
        `🚀 ${editingItem ? "Updating" : "Creating"} inventory item...`
      );

      let response;
      if (editingItem) {
        response = await fetch(
          `${BACKEND_URL}/api/inventory/${editingItem.id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              // JANGAN tambahkan Content-Type untuk FormData
            },
            body: formDataToSend,
          }
        );
      } else {
        response = await fetch(`${BACKEND_URL}/api/inventory`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // JANGAN tambahkan Content-Type untuk FormData
          },
          body: formDataToSend,
        });
      }

      console.log("📡 Response status:", response.status);

      const result = await response.json();
      console.log("📦 API Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to save inventory item");
      }

      if (result.isSuccess) {
        console.log("✅ Item saved successfully");
        await refreshInventoryList();
        handleCloseModal();
      } else {
        throw new Error(result.message || "Failed to save inventory item");
      }
    } catch (error) {
      console.error("❌ Error saving item:", error);
      if (error.message === "Authentication token not found") {
        window.location.href = "/login";
        return;
      }
      setError(error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshInventoryList = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/inventory`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const result = await response.json();

      if (result.isSuccess) {
        setInventoryItems(result.data);
        setFilteredItems(result.data);
        console.log("🔄 Inventory list refreshed");
      } else {
        throw new Error("Failed to refresh inventory list");
      }
    } catch (error) {
      console.error("❌ Error refreshing inventory:", error);
      setError("Failed to refresh inventory list");
    }
  };
  const handleEdit = (item) => {
    setEditingItem(item);
    // Format dates to YYYY-MM-DD format for input fields
    const formattedExpiredDate = item.expiredDate
      ? new Date(item.expiredDate).toISOString().split("T")[0]
      : "";
    const formattedEntryDate = item.entryDate
      ? new Date(item.entryDate).toISOString().split("T")[0]
      : "";

    setFormData({
      itemName: item.itemName || "",
      purchasePrice: item.purchasePrice ? item.purchasePrice.toString() : "",
      expiredDate: formattedExpiredDate,
      entryDate: formattedEntryDate,
      imageFile: null,
      // Keep the existing image URL for preview
      currentImageUrl: item.imageUrl || null,
    });
    setIsModalOpen(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🗑️ Deleting inventory item:", id);
      const response = await fetch(`${BACKEND_URL}/api/inventory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("📡 Response status:", response.status);

      const result = await response.json();
      console.log("📦 API Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete inventory item");
      }

      if (result.isSuccess) {
        console.log("✅ Item deleted successfully");
        await refreshInventoryList();
      } else {
        throw new Error(result.message || "Failed to delete inventory item");
      }
    } catch (error) {
      console.error("❌ Error deleting item:", error);
      setError(error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      itemName: "",
      purchasePrice: "",
      expiredDate: "",
      entryDate: "",
      imageFile: null,
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const getExpiryStatus = (expiredDate) => {
    const today = new Date();
    const expiry = new Date(expiredDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";
    if (diffDays <= 30) return "warning";
    return "normal";
  };
  const renderIcon = (iconName) => {
    const icons = {
      plus: "➕",
      search: "🔍",
      sort: "🔄",
      edit: "✏️",
      delete: "🗑️",
      close: "✕",
      save: "💾",
      calendar: "📅",
      money: "💰",
      package: "📦",
      refresh: "🔄",
    };
    return <span className="icon">{icons[iconName] || "•"}</span>;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="gudang-container">
      {/* Header Section */}
      <header className="gudang-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">📦</div>
            <div className="logo-text">
              <h1>Contact Caffe & Eatery</h1>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "G"}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || "Guest"}</div>
              <div className="user-role">{getCurrentDateTime()}</div>
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <span>Logout</span>
          </button>
        </div>
      </header>
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="card-content">
            <div className="card-info">
              <h3 className="card-title">Total Barang</h3>
              <p className="card-value">{inventoryItems.length}</p>
            </div>
            <div className="card-icon icon-blue">{renderIcon("package")}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="card-content">
            <div className="card-info">
              <h3 className="card-title">Akan Expired</h3>
              <p className="card-value">
                {
                  inventoryItems.filter(
                    (item) => getExpiryStatus(item.expiredDate) === "warning"
                  ).length
                }
              </p>
            </div>
            <div className="card-icon icon-orange">
              {renderIcon("calendar")}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="card-content">
            <div className="card-info">
              <h3 className="card-title">Total Nilai</h3>
              <p className="card-value">
                {formatCurrency(
                  inventoryItems.reduce(
                    (sum, item) => sum + item.purchasePrice,
                    0
                  )
                )}
              </p>
            </div>
            <div className="card-icon icon-green">{renderIcon("money")}</div>
          </div>
        </div>
      </div>
      {/* Controls Section */}
      <div className="controls-section">
        <div className="search-box">
          {renderIcon("search")}
          <input
            type="text"
            placeholder="Cari nama barang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-controls">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="entryDate">Tanggal Masuk</option>
            <option value="expiredDate">Tanggal Expired</option>
            <option value="itemName">Nama Barang</option>
            <option value="purchasePrice">Harga Beli</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="sort-order-btn"
          >
            {renderIcon("sort")}
            {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </button>
          <button
            className="add-button"
            onClick={() => setIsModalOpen(true)}
          >
            {renderIcon("plus")}
            Tambah Barang
          </button>
        </div>
      </div>{" "}
      {/* Inventory List */}
      <div className="inventory-list">
        {error ? (
          <div className="error-state">
            <p>{error}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              {renderIcon("refresh")} Coba Lagi
            </button>
          </div>
        ) : isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Memuat data...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>Tidak ada barang yang ditemukan</p>
            <button
              className="add-button"
              onClick={() => setIsModalOpen(true)}
            >
              {renderIcon("plus")}
              Tambah Barang Pertama
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="inventory-item"
            >
              <div className="item-image">
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                />
                <div
                  className={`expiry-badge ${getExpiryStatus(
                    item.expiredDate
                  )}`}
                >
                  {getExpiryStatus(item.expiredDate) === "expired" && "Expired"}
                  {getExpiryStatus(item.expiredDate) === "warning" && "Segera"}
                  {getExpiryStatus(item.expiredDate) === "normal" && "Normal"}
                </div>
              </div>

              <div className="item-content">
                <div className="item-info">
                  <h3 className="item-name">{item.itemName}</h3>
                  <div className="item-details">
                    <div className="detail-item">
                      <span className="detail-label">Harga Beli</span>
                      <span className="detail-value">
                        {formatCurrency(item.purchasePrice)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Tanggal Masuk</span>
                      <span className="detail-value">
                        {formatDate(item.entryDate)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Expired</span>
                      <span className="detail-value">
                        {formatDate(item.expiredDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(item)}
                  >
                    {renderIcon("edit")}
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    {renderIcon("delete")}
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {" "}
            <div className="modal-header">
              <h2 className="modal-title">
                {editingItem ? "Edit Barang" : "Tambah Barang Baru"}
              </h2>
              <button
                className="close-btn"
                onClick={handleCloseModal}
              >
                {renderIcon("close")}
              </button>
            </div>
            {formData.currentImageUrl && (
              <div className="current-image-container">
                <span className="current-image-label">Gambar Saat Ini:</span>
                <div className="image-preview">
                  <img
                    src={formData.currentImageUrl}
                    alt="Current"
                  />
                </div>
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="modal-form"
            >
              <div className="form-group">
                <label
                  htmlFor="itemName"
                  className="form-label"
                >
                  Nama Barang
                </label>
                <input
                  type="text"
                  id="itemName"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="purchasePrice"
                  className="form-label"
                >
                  Harga Beli (Rp)
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label
                    htmlFor="entryDate"
                    className="form-label"
                  >
                    Tanggal Masuk
                  </label>
                  <input
                    type="date"
                    id="entryDate"
                    name="entryDate"
                    value={formData.entryDate}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="expiredDate"
                    className="form-label"
                  >
                    Tanggal Expired
                  </label>
                  <input
                    type="date"
                    id="expiredDate"
                    name="expiredDate"
                    value={formData.expiredDate}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor="imageFile"
                  className="form-label"
                >
                  Gambar Barang
                </label>
                <input
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  onChange={handleInputChange}
                  className="form-input file-input"
                  accept="image/*"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {renderIcon("save")}
                  {isLoading
                    ? "Menyimpan..."
                    : editingItem
                    ? "Update"
                    : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;
