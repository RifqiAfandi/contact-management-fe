import React, { useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab !== "Users") {
      setIsUserDropdownOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setActiveTab("Users");
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const renderIcon = (iconName) => {
    const icons = {
      home: "🏠",
      report: "📊",
      stock: "📦",
      product: "📋",
      users: "👥",
      userPlus: "👤",
      settings: "⚙️",
      logout: "🚪",
      menu: "☰",
      close: "✕",
      chevronRight: "▶",
      chevronDown: "▼",
    };
    return <span className="nav-icon">{icons[iconName] || "•"}</span>;
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Total Users</div>
                    <div className="card-value">1,234</div>
                  </div>
                  <div className="card-icon icon-blue">
                    {renderIcon("users")}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Total Produk</div>
                    <div className="card-value">567</div>
                  </div>
                  <div className="card-icon icon-green">
                    {renderIcon("product")}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Stok Tersedia</div>
                    <div className="card-value">12,890</div>
                  </div>
                  <div className="card-icon icon-orange">
                    {renderIcon("stock")}
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Laporan Hari Ini</div>
                    <div className="card-value">45</div>
                  </div>
                  <div className="card-icon icon-purple">
                    {renderIcon("report")}
                  </div>
                </div>
              </div>
            </div>

            <div className="welcome-card">
              <h3 className="welcome-title">
                Selamat Datang di Admin Dashboard
              </h3>
              <p className="welcome-text">
                Kelola sistem Anda dengan mudah melalui dashboard ini. Gunakan
                menu di sebelah kiri untuk navigasi ke berbagai fitur yang
                tersedia.
              </p>
            </div>
          </div>
        );

      case "Laporan":
        return (
          <div className="welcome-card">
            <h2 className="welcome-title">📊 Manajemen Laporan</h2>
            <p className="welcome-text">
              Kelola dan lihat laporan sistem di sini.
            </p>
          </div>
        );

      case "Stok":
        return (
          <div className="welcome-card">
            <h2 className="welcome-title">📦 Manajemen Stok</h2>
            <p className="welcome-text">
              Kelola stok barang dan inventori di sini.
            </p>
          </div>
        );

      case "Produk":
        return (
          <div className="welcome-card">
            <h2 className="welcome-title">📋 Manajemen Produk</h2>
            <p className="welcome-text">Kelola produk dan katalog di sini.</p>
          </div>
        );

      case "CreateUser":
        return (
          <div className="welcome-card">
            <h2 className="welcome-title">👤 Buat User Baru</h2>
            <p className="welcome-text">
              Form untuk membuat user baru akan ditampilkan di sini.
            </p>
          </div>
        );

      case "UserList":
        return (
          <div className="welcome-card">
            <h2 className="welcome-title">👥 Daftar User</h2>
            <p className="welcome-text">
              Daftar semua user sistem akan ditampilkan di sini.
            </p>
          </div>
        );

      case "Settings":
        return (
          <div className="welcome-card">
            <h2 className="welcome-title">⚙️ Pengaturan</h2>
            <p className="welcome-text">Kelola pengaturan sistem di sini.</p>
          </div>
        );

      default:
        return (
          <div className="welcome-card">
            <p className="welcome-text">Content for {activeTab} tab.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${isSidebarVisible ? "visible" : "hidden"}`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button
            className="toggle-btn"
            onClick={toggleSidebar}
          >
            {renderIcon(isSidebarVisible ? "close" : "menu")}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <button
                className={`nav-button ${activeTab === "Home" ? "active" : ""}`}
                onClick={() => handleTabClick("Home")}
              >
                {renderIcon("home")}
                <span className="nav-text">Home</span>
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-button ${
                  activeTab === "Laporan" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Laporan")}
              >
                {renderIcon("report")}
                <span className="nav-text">Laporan</span>
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-button ${activeTab === "Stok" ? "active" : ""}`}
                onClick={() => handleTabClick("Stok")}
              >
                {renderIcon("stock")}
                <span className="nav-text">Stok</span>
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-button ${
                  activeTab === "Produk" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Produk")}
              >
                {renderIcon("product")}
                <span className="nav-text">Produk</span>
              </button>
            </li>

            <li className="nav-item">
              <button
                className={`nav-button ${
                  activeTab === "Users" ||
                  activeTab === "CreateUser" ||
                  activeTab === "UserList"
                    ? "active"
                    : ""
                }`}
                onClick={toggleUserDropdown}
              >
                {renderIcon("users")}
                <span className="nav-text">Users</span>
                <span
                  className={`dropdown-icon ${
                    isUserDropdownOpen ? "open" : ""
                  }`}
                >
                  {renderIcon(
                    isUserDropdownOpen ? "chevronDown" : "chevronRight"
                  )}
                </span>
              </button>

              {/* Dropdown Submenu */}
              <div
                className={`submenu ${isUserDropdownOpen ? "open" : "closed"}`}
              >
                <button
                  className={`submenu-button ${
                    activeTab === "CreateUser" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("CreateUser")}
                >
                  {renderIcon("userPlus")}
                  <span>Create User</span>
                </button>
                <button
                  className={`submenu-button ${
                    activeTab === "UserList" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("UserList")}
                >
                  {renderIcon("users")}
                  <span>User List</span>
                </button>
              </div>
            </li>

            <li className="nav-item">
              <button
                className={`nav-button ${
                  activeTab === "Settings" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Settings")}
              >
                {renderIcon("settings")}
                <span className="nav-text">Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="logout-section">
          <button
            className="logout-button"
            onClick={handleLogout}
          >
            {renderIcon("logout")}
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="header-content">
            <h1 className="header-title">
              {activeTab === "CreateUser"
                ? "Create User"
                : activeTab === "UserList"
                ? "User List"
                : activeTab}
            </h1>
            <div className="user-info">
              <span>Welcome, Admin</span>
              <div className="user-avatar">A</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">{renderContent()}</div>
      </main>
    </div>
  );
};

export default AdminDashboard;
