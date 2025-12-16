import './App.css'
import { UserProvider } from './contexts/UserContext'
import UserSelector from './components/UserSelector'
import ProfilePage from './pages/ProfilePage'
import PostShow from './pages/PostShow' // <-- 1. Import your new page

// Import React Router components
import { BrowserRouter, Routes, Route } from 'react-router-dom' // <-- 2. Import Router components


function App() {
  return (
    // The UserProvider and UserSelector stay at the very top, 
    // ensuring context is available for all routes/pages below.
    <UserProvider>
      <UserSelector /> 
      
      {/* 3. Wrap everything that will change based on the URL in <BrowserRouter> */}
      <BrowserRouter>
        <div className="app-container">
          
          {/* 4. Define the sections that change based on the path */}
          <Routes>
            
            {/* If the URL is '/', show the ProfilePage. This preserves your current functionality. */}
            <Route path="/" element={<ProfilePage />} /> 

            {/* If the URL is '/posts/1', show the PostShow page, using the dynamic :id parameter. */}
            <Route path="/posts/:id" element={<PostShow />} /> 
            
            {/* You can add more routes here: e.g., <Route path="/posts" element={<PostIndex />} /> */}

          </Routes>

        </div>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App