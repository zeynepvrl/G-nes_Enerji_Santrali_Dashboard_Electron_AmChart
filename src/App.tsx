import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './components/Overview/Overview';
import Navbar from './components/Navbar/Navbar';
import Reports from './components/Reports';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f5f6fa' }}>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 