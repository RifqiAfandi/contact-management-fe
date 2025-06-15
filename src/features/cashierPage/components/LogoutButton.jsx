import React from 'react';
import { logout } from '../../../utils/authUtils.js';

const LogoutButton = () => {
  const handleLogout = () => {
    logout();
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
