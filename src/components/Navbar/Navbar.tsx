import React from 'react';
import './Navbar.css';

interface NavbarProps {
  onNavClick: (componentName: string) => void;
  activeComponent: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeComponent }) => {
  const navItems = [
    { id: 'Overview', label: '📊 Genel Bakış', icon: '📊' },
    { id: 'Alarms', label: '🔔 Alarmlar', icon: '🔔' },
    { id: 'Reports', label: '📄 Raporlar', icon: '📄' },
    { id: 'Settings', label: '⚙️ Ayarlar', icon: '⚙️' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>⚡️ Energy Dashboard</h1>
      </div>
      <div className="navbar-links">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-button ${activeComponent === item.id ? 'active' : ''}`}
            onClick={() => onNavClick(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar; 