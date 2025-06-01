import React from "react";
import Logo from "./Logo";
import UserInfo from "./UserInfo";
import LogoutButton from "./LogoutButton";

const Header = ({ user, onLogout }) => {
  return (
    <header className="gudang-header">
      <div className="header-left">
        <Logo />
      </div>
      <div className="header-right">
        <UserInfo user={user} />
        <LogoutButton onLogout={onLogout} />
      </div>
    </header>
  );
};

export default Header;