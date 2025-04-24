import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

function DashboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("created", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{
      backgroundColor: '#8CC63F',
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#fff',
        fontSize: '24px'
      }}>
        Real-Time Dashboard
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {users.map((user, index) => (
  <div key={user.id} style={cardStyle}>
    <div style={countStyle}>#{index + 1}</div> {/* <-- add this */}
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
    gridColumn: '1 / -1' // span full row in grid
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
    maxWidth: '100%' // make sure it doesn't stretch
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
