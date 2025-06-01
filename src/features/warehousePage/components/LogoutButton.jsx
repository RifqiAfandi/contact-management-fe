import React from "react";

const LogoutButton = ({ onLogout }) => {
  return (
    <button className="logout-btn" onClick={onLogout}>
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;