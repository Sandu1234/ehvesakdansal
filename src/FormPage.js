import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const provinces = [
  "Central", "Eastern", "Northern", "Southern",
  "Western", "North Western", "North Central", "Uva", "Sabaragamuwa"
];

const FormPage = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [province, setProvince] = useState('');
  const [area, setArea] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "users"), {
      name,
      contact,
      province,
      area,
      created: Timestamp.now()
    });
    setName('');
    setContact('');
    setProvince('');
    setArea('');
    alert("Submitted successfully!");
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        backgroundImage: `url('/vesak-banner.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
      }}
    >
      {/* Form placed at exact Y position over the background */}
      <div
        style={{
          position: 'absolute',
          top: '45%', // 👈 Adjust this value based on where the green area starts on your image
          left: '50%',
          transform: 'translate(-50%, 0)',
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '20px',
          width: '90%',
          maxWidth: '480px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#006400',
            fontSize: '22px',
            fontFamily: 'sans-serif'
          }}
        >
          User Information
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            style={inputStyle}
          />
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Contact Number"
            required
            style={inputStyle}
          />
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Area"
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontSize: '16px',
  fontFamily: 'inherit'
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#006400',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer'
};

export default FormPage;
