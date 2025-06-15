import React from 'react';
import { clearStorage, redirectToLogin } from '../utils/storageUtils.js';

const LogoutButton = () => {
  const handleLogout = () => {
    clearStorage();
    redirectToLogin();
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
