import React, { useState, useEffect, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye
} from 'lucide-react';
import './Gudang.css';

const InventoryManagement = () => {
  const [inventories, setInventories] = useState([
    {
      id: 1,
      itemName: "Laptop ASUS ROG",
      itemUrl: "https://example.com/laptop.jpg",
      purchasePrice: 15000000,
      expiredDate: "2025-12-31",
      entryDate: "2024-01-15",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15"
    },
    {
      id: 2,
      itemName: "Mouse Logitech MX",
      itemUrl: "https://example.com/mouse.jpg",
      purchasePrice: 850000,
      expiredDate: "2026-06-30",
      entryDate: "2024-02-10",
      createdAt: "2024-02-10",
      updatedAt: "2024-02-10"
    },
    {
      id: 3,
      itemName: "Keyboard Mechanical",
      itemUrl: "https://example.com/keyboard.jpg",
      purchasePrice: 1200000,
      expiredDate: "2025-08-15",
      entryDate: "2024-01-20",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    itemUrl: '',
    purchasePrice: '',
    expiredDate: '',
    entryDate: ''
  });

  // Debounce search input
  useEffect(() => {
    const handler = debounce(() => setDebouncedSearchTerm(searchTerm), 300);
    handler();
    return () => handler.cancel();
  }, [searchTerm]);

  const filteredInventories = useMemo(() => {
    return inventories.filter(item =>
      item.itemName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [inventories, debouncedSearchTerm]);

  const totalValue = useMemo(() => {
    return inventories.reduce((sum, item) => sum + item.purchasePrice, 0);
  }, [inventories]);

  const expiringSoon = useMemo(() => {
    return inventories.filter(item => {
      const status = getExpiryStatus(item.expiredDate);
      return status.status === 'warning' || status.status === 'expired';
    }).length;
  }, [inventories]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExpiryStatus = (expiredDate) => {
    const today = new Date();
    const expiry = new Date(expiredDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'expired', text: 'Kadaluarsa', class: 'status-expired' };
    if (diffDays <= 30) return { status: 'warning', text: `${diffDays} hari lagi`, class: 'status-warning' };
    return { status: 'good', text: 'Normal', class: 'status-good' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      setInventories(inventories.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData, updatedAt: new Date().toISOString() }
          : item
      ));
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
        purchasePrice: parseInt(formData.purchasePrice),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setInventories([...inventories, newItem]);
    }

    setShowModal(false);
    setEditingItem(null);
    setFormData({
      itemName: '',
      itemUrl: '',
      purchasePrice: '',
      expiredDate: '',
      entryDate: ''
    });
  };

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      itemUrl: item.itemUrl,
      purchasePrice: item.purchasePrice.toString(),
      expiredDate: item.expiredDate,
      entryDate: item.entryDate
    });
    setShowModal(true);
  }, []);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      setInventories(prevInventories => prevInventories.filter(item => item.id !== id));
    }
  }, []);

  const TableRow = React.memo(({ item }) => {
    const expiryStatus = getExpiryStatus(item.expiredDate);
    return (
      <tr key={item.id}>
        <td>#{item.id}</td>
        <td>
          <div className="item-image">
            <img 
              src={item.itemUrl || '/api/placeholder/60/60'} 
              alt={item.itemName}
              loading="lazy" // Lazy load images
              onError={(e) => {
                e.target.src = '/api/placeholder/60/60';
              }}
            />
          </div>
        </td>
        <td className="item-name">{item.itemName}</td>
        <td className="price">{formatCurrency(item.purchasePrice)}</td>
        <td>{formatDate(item.entryDate)}</td>
        <td>{formatDate(item.expiredDate)}</td>
        <td>
          <span className={`status ${expiryStatus.class}`}>
            {expiryStatus.text}
          </span>
        </td>
        <td>
          <div className="action-buttons">
            <button 
              className="btn-action view"
              title="Lihat Detail"
            >
              <Eye size={16} />
            </button>
            <button 
              className="btn-action edit"
              onClick={() => handleEdit(item)}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button 
              className="btn-action delete"
              onClick={() => handleDelete(item.id)}
              title="Hapus"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  });

  if (!inventories.length) {
    return <div className="empty-state">Tidak ada item tersedia di inventaris.</div>;
  }

  return (
    <div className="inventory-container">
      <div className="header">
        <div className="header-content">
          <div className="header-text">
            <h1><Package className="header-icon" />Manajemen Stok Inventory</h1>
            <p>Kelola dan pantau stok barang dengan mudah dan efisien</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} />
            Tambah Item
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <Package size={32} />
          </div>
          <div className="stat-info">
            <h3>{inventories.length}</h3>
            <p>Total Item</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon value">
            <DollarSign size={32} />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(totalValue)}</h3>
            <p>Total Nilai</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <AlertTriangle size={32} />
          </div>
          <div className="stat-info">
            <h3>{expiringSoon}</h3>
            <p>Segera Kadaluarsa</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon trend">
            <TrendingUp size={32} />
          </div>
          <div className="stat-info">
            <h3>+12%</h3>
            <p>Pertumbuhan Bulan Ini</p>
          </div>
        </div>
      </div>

      <div className="inventory-table-container">
        <div className="table-header">
          <div className="search-filter">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Cari nama item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-btn">
              <Filter size={20} />
              Filter
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Gambar</th>
                <th>Nama Item</th>
                <th>Harga Beli</th>
                <th>Tanggal Masuk</th>
                <th>Tanggal Kadaluarsa</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventories.length > 0 ? (
                filteredInventories.map((item) => (
                  <TableRow key={item.id} item={item} />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    Tidak ada data inventaris yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Item' : 'Tambah Item Baru'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  setFormData({
                    itemName: '',
                    itemUrl: '',
                    purchasePrice: '',
                    expiredDate: '',
                    entryDate: ''
                  });
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Nama Item</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>URL Gambar</label>
                <input
                  type="url"
                  value={formData.itemUrl}
                  onChange={(e) => setFormData({...formData, itemUrl: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Harga Beli (IDR)</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal Masuk</label>
                  <input
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) => setFormData({...formData, entryDate: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tanggal Kadaluarsa</label>
                  <input
                    type="date"
                    value={formData.expiredDate}
                    onChange={(e) => setFormData({...formData, expiredDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;