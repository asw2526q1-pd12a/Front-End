import './App.css'
import { UserProvider } from './contexts/UserContext'
import UserSelector from './components/UserSelector'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <UserProvider>
      <UserSelector />
      <div className="app-container">
        <ProfilePage />
      </div>
    </UserProvider>
  )
}

export default App
