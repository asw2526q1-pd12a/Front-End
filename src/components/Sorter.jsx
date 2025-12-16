// src/components/Sorter.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sorter.css'; // <-- Import the styles

// Define the available sorting options (equivalent to Rails @sort_options)
const SORT_OPTIONS = {
    new: 'Más reciente',
    score: 'Puntuación',
    comments: 'Más comentarios'
};

function Sorter() {
    const [isOpen, setIsOpen] = useState(false);
    
    // Hooks for managing URL state (React Router DOM)
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get the current sort order from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const currentSortKey = queryParams.get('sort') || 'new'; // Default to 'new'

    const currentSortText = SORT_OPTIONS[currentSortKey] || 'Ordenar';

    // Ref to detect clicks outside the dropdown
    const sorterRef = useRef(null);

    // Function to handle clicks outside the sorter container
    useEffect(() => {
        function handleClickOutside(event) {
            if (sorterRef.current && !sorterRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sorterRef]);


    // Function to handle a sorting option click (Replaces link_to helper)
    const handleSortChange = (newSortKey) => {
        // 1. Update the URLSearchParams object
        queryParams.set('sort', newSortKey);

        // 2. Navigate to the new URL, triggering data fetch in parent components
        navigate(`${location.pathname}?${queryParams.toString()}`);
        
        // 3. Close the dropdown
        setIsOpen(false);
    };

    return (
        // Add 'open' class dynamically to control CSS visibility
        <div 
            className={`sorter-container ${isOpen ? 'open' : ''}`} 
            ref={sorterRef}
        >
            <div className="user-menu-container" style={{ marginBottom: 0 }}>
                
                {/* Button toggles the dropdown state */}
                <button 
                    className="btn-dropdown-toggle" 
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Ordenar: {currentSortText}
                </button>
                
                {/* Dropdown Menu */}
                <ul className="dropdown-menu">
                    {/* Map through the defined sorting options (Replaces @sort_options.each) */}
                    {Object.entries(SORT_OPTIONS).map(([key, text]) => (
                        <li key={key}>
                            {/* Replaced link_to with a button/anchor calling the handler */}
                            <a 
                                onClick={() => handleSortChange(key)}
                                // Add 'active-sort' class dynamically
                                className={`dropdown-item ${currentSortKey === key ? 'active-sort' : ''}`}
                            >
                                {text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Sorter;