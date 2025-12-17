import React from 'react';

export const TextInput = ({ label, value, onChange, placeholder, helperText, ...props }) => (
  <div style={{ marginBottom: '25px' }}>
    <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#1F2937', marginBottom: '8px' }}>
      {label}
    </label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '85%',
        padding: '14px 16px', // Un poco más grande
        borderRadius: '8px',
        border: '1px solid #D1D5DB', // Borde más visible (contraste)
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        backgroundColor: '#fff',
        color: '#111827'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#4F46E5';
        e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#D1D5DB';
        e.target.style.boxShadow = 'none';
      }}
      {...props}
    />
    {helperText && (
      <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>
        {helperText}
      </p>
    )}
  </div>
);