import React from "react";

const Header = ({ activeTab }) => {  const getHeaderTitle = (tab) => {
    switch (tab) {
      case "CreateUser":
        return "👤 Buat User Baru";
      case "UserList":
        return "👥 Daftar Pengguna";
      case "Laporan":
        return "📊 Laporan Keuangan";
      case "LaporanStok":
        return "📦 Laporan Stok";
      case "StockManagement":
        return "📦 Manajemen Stok";
      case "Produk":
        return "📋 Manajemen Produk";
      default:
        return tab;
    }
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <h1 className="header-title">{getHeaderTitle(activeTab)}</h1>
        <div className="user-info">
          <span>Welcome, Admin</span>
          <div className="user-avatar">A</div>
        </div>
      </div>
    </header>
  );
};

export default Header;