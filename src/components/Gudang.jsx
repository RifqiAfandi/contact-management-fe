import React, { useState, useEffect } from "react";
import "./Gudang.css";

const WarehousePage = () => {
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

  // Mock data for demonstration
  const mockData = [
    {
      id: 1,
      itemName: "Laptop Dell XPS 13",
      purchasePrice: 15000000,
      expiredDate: "2025-12-31",
      entryDate: "2024-01-15",
      itemUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      itemName: "Mouse Wireless Logitech",
      purchasePrice: 250000,
      expiredDate: "2024-08-15",
      entryDate: "2024-02-10",
      itemUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      itemName: "Keyboard Mechanical",
      purchasePrice: 750000,
      expiredDate: "2026-03-20",
      entryDate: "2024-03-05",
      itemUrl: "https://via.placeholder.com/150",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setInventoryItems(mockData);
    setFilteredItems(mockData);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newItem = {
        id: editingItem ? editingItem.id : Date.now(),
        ...formData,
        purchasePrice: parseInt(formData.purchasePrice),
        itemUrl: formData.imageFile
          ? URL.createObjectURL(formData.imageFile)
          : "https://via.placeholder.com/150",
      };

      if (editingItem) {
        // Update existing item
        const updatedItems = inventoryItems.map((item) =>
          item.id === editingItem.id ? newItem : item
        );
        setInventoryItems(updatedItems);
      } else {
        // Add new item
        setInventoryItems((prev) => [...prev, newItem]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      purchasePrice: item.purchasePrice.toString(),
      expiredDate: item.expiredDate,
      entryDate: item.entryDate,
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const updatedItems = inventoryItems.filter((item) => item.id !== id);
        setInventoryItems(updatedItems);
      } catch (error) {
        console.error("Error deleting item:", error);
      } finally {
        setIsLoading(false);
      }
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
    };
    return <span className="icon">{icons[iconName] || "•"}</span>;
  };

  return (
    <div className="warehouse-page">
      {/* Header Section */}
      <div className="warehouse-header">
        <div className="header-content">
          <div className="header-title-section">
            <h1 className="page-title">📦 Manajemen Gudang</h1>
            <p className="page-subtitle">
              Kelola inventori dan stok barang dengan mudah
            </p>
          </div>
          <button
            className="add-button"
            onClick={() => setIsModalOpen(true)}
          >
            {renderIcon("plus")}
            Tambah Barang
          </button>
        </div>
      </div>

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
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="inventory-grid">
        {isLoading && filteredItems.length === 0 ? (
          <div className="loading-state">
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
              className="inventory-card"
            >
              <div className="card-image">
                <img
                  src={item.itemUrl}
                  alt={item.itemName}
                />
                <div
                  className={`expiry-badge ${getExpiryStatus(
                    item.expiredDate
                  )}`}
                >
                  {getExpiryStatus(item.expiredDate) === "expired" && "Expired"}
                  {getExpiryStatus(item.expiredDate) === "warning" &&
                    "Segera Expired"}
                  {getExpiryStatus(item.expiredDate) === "normal" && "Normal"}
                </div>
              </div>

              <div className="card-content">
                <h3 className="item-name">{item.itemName}</h3>
                <div className="item-details">
                  <div className="detail-row">
                    <span className="detail-label">Harga Beli:</span>
                    <span className="detail-value">
                      {formatCurrency(item.purchasePrice)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tanggal Masuk:</span>
                    <span className="detail-value">
                      {formatDate(item.entryDate)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Expired:</span>
                    <span className="detail-value">
                      {formatDate(item.expiredDate)}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
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
