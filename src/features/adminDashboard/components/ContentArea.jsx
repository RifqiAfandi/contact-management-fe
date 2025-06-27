import React from "react";
import { renderIcon } from "../utils/iconUtils";
import StatsGrid from "./StatsGrid";
import StockTable from "./StockTable";
import ProductTable from "./ProductTable";
import UserTable from "./UserTable";
import CreateUserForm from "./CreateUserForm";
import FinancialReport from "./FinancialReport";
import LaporanStok from "./LaporanStok";
import LowStockNotification from "./LowStockNotification";

const ContentArea = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <div>
            <StatsGrid />
            <LowStockNotification />
          </div>
        );
      case "Laporan":
        return (
          <div>
            <h2 style={{ marginBottom: "24px" }}>📊 Laporan Keuangan</h2>
            <FinancialReport />
          </div>
        );

      case "LaporanStok":
        return (
          <div>
            <h2 style={{ marginBottom: "24px" }}>📦 Laporan Stok</h2>
            <LaporanStok />
          </div>
        );

      case "Stok":
        return (
          <div>
            <h2 style={{ marginBottom: "24px" }}>📦 Manajemen Stok</h2>
            <StockTable />
          </div>
        );

      case "Produk":
        return (
          <div>
            <h2 style={{ marginBottom: "24px" }}>📋 Manajemen Produk</h2>
            <ProductTable />
          </div>
        );
      case "CreateUser":
        return (
          <div>
            <h2 style={{ marginBottom: "24px" }}>👤 Buat User Baru</h2>
            <CreateUserForm />
          </div>
        );

      case "UserList":
        return (
          <div>
            <h2 style={{ marginBottom: "24px" }}>👥 Daftar Pengguna</h2>
            <UserTable />
          </div>
        );

      default:
        return <WelcomeCard text={`Content for ${activeTab} tab.`} />;
    }
  };

  return <div className="content-area">{renderContent()}</div>;
};

export default ContentArea;
