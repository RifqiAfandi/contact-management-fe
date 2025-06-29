import React from "react";
import { renderIcon } from "../utils/iconUtils";
import StatsGrid from "./StatsGrid";
import StockTable from "./StockTable";
import ProductTable from "./ProductTable";
import UserTable from "./UserTable";
import CreateUserForm from "./CreateUserForm";
import FinancialReport from "./FinancialReport";
import StockReport from "./StockReport";
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
        );      case "LaporanKeuangan":
        return (
          <div>
            <FinancialReport />
          </div>
        );

      case "LaporanStok":
        return (
          <div>
            <StockReport />
          </div>
        );

      case "Stok":
        return (
          <div>
            <StockTable />
          </div>
        );

      case "Produk":
        return (
          <div>
            <ProductTable />
          </div>
        );
      case "CreateUser":
        return (
          <div>
            <CreateUserForm />
          </div>
        );

      case "UserList":
        return (
          <div>
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
