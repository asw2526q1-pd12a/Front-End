import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FeedPage from './pages/FeedPage';
import CommunitiesPage from './pages/CommunitiesPage';
import CreateCommunityPage from './pages/CreateCommunityPage';
import CommunityPage from './pages/CommunityPage';
import CreatePostPage from './pages/CreatePostPage';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css'
import { UserProvider } from './contexts/UserContext'
import UserSelector from './components/UserSelector'
import ProfilePage from './pages/ProfilePage'
import PostShow from './pages/PostShow' // <-- 1. Import your new page
import PostEditPage from './pages/PostEditPage';
import PostNewPage from './pages/PostNewPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    // The UserProvider and UserSelector stay at the very top, 
    // ensuring context is available for all routes/pages below.
    <UserProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/communities/new" element={<CreateCommunityPage />} />
                <Route path="/c/:name" element={<CommunityPage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/" element={<ProfilePage />} /> 
                <Route path="/posts/:id" element={<PostShow />} /> 
                <Route path="/posts/:id/edit" element={<PostEditPage />} />
                <Route path="/posts/new" element={<PostNewPage />} />
                <Route path="/home" element={<HomePage />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  )
}

export default App