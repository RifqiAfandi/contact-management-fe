import React from 'react';
import { getCurrentDateTime } from '../utils/formatUtils.js';

const UserInfo = ({ user }) => {
  return (
    <div className="user-info">
      <div className="user-avatar">
        {user?.name?.charAt(0).toUpperCase() || "G"}
      </div>
      <div className="user-details">
        <div className="user-name">{user?.name || "Guest"}</div>
        <div className="user-role">{getCurrentDateTime()}</div>
      </div>
    </div>
  );
};

export default UserInfo;
