import React from "react";
import { renderIcon } from "../utils/iconUtils";
import StatsGrid from "./StatsGrid";
import WelcomeCard from "./WelcomeCard";
import StockTable from "./StockTable";

const ContentArea = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <div>
            <StatsGrid />
            <WelcomeCard
              title="Selamat Datang di Admin Dashboard"
              text="Kelola sistem Anda dengan mudah melalui dashboard ini. Gunakan menu di sebelah kiri untuk navigasi ke berbagai fitur yang tersedia."
            />
          </div>
        );

      case "Laporan":
        return (
          <WelcomeCard
            title="📊 Manajemen Laporan"
            text="Kelola dan lihat laporan sistem di sini."
          />
        );      case "Stok":
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>📦 Manajemen Stok</h2>
            <StockTable />
          </div>
        );

      case "Produk":
        return (
          <WelcomeCard
            title="📋 Manajemen Produk"
            text="Kelola produk dan katalog di sini."
          />
        );

      case "CreateUser":
        return (
          <WelcomeCard
            title="👤 Buat User Baru"
            text="Form untuk membuat user baru akan ditampilkan di sini."
          />
        );

      case "UserList":
        return (
          <WelcomeCard
            title="👥 Daftar User"
            text="Daftar semua user sistem akan ditampilkan di sini."
          />
        );

      case "Settings":
        return (
          <WelcomeCard
            title="⚙️ Pengaturan"
            text="Kelola pengaturan sistem di sini."
          />
        );

      default:
        return (
          <WelcomeCard text={`Content for ${activeTab} tab.`} />
        );
    }
  };

  return <div className="content-area">{renderContent()}</div>;
};

export default ContentArea;