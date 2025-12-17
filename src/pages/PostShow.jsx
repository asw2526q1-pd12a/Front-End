import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getPost, getPostComments } from '../services/api';
import PostCard from '../components/PostCard';
import CommentCard from '../components/CommentCard';
import CommentForm from '../components/CommentForm';
import Sorter from '../components/Sorter';

import { useUser } from '../contexts/UserContext';

function PostShow() {
    const { id } = useParams();
    const location = useLocation();
    
    // Get sort param from URL
    const queryParams = new URLSearchParams(location.search);
    const sort = queryParams.get('sort') || 'new'; // Default sort

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: currentUser } = useUser();
    const isLoggedIn = !!currentUser;
    const [replyingTo, setReplyingTo] = useState(null);

    const handleReply = (comment) => {
        setReplyingTo(comment);
        // Optional: Smooth scroll to form
        document.getElementById('reply_form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
    };

    // Callback to refresh comments after posting
    const refreshComments = async () => {
        try {
            const response = await getPostComments(id, sort);
            setComments(response.data.comments);
        } catch (err) {
            console.error("Error refreshing comments:", err);
        }
    };

    // 1. DATA FETCHING EFFECT
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const [postRes, commentsRes] = await Promise.all([
                    getPost(id),
                    getPostComments(id, sort) // Pass sort param here
                ]);
                setPost(postRes.data.post);
                setComments(commentsRes.data.comments); // Assuming structure { comments: [...] }
                setError(null);
            } catch (err) {
                console.error("Error al cargar datos:", err);
                setError("Error al cargar el post.");
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id, sort]); // Depend on sort to refetch when it changes

    // 2. RENDERING HANDLERS
    if (loading) {
        return <div className="loading">Cargando detalles del post...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!post) {
        return <div className="error">Datos del post no disponibles.</div>;
    }

    // 3. MAIN RENDER (Applying ERB structure and styles)
    return (
        <>
            <div className="main-layout">
                <div className="feed-column">
                    
                    {/* --- ORIGINAL POST MOVED TO THE TOP (Translated ERB) --- */}
                    <div 
                        className="original-post-card" 
                        style={{ marginBottom: '20px' }} // Only keep layout margin, move rest to CSS
                    >
                        <h3 className="original-post-title">Publicación original</h3>
                        <div className="user-posts">
                            {/* Replaced <%= render 'posts/post', post: @post %> with PostCard component */}
                            <PostCard post={post} /> 
                        </div>
                    </div>
                    
                    {/* Comments Header and Sorter */}
                    <div className="comments-header-flex">
                        <h2 style={{ fontSize: '2em', color: 'var(--text-color)', marginBottom: '15px' }}>
                            Comentarios ({post.comments_count})
                        </h2>
                        {/* Replaced <%= render 'shared/sorter' %> */}
                        <Sorter type="comments" /> 
                    </div>
                    
                    {/* --- COMMENTS LIST (Translated ERB) --- */}
                    {comments && comments.length > 0 ? (
                        <div className="comments-list">
                            {comments.map(comment => ( 
                                <CommentCard 
                                    key={comment.id} 
                                    comment={comment} 
                                    postId={post.id} 
                                    onReply={handleReply} 
                                    onCommentUpdated={refreshComments}
                                />
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
                <CommentForm 
                    post={post} 
                    replyingTo={replyingTo} 
                    onCancelReply={handleCancelReply}
                    onCommentPosted={refreshComments}
                /> 
            ) : (
                <div className="fixed-comment-input-container">
                    <p style={{ color: '#9ca3af', textAlign: 'center', padding: '10px 0' }}>
                        {/* Replaced link_to with <Link> */}
                        <Link to="/login" style={{ color: '#4da6ff' }}>Inicia sesión</Link> para dejar un comentario.
                    </p>
                </div>
            )}
        </>
    );
}

export default PostShow;