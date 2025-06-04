import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Overview from './components/Overview/Overview';
import Navbar from './components/Navbar/Navbar';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Alarms from './components/Alarms/Alarms';

const App: React.FC = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const showAlarmUI = location.pathname === '/alarms';

  return (
    <>
      <Navbar />

      {/* Tek instance: Alarm bileşeni her zaman mount durumda */}
      <Alarms visible={showAlarmUI} />

      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f5f6fa' }}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
