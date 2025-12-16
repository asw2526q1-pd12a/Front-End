import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import UserSelector from './components/UserSelector'
import ProfilePage from './pages/ProfilePage'
import CommunitiesPage from './pages/CommunitiesPage'
import CommunityPage from './pages/CommunityPage'
import CreateCommunityPage from './pages/CreateCommunityPage'

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <UserSelector />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<CommunitiesPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/new" element={<CreateCommunityPage />} />
            <Route path="/c/:name" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
