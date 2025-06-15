import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { logout } from "../../utils/authUtils";
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
    logout();
  };

  return (
    <div className="admin-dashboard">
      <Sidebar
        activeTab={activeTab}
        isSidebarVisible={isSidebarVisible}
        isUserDropdownOpen={isUserDropdownOpen}
        onTabClick={handleTabClick}
        onToggleSidebar={toggleSidebar}
        onToggleUserDropdown={toggleUserDropdown}
        onLogout={handleLogout}
      />
      <MainContent activeTab={activeTab} />
    </div>
  );
};

export default AdminDashboard;