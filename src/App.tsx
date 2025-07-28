import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import Overview from './components/Overview/Overview';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Alarms from './components/Alarms/Alarms';
import Navbar from './components/Navbar/Navbar';
import './App.css';

const Main = () => {
  const [activeComponent, setActiveComponent] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Component isimlerini Türkçe'ye çeviren mapping
  const getComponentDisplayName = (componentName: string) => {
    const nameMap: Record<string, string> = {
      'Overview': 'Grafik',
      'Alarms': 'İzleme',
      'Reports': 'Raporlar',
      'Settings': 'Ayarlar'
    };
    return nameMap[componentName] || componentName;
  };

  return (
    <div className="app-container">
      <Navbar onNavClick={setActiveComponent} activeComponent={activeComponent} />
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="main-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span>Ana Sayfa</span>
              <span>/</span>
              <span>{getComponentDisplayName(activeComponent)}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="header-controls">
              <button className="header-btn">
                <span className="icon">🔍</span>
              </button>
              <button className="header-btn notification-btn">
                <span className="icon">🔔</span>
                <span className="badge">3</span>
              </button>
              <button className="header-btn">
                <span className="icon">⚙️</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-wrapper">
            <Alarms visible={activeComponent === 'Alarms'}   />
            <Overview visible={activeComponent === 'Overview'} />
            {activeComponent === 'Reports' && <Reports />}
            {activeComponent === 'Settings' && <Settings />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
