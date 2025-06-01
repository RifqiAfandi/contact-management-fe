import React from "react";

const Header = ({ activeTab }) => {
  const getHeaderTitle = (tab) => {
    switch (tab) {
      case "CreateUser":
        return "Create User";
      case "UserList":
        return "User List";
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