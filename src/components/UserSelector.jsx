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
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <label htmlFor="user-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Simulate User:</label>
      <select 
        id="user-select" 
        value={user ? user.id : -1} 
        onChange={handleUserChange}
        style={{ padding: '5px' }}
      >
        <option value={-1}>Guest (Not Logged In)</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>
            {u.username} ({u.full_name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;
