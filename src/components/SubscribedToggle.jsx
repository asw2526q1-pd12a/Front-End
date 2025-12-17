// src/components/SubscribedToggle.jsx
import React from 'react';

export default function SubscribedToggle({ isSubscribed, onToggle }) {
    return (
        <button 
            onClick={onToggle}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '24px',
                backgroundColor: isSubscribed ? '#EEF2FF' : '#F3F4F6',
                transition: 'all 0.2s ease',
            }}
        >
            <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isSubscribed ? '#4F46E5' : '#9CA3AF',
                boxShadow: isSubscribed ? '0 0 8px rgba(79, 70, 229, 0.4)' : 'none',
                transition: 'all 0.2s'
            }} />
            
            <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: isSubscribed ? '#4F46E5' : '#4B5563',
            }}>
                {isSubscribed ? 'Suscrito' : 'Global'}
            </span>
        </button>
    );
}