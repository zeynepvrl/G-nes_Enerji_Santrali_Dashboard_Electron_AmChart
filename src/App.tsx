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

  return (
    <div className="app-container">
      <Navbar onNavClick={setActiveComponent} activeComponent={activeComponent} />
      <main className="content-area">
        <Alarms visible={activeComponent === 'Alarms'} />

        <div style={{ display: activeComponent !== 'Alarms' ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
          {activeComponent === 'Overview' && <Overview />}
          {activeComponent === 'Reports' && <Reports />}
          {activeComponent === 'Settings' && <Settings />}
        </div>
      </main>
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
