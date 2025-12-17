// src/components/ViewSwitch.jsx
import React from 'react';

export default function ViewSwitch({ currentView, onViewChange }) {
    return (
        <div style={{
            display: 'flex',
            backgroundColor: '#F3F4F6',
            borderRadius: '12px',
            padding: '4px',
            gap: '4px'
        }}>
            <button
                onClick={() => onViewChange('posts')}
                style={{
                    flex: 1,
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '22px',
                    fontWeight: '700',
                    backgroundColor: currentView === 'posts' ? '#FFFFFF' : 'transparent',
                    color: currentView === 'posts' ? '#111827' : '#6B7280',
                    boxShadow: currentView === 'posts' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                }}
            >
                Publicaciones
            </button>

            <button
                onClick={() => onViewChange('comments')}
                style={{
                    flex: 1,
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '22px',
                    fontWeight: '700',
                    backgroundColor: currentView === 'comments' ? '#FFFFFF' : 'transparent',
                    color: currentView === 'comments' ? '#111827' : '#6B7280',
                    boxShadow: currentView === 'comments' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                }}
            >
                Comentarios
            </button>
        </div>
    );
}