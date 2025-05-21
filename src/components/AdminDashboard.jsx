import React, { useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          {isSidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
        </button>
        Admin Dashboard
      </header>
      <div className="admin-body">
        {isSidebarVisible && (
          <nav className="admin-sidebar">
            <ul>
              <li className={activeTab === 'Home' ? 'active' : ''} onClick={() => handleTabClick('Home')}>Home</li>
              <li className={activeTab === 'Users' ? 'active' : ''} onClick={() => handleTabClick('Users')}>Users</li>
              <li className={activeTab === 'Settings' ? 'active' : ''} onClick={() => handleTabClick('Settings')}>Settings</li>
            </ul>
          </nav>
        )}
        <main className="admin-content">
          <h1>{activeTab}</h1>
          <p>Content for {activeTab} tab.</p>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
