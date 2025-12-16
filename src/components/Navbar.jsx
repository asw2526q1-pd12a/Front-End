import { Link } from 'react-router-dom';
import UserSelector from './UserSelector';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
    const { user } = useUser();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">ASW Social</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Feed</Link>
                <Link to="/communities">Communities</Link>
                <Link to="/create-post">Create Post</Link>
                {user && <Link to="/profile">Profile</Link>}
            </div>
            <div className="navbar-user">
                <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                   {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <UserSelector />
            </div>
        </nav>
    );
};

export default Navbar;
