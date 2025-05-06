import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartBar, FaFileAlt, FaCog } from 'react-icons/fa';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Energy Dashboard</div>
      <div className="navbar-links">
        <NavLink to="/" className="navbar-link">
          <FaChartBar className="navbar-icon" />
          <span>Genel Bakış</span>
        </NavLink>
        <NavLink to="/reports" className="navbar-link">
          <FaFileAlt className="navbar-icon" />
          <span>Raporlar</span>
        </NavLink>
        <NavLink to="/settings" className="navbar-link">
          <FaCog className="navbar-icon" />
          <span>Ayarlar</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar; 