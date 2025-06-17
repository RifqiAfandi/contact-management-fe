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
    // Don't close dropdown when selecting dropdown items
    if (tab !== "Users" && tab !== "UserList" && tab !== "CreateUser") {
      setIsUserDropdownOpen(false);
    }
  };
  const toggleSidebar = () => {
    const newSidebarState = !isSidebarVisible;
    setIsSidebarVisible(newSidebarState);
    
    // Close dropdown when sidebar is closed
    if (!newSidebarState) {
      setIsUserDropdownOpen(false);
    }
  };  const toggleUserDropdown = () => {
    // When sidebar is hidden, just show UserList content without dropdown
    if (!isSidebarVisible) {
      setActiveTab("UserList");
      return;
    }
    
    // When sidebar is visible, toggle dropdown normally
    const newDropdownState = !isUserDropdownOpen;
    setIsUserDropdownOpen(newDropdownState);
    
    // When opening dropdown, automatically show UserList (first item)
    if (newDropdownState) {
      setActiveTab("UserList");
    } else {
      setActiveTab("Users");
    }
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