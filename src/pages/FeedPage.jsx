import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// Assuming these components exist in your components directory
import PostCard from '../components/PostCard'; 
import Sorter from '../components/Sorter'; 

// Assuming you have a user context (like the one we hardcoded)
const useCurrentUser = () => {
    // Replace with actual hook:
    // const { currentUser } = useUser(); return currentUser;
    return { id: 1, username: 'currentuser', isLoggedIn: true }; 
};

function HomePage() {
    const currentUser = useCurrentUser();
    const isLoggedIn = currentUser?.isLoggedIn;
    
    // Hooks for URL management
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('query') || '';
    const initialSubscribedStatus = queryParams.get('subscribed') === 'true'; // Convert to boolean

    // State for data
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for search input (controlled field)
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    // 1. DATA FETCHING (Runs when URL parameters change)
    useEffect(() => {
        const fetchFeed = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get('/api/v1/posts', {
                    params: Object.fromEntries(new URLSearchParams(location.search)),
                });
                // Assuming API returns an array of posts or { posts: [...] }
                setPosts(response.data.posts || response.data); 
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError("No se pudieron cargar las publicaciones.");
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
        // The dependency array ensures data refreshes whenever the URL changes
    }, [location.search]); 
    
    
    // 2. HANDLERS

    // Handler for the Search input field change
    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handler for Search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        
        const newParams = new URLSearchParams(location.search);
        
        // Update the query parameter, removing it if the input is empty
        if (searchQuery) {
            newParams.set('query', searchQuery);
        } else {
            newParams.delete('query');
        }

        // Navigate to the new URL, triggering the useEffect hook
        navigate(`${location.pathname}?${newParams.toString()}`);
    };

    // Handler for the Subscribed toggle switch
    const handleSubscribedToggle = () => {
        const newStatus = !initialSubscribedStatus;
        
        const newParams = new URLSearchParams(location.search);
        
        if (newStatus) {
            newParams.set('subscribed', 'true');
        } else {
            newParams.delete('subscribed');
        }

        // Navigate to the new URL, triggering the useEffect hook
        navigate(`${location.pathname}?${newParams.toString()}`);
    };
    
    const isSearchActive = initialQuery.length > 0;

    return (
        <main className="main-layout">
            
            <div className="feed-column">
                
                {/* -------------------- 1. HEADER & SEARCH -------------------- */}
                <div className="feed-header-search">
                    
                    {/* View Toggles (Simplified: Only showing Posts view) */}
                    <div className="view-toggles">
                        <Link to={location.pathname + location.search} className="view-toggle-btn active-view">
                            Publicaciones
                        </Link>
                        
                        {/* Optionally add the Comments link, but it won't load data yet */}
                        {/* <Link to={location.pathname + '?view=comments'} className="view-toggle-btn">
                            Comentarios 
                        </Link> */}
                        
                        {/* Display search results title if a query is active */}
                        {isSearchActive && (
                            <h2 style={{ color: '#252627ff', fontSize: '20px', marginLeft: '20px' }}>
                                Resultados para "{initialQuery}"
                            </h2>
                        )}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <div className="search-input-wrapper">
                            <input 
                                type="text"
                                name="query" 
                                placeholder="Buscar publicación . . ." 
                                className="search-input"
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                            />
                        </div>
                    </form>
                </div>

                {/* -------------------- 2. SORTER & TOGGLE BAR -------------------- */}
                <div className="feed-sorter-bar">
                    
                    {/* Render the Sorter component (Assumes it handles its own URL logic) */}
                    <Sorter /> 

                    {/* Subscribed Toggle (Replaces Rails logic) */}
                    {isLoggedIn && (
                        <div className="d-flex align-items-center">
                            <span className="me-3 fw-bold" style={{ color: '#252627ff' }}>Suscrito</span>
                            <button onClick={handleSubscribedToggle} className="btn p-0" style={{ background: 'none', border: 'none' }}>
                                <div className="form-check form-switch m-0">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        role="switch" 
                                        id="postToggle" 
                                        checked={initialSubscribedStatus}
                                        readOnly // Handled by button onClick
                                    />
                                    <label className="form-check-label visually-hidden" htmlFor="postToggle">Suscrito</label>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* -------------------- 3. POST FEED RENDERING -------------------- */}
                {loading ? (
                    <div className="post-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Cargando publicaciones...</p>
                    </div>
                ) : error ? (
                    <div className="post-card" style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
                        <p>{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="post-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <p>No hay publicaciones. ¡Crea la primera!</p>
                    </div>
                ) : (
                    <>
                        {isSearchActive && <h3 className="search-results-header">Publicaciones</h3>}
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </>
                )}
            </div>
        </main>
    );
}

export default HomePage;