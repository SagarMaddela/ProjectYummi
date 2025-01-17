// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        onClick={toggleSidebar} 
        className="sidebar-toggle" 
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          background: '#333',
          color: '#fff',
          border: 'none',
          padding: '10px',
          cursor: 'pointer',
        }}
      >
        ☰
      </button>
      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/analytics">Analytics</Link>
          </li>
          <li>
            <Link to="/admin/orders">Orders</Link>
          </li>
          <li>
            <Link to="/admin/restaurants">Restaurants</Link>
          </li>
          <li>
            <Link to="/admin/users">Users</Link>
          </li>
          <li>
            <Link to="/admin/settings">Settings</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
