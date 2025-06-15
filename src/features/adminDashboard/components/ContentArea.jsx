import React from "react";
import { renderIcon } from "../utils/iconUtils";
import StatsGrid from "./StatsGrid";
import WelcomeCard from "./WelcomeCard";
import StockTable from "./StockTable";
import ProductTable from "./ProductTable";
import UserTable from "./UserTable";
import CreateUserForm from "./CreateUserForm";
import FinancialReport from "./FinancialReport";

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
        );      case "Laporan":
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>📊 Laporan Keuangan</h2>
            <FinancialReport />
          </div>
        );

      case "Stok":
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>📦 Manajemen Stok</h2>
            <StockTable />
          </div>
        );

      case "Produk":
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>📋 Manajemen Produk</h2>
            <ProductTable />
          </div>
        );      case "CreateUser":
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>👤 Buat User Baru</h2>
            <CreateUserForm />
          </div>
        );

      case "UserList":
        return (
          <div>
            <h2 style={{ marginBottom: '24px' }}>👥 Daftar Pengguna</h2>
            <UserTable />
          </div>
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