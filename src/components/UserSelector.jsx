import { useState } from 'react';
import { useUser } from '../contexts/UserContext';

const UserSelector = () => {
  const { user, login, logout, users, error, clearError } = useUser();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (userId) => {
    if (userId === -1) {
      logout();
    } else {
      const selectedUser = users.find(u => u.id === userId);
      if (selectedUser) {
        login(selectedUser);
      }
    }
    setIsOpen(false);
  };

  const currentUsername = user ? user.username : 'Seleccionar Usuario';

  return (
    <div className="user-selector-container custom-dropdown" style={{ position: 'relative' }}>
      <button 
        className="user-select-button" 
        onClick={() => {
          setIsOpen(!isOpen);
          if (error) clearError();
        }}
        style={error ? { borderColor: '#ef4444' } : {}}
      >
        {currentUsername}
        <span className="dropdown-arrow">▼</span>
      </button>
      
      {isOpen && (
        <ul className="custom-options-list">
          <li 
            className="custom-option" 
            onClick={() => handleSelect(-1)}
          >
            Seleccionar Usuario
          </li>
          {users.map(u => (
            <li 
              key={u.id} 
              className={`custom-option ${user && user.id === u.id ? 'selected' : ''}`}
              onClick={() => handleSelect(u.id)}
            >
              {u.username}
            </li>
          ))}
        </ul>
      )}

       {error && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '5px',
          backgroundColor: '#fee2e2',
          border: '1px solid #f87171',
          color: '#b91c1c',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap',
          zIndex: 1001,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default UserSelector;
