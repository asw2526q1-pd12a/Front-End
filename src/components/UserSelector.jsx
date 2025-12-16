import { useState } from 'react';
import { useUser } from '../contexts/UserContext';

const UserSelector = () => {
  const { user, login, logout, users } = useUser();

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
        onClick={() => setIsOpen(!isOpen)}
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
    </div>
  );
};

export default UserSelector;
