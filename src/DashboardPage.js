// DashboardPage.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable'; // <-- this line important!


const PROVINCES = [
  "Central", "Eastern", "Northern", "Southern",
  "Western", "North Western", "North Central", "Uva", "Sabaragamuwa"
];

function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [subFilterValue, setSubFilterValue] = useState('');
  const [downloadProvince, setDownloadProvince] = useState('');
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('created', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
      setFilteredUsers(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!filter || (filter === 'province' && !subFilterValue) || (filter === 'area' && !subFilterValue)) {
      setFilteredUsers(users);
      return;
    }

    let result = [...users];
    switch (filter) {
      case 'province':
        result = result.filter(user => user.province === subFilterValue);
        break;
      case 'area':
        result = result.filter(user => user.area === subFilterValue);
        break;
      case 'oldest':
        result = [...users].reverse();
        break;
      case 'presence':
        result = users.filter(user => user.contact && user.contact.trim() !== '');
        break;
      default:
        result = users;
    }
    setFilteredUsers(result);
  }, [filter, subFilterValue, users]);

  const uniqueAreas = [...new Set(users.map(user => user.area).filter(Boolean))];

  const handleDownload = () => {
    if (!downloadProvince) return;
  
    const doc = new jsPDF();
    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  
    doc.setFontSize(16);
    doc.text(`User Details - ${downloadProvince} Province`, 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${formattedDate}`, 20, 28);
  
    const data = users.filter(user => user.province === downloadProvince);
  
    const tableColumn = ["#", "Name", "Contact", "Area"];
    const tableRows = [];
  
    data.forEach((user, index) => {
      const userData = [
        index + 1,
        user.name || "N/A",
        user.contact || "N/A",
        user.area || "N/A"
      ];
      tableRows.push(userData);
    });
  
    autoTable(doc, {     // <-- THIS
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [0, 100, 0] },
      margin: { top: 30 }
    });
  
    doc.save(`Province_${downloadProvince}_Users.pdf`);
  };
  return (
    <div style={{ backgroundColor: '#8CC63F', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '24px' }}>Real-Time Dashboard</h2>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select onChange={(e) => setFilter(e.target.value)} value={filter} style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '14px', backgroundColor: '#ffffff', border: '1px solid #ccc', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            <option value="">-- Select Filter --</option>
            <option value="province">Filter by Province</option>
            <option value="area">Filter by Area</option>
            <option value="oldest">Oldest to Latest</option>
            <option value="latest">Latest to Oldest</option>
            <option value="presence">Has Contact</option>
          </select>

          {filter === 'province' && (
            <select onChange={(e) => setSubFilterValue(e.target.value)} value={subFilterValue} style={{ padding: '6px', borderRadius: '6px', fontSize: '14px' }}>
              <option value="">-- Select Province --</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}

          {filter === 'area' && (
            <select onChange={(e) => setSubFilterValue(e.target.value)} value={subFilterValue} style={{ padding: '6px', borderRadius: '6px', fontSize: '14px' }}>
              <option value="">-- Select Area --</option>
              {uniqueAreas.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}

          <button
            style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: '#fff', fontWeight: 'light', cursor: 'pointer', border: '1px solid #ccc' }}
            onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
          >
            Download Province-wise Details
          </button>

          {showDownloadDropdown && (
            <select onChange={(e) => setDownloadProvince(e.target.value)} value={downloadProvince} style={{ padding: '6px', borderRadius: '6px', fontSize: '14px' }}>
              <option value="">-- Select Province to Download --</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}

          {downloadProvince && (
            <button
              style={{ padding: '8px 12px', backgroundColor: '#006400', color: '#fff', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
              onClick={handleDownload}
            >
              Download PDF
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredUsers.map((user, index) => (
          <div key={user.id} style={cardStyle}>
            <div style={countStyle}>#{index + 1}</div>
            <GridRow label="Name" value={user.name} />
            <GridRow label="Contact" value={user.contact} isPhone />
            <GridRow label="Province" value={user.province} />
            <GridRow label="Area" value={user.area} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GridRow({ label, value, isPhone }) {
  return (
    <div style={gridItem}>
      <strong style={labelStyle}>{label}:</strong>
      {isPhone ? (
        <a href={`tel:${value}`} style={valueStyleLink}>{value}</a>
      ) : (
        <span style={valueStyle}>{value}</span>
      )}
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  rowGap: '8px',
  columnGap: '16px',
  fontSize: '14px'
};

const gridItem = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'nowrap',
  minWidth: 0,
  overflow: 'hidden'
};

const countStyle = {
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#888',
  marginBottom: '8px',
  gridColumn: '1 / -1'
};

const labelStyle = {
  color: '#006400',
  fontWeight: '600',
  marginRight: '4px',
  whiteSpace: 'nowrap'
};

const valueStyle = {
  color: '#333',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%'
};

const valueStyleLink = {
  color: '#007bff',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%'
};

export default DashboardPage;
