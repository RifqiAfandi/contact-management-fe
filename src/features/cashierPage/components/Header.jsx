import React from 'react';
import { formatDateTime } from '../utils/formatUtils.js';
import { clearStorage, redirectToLogin } from '../utils/storageUtils.js';

const Header = ({ user }) => {
  const handleLogout = () => {
    clearStorage();
    redirectToLogin();
  };

  return (
    <div className="kasir-header">
      <div className="header-left">
        <div className="logo">
          <div className="logo-icon">🛒</div>
          <div className="logo-text">
            <h1>Contact Caffe & Eatery</h1>
          </div>
        </div>
      </div>
      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || "G"}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || "Guest"}</div>
            <div className="user-role">{formatDateTime()}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
