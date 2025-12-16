import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FeedPage from './pages/FeedPage';
import CommunitiesPage from './pages/CommunitiesPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfilePage from './pages/ProfilePage';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  )
}

export default App
