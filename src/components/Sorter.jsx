// src/components/Sorter.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const POST_OPTIONS = {
    new: 'Más reciente',
    old: 'Más antiguo',
    score: 'Top',
    comments: 'Polémico'
};

const COMMENT_OPTIONS = {
    new: 'Más reciente',
    old: 'Más antiguo',
    top: 'Top'
};

function Sorter({ type = 'posts' }) {
    const location = useLocation();
    const navigate = useNavigate();
    
    const SORT_OPTIONS = type === 'comments' ? COMMENT_OPTIONS : POST_OPTIONS;
    const queryParams = new URLSearchParams(location.search);
    const currentSort = queryParams.get('sort') || 'new';

    const handleSortChange = (newSortKey) => {
        queryParams.set('sort', newSortKey);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };

    return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.entries(SORT_OPTIONS).map(([key, label]) => {
                const isActive = currentSort === key;
                return (
                    <button
                        key={key}
                        onClick={() => handleSortChange(key)}
                        style={{
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            // Estilo condicional: Botón blanco con sombra si activo, transparente si no
                            backgroundColor: isActive ? '#ffffff' : 'transparent',
                            color: isActive ? '#111827' : '#6B7280',
                            boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

export default Sorter;