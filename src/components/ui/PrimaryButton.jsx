import React from 'react';

export const PrimaryButton = ({ children, ...props }) => (
    <button
        style={{
            width: '100%',
            backgroundColor: '#111827', // Negro/Gris muy oscuro
            color: '#fff',
            fontWeight: '700',
            padding: '16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.2s, transform 0.1s',
            marginTop: '10px'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#000'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#111827'}
        onMouseDown={(e) => e.target.style.transform = 'scale(0.99)'}
        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        {...props}
    >
        {children}
    </button>
);