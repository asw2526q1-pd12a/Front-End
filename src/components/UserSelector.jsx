import { useUser } from '../contexts/UserContext';

const UserSelector = () => {
  const { user, login, logout, users } = useUser();

  const handleUserChange = (e) => {
    const userId = parseInt(e.target.value);
    if (userId === -1) {
      logout();
    } else {
      const selectedUser = users.find(u => u.id === userId);
      if (selectedUser) {
        login(selectedUser);
      }
    }
  };

  return (
    <div className="user-selector-container">
      <select 
        id="user-select" 
        value={user ? user.id : -1} 
        onChange={handleUserChange}
        className="user-select-dropdown"
      >
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.username}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;
