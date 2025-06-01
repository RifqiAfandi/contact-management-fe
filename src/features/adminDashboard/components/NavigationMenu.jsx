import React from "react";
import { renderIcon } from "../utils/IconUtils";
import { navigationItems } from "../constants/NavigationItems";

const NavigationMenu = ({
  activeTab,
  isUserDropdownOpen,
  onTabClick,
  onToggleUserDropdown,
}) => {
  return (
    <nav className="sidebar-nav">
      <ul className="nav-list">
        {navigationItems.map((item) => (
          <li key={item.id} className="nav-item">
            {item.type === "dropdown" ? (
              <>
                <button
                  className={`nav-button ${
                    activeTab === item.id ||
                    activeTab === "CreateUser" ||
                    activeTab === "UserList"
                      ? "active"
                      : ""
                  }`}
                  onClick={onToggleUserDropdown}
                >
                  {renderIcon(item.icon)}
                  <span className="nav-text">{item.label}</span>
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
                  className={`submenu ${
                    isUserDropdownOpen ? "open" : "closed"
                  }`}
                >
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      className={`submenu-button ${
                        activeTab === subItem.id ? "active" : ""
                      }`}
                      onClick={() => onTabClick(subItem.id)}
                    >
                      {renderIcon(subItem.icon)}
                      <span>{subItem.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <button
                className={`nav-button ${
                  activeTab === item.id ? "active" : ""
                }`}
                onClick={() => onTabClick(item.id)}
              >
                {renderIcon(item.icon)}
                <span className="nav-text">{item.label}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;