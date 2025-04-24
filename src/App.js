import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import FormPage from './FormPage';
import DashboardPage from './DashboardPage';

function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#8CC63F', width: '100vw', overflowX: 'hidden' }}>
      {/* NavBar */}
      <nav style={navBar}>
        <div style={navLeft}>
          <img src="/elephant-logo.png" alt="Logo" style={{ height: '36px' }} />
        </div>

        <div style={hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <div style={bar}></div>
          <div style={bar}></div>
          <div style={bar}></div>
        </div>
      </nav>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div style={dropdownMenu}>
          {location.pathname !== '/dashboard' && (
            <Link to="/" style={menuLink} onClick={() => setMenuOpen(false)}>Form</Link>
          )}
          <Link to="/dashboard" style={menuLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
        </div>
      )}

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

const hamburger = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
};

const bar = {
  width: '25px',
  height: '3px',
  backgroundColor: '#fff',
  borderRadius: '2px'
};

const dropdownMenu = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '58px',
  right: '16px',
  backgroundColor: '#006400',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  padding: '10px',
  zIndex: 999
};

const menuLink = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '16px',
  padding: '8px 12px',
  borderRadius: '6px'
};

export default App;
