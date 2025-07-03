import React from "react";
import { renderIcon } from "../utils/IconUtils";
import NavigationMenu from "./NavigationMenu";

const Sidebar = ({
  activeTab,
  isSidebarVisible,
  isUserDropdownOpen,
  onTabClick,
  onToggleSidebar,
  onToggleUserDropdown,
  onLogout,
}) => {
  return (
    <aside
      className={`admin-sidebar ${isSidebarVisible ? "visible" : "hidden"}`}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h2>Contact Coffee</h2>
        <button className="toggle-btn" onClick={onToggleSidebar}>
          {renderIcon(isSidebarVisible ? "close" : "menu")}
        </button>
      </div>

      <NavigationMenu
        activeTab={activeTab}
        isUserDropdownOpen={isUserDropdownOpen}
        onTabClick={onTabClick}
        onToggleUserDropdown={onToggleUserDropdown}
      />

      {/* Logout Section */}
      <div className="logout-section">
        <button className="logout-button" onClick={onLogout}>
          {renderIcon("logout")}
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
