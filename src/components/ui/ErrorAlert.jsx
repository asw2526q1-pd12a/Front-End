// src/components/ui/ErrorAlert.jsx
import React from 'react';

export const ErrorAlert = ({ errors }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#B91C1C', fontSize: '13px' }}>
            {errors.map((err, idx) => <li key={idx}>{err}</li>)}
        </ul>
    </div>
  );
};