import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { setApiKey, getCurrentUser } from '../services/api';

const UserContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);

const MOCK_USERS = [
  { id: 1, username: 'arnaaau', full_name: 'Arnau Miret', apiKey: 'b248085d65d0968c6df4384e9aa2a6fc25ccef6009acc7b1fd1c441ca86b5a5b' },
  { id: 2, username: 'NettieWelsh', full_name: 'Nettie Welsh Dev', apiKey: '31345103e3dfaa1d16f9fdbea78b9469c70241ba0cddb7dd46098cc7ba5cbcce' },
  { id: 11, username: 'nettiewelsh', full_name: 'Nettie Welsh Prod', apiKey: 'be9f7d76709421710909c3a7f2cdb2b61a075b106edab81568b00a85a65660b7' },
  { id: 4, username: 'andreu.corden', full_name: 'andreucordenm53a7a9', apiKey: 'a33591544877c7f2f1975fc489ab6926a3952474cc0d751097ccafd827169259'}
];

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    setUser(null);
    setApiKey(null);
    localStorage.removeItem('asw_api_key');
    setError(null);
  }, []);

  const login = useCallback(async (mockUser) => {
    setLoading(true);
    setError(null);
    try {
      setApiKey(mockUser.apiKey);
      localStorage.setItem('asw_api_key', mockUser.apiKey);
      
      const response = await getCurrentUser();
      // Unwrap 'user' key if present (Rails API convention)
      const userData = response.data.user || response.data;
      setUser({ ...userData, _lastRefreshed: Date.now() });
      
    } catch (err) {
      console.error("Login verification failed", err);
      // If 401, it's definitely an invalid token. For others, it might be server issue.
      // In both cases, for this "simulation", we treat it as a failed login.
      setUser(null);
      setError(err.response?.data?.error || "Authentication failed. Please check your API Key or Network.");
      setApiKey(null);
      localStorage.removeItem('asw_api_key');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData, _lastRefreshed: Date.now() }));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Load user from local storage or default to first mock user on init (optional)
  useEffect(() => {
    const storedApiKey = localStorage.getItem('asw_api_key');
    if (storedApiKey) {
      const mockUser = MOCK_USERS.find(u => u.apiKey === storedApiKey);
      if (mockUser) {
        // We attempt to verify the stored key again
        login(mockUser);
      } else {
        // Stored key doesn't match any mock user.
        // Fallback to default user to enforce "no guest mode"
        localStorage.removeItem('asw_api_key');
        login(MOCK_USERS[0]);
      }
    } else {
      // No stored key found. Remain logged out (Guest state).
      // The user must explicitly select a user to login.
      setLoading(false); 
    }
  }, [login]);

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, clearError, users: MOCK_USERS, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
