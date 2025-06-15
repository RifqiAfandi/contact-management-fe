import React from 'react';
import Logo from './Logo.jsx';
import UserInfo from './UserInfo.jsx';
import LogoutButton from './LogoutButton.jsx';

const Header = ({ user }) => {
  return (
    <div className="kasir-header">
      <div className="header-left">
        <Logo />
      </div>
      <div className="header-right">
        <UserInfo user={user} />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Header;
