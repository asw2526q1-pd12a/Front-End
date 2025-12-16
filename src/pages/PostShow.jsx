import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '../services/api';
import PostCard from '../components/PostCard'; // Assuming you saved the previous component here
import CommentCard from '../components/CommentCard'; // <-- NEW: Component for individual comments
import CommentForm from '../components/CommentForm'; // <-- NEW: Component for the sticky form
import Sorter from '../components/Sorter'; // <-- NEW: Placeholder for the sorter

// Placeholder for user context (replace with your actual context usage)
const useCurrentUser = () => ({ 
    id: 1, 
    username: 'currentuser', 
    isLoggedIn: true 
}); 

function PostShow() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUser = useCurrentUser();
    const isLoggedIn = currentUser.isLoggedIn;

    // 1. DATA FETCHING EFFECT (Same as before)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await getPost(id);
                setPost(response.data.post);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch post:", err);
                setError("Failed to load post. It might not exist or the API is down.");
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    // 2. RENDERING HANDLERS
    if (loading) {
        return <div className="loading">Loading Post Details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!post) {
        return <div className="error">Post data is unavailable.</div>;
    }

    // 3. MAIN RENDER (Applying ERB structure and styles)
    return (
        <>
            <div className="main-layout">
                <div className="feed-column">
                    
                    {/* --- ORIGINAL POST MOVED TO THE TOP (Translated ERB) --- */}
                    <div 
                        className="original-post-card" 
                        style={{ 
                            backgroundColor: '#b7cbe7ff', 
                            padding: '20px', 
                            borderRadius: '8px', 
                            border: '1px solid #374151', 
                            marginBottom: '20px' 
                        }}
                    >
                        <h3 style={{ color: '#000000', marginTop: 0 }}>Publicación original</h3>
                        <div className="user-posts">
                            {/* Replaced <%= render 'posts/post', post: @post %> with PostCard component */}
                            <PostCard post={post} /> 
                        </div>
                    </div>
                    
                    {/* Comments Header and Sorter */}
                    <div className="comments-header-flex">
                        <h2 style={{ fontSize: '2em', color: '#000000ff', marginBottom: '15px' }}>
                            Comentarios ({post.comments_count})
                        </h2>
                        {/* Replaced <%= render 'shared/sorter' %> */}
                        <Sorter /> 
                    </div>
                    
                    {/* --- COMMENTS LIST (Translated ERB) --- */}
                    {post.top_level_comments && post.top_level_comments.length > 0 ? (
                        <div className="comments-list">
                            {post.top_level_comments.map(comment => ( // <-- NEW: uses post.top_level_comments
                                <CommentCard key={comment.id} comment={comment} postId={post.id} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#393d42', marginTop: '30px', marginLeft: '420px' }}>
                            Aún no hay comentarios. Sé el primero en añadir uno!
                        </p>
                    )}

                </div> {/* END .feed-column */}
            </div> {/* END .main-layout */}

            {/* --- STICKY COMMENT FORM (Translated ERB) --- */}
            {isLoggedIn ? (
                // We'll create a dedicated component for the complex form logic
                <CommentForm post={post} /> 
            ) : (
                <div className="fixed-comment-input-container">
                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '10px 0' }}>
                        {/* Replaced link_to with <Link> */}
                        <Link to="/login" style={{ color: '#4da6ff' }}>Log in</Link> to leave a comment.
                    </p>
                </div>
            )}
        </>
    );
}

export default PostShow;