import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FormPage from './FormPage';
import DashboardPage from './DashboardPage';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#8CC63F', width: '100vw', overflowX: 'hidden' }}>
      {/* NavBar */}
      <nav style={navBar}>
        <div style={navLeft}>
          <img src="/elephant-logo.png" alt="Logo" style={{ height: '36px', marginRight: '10px' }} />
        </div>
        <div style={navRight}>
          <span style={navText}>දන්සල් House</span>
        </div>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

const navBar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 16px',
  backgroundColor: '#006400',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  width: '100%'
};

const navLeft = {
  display: 'flex',
  alignItems: 'center'
};

const navRight = {
  display: 'flex',
  alignItems: 'center'
};

const navText = {
  color: '#fff',
  fontSize: '16px',
  fontWeight: '500'
};

export default App;
