import React, { useState } from 'react';
// src/components/PostCard.jsx
import { API_BASE_URL, deletePost } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Best practice for component props
import { upvotePost as apiUpvotePost, downvotePost as apiDownvotePost, savePost, unsavePost } from '../services/api';
import { useUser } from '../contexts/UserContext';

// 1. --- PLACEHOLDER COMPONENTS & HOOKS ---
// In a real app, these would be separate, functional components/hooks
const PostSaveButton = ({ post }) => {
    const [isSaved, setIsSaved] = useState(post.is_saved || false);
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        setIsSaved(post.is_saved || false);
    }, [post.id, post.is_saved]);

    const handleSaveToggle = async () => {
        if (loading) return;
        setLoading(true);
        try {
            if (isSaved) {
                // If already saved, call the delete/unsave endpoint
                await unsavePost(post.id);
                setIsSaved(false);
            } else {
                // If not saved, call the post/save endpoint
                await savePost(post.id);
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
            alert("No se pudo guardar/eliminar el post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            className={`save-button ${isSaved ? 'saved' : ''}`} 
            onClick={handleSaveToggle}
            disabled={loading}
            style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isSaved ? '#ff4500' : '#878a8c', // Reddit-style orange when saved
                fontWeight: isSaved ? 'bold' : 'normal',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}
        >
            <svg width="18" height="18" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isSaved ? 'Guardado' : 'Guardar'} 
        </button>
    );
};

// 2. --- POST CARD COMPONENT ---
function PostCard({ post }) {
    const { 
    id, 
    title, 
    content,
    comments_count, 
    url, 
    user, 
    user_id: destructuredUserId,
    community_name,
} = post;
    const user_id = destructuredUserId || user?.id;
    const { user: currentUser } = useUser();
    const isLoggedIn = !!currentUser;
    const [currentScore, setCurrentScore] = useState(post.score);
    const [userVoteStatus, setUserVoteStatus] = useState(post.current_user_vote);
    // --- Voting Logic Placeholders ---
    // These functions would make the API calls to upvote/downvote
    const upvotePost = async () => {
        if (!isLoggedIn) { alert("Debes iniciar sesión para votar."); return; }

        // Determine the vote value to send: 
        // If already upvoted (1), the next click is an unvote (0).
        // Otherwise, it's a standard upvote (1).
        const targetVoteValue = userVoteStatus === 1 ? 0 : 1; 

        try {
            // Note: We use the dedicated API call, which simplifies the target value handling
            // The Rails backend handles the logic based on the endpoint (/upvote or /downvote)
            const response = await apiUpvotePost(id); 
            
            if (response.data && response.data.score !== undefined) {
                setCurrentScore(response.data.score); 
                
                // 🛑 CRITICAL FIX: The Rails `handle_vote_for` determines the new vote status.
                // It should return the new vote status (0, 1, or -1) in the response data.
                // Assuming Rails returns it as `response.data.new_vote_value` or similar.
                
                // If the response contains the new vote value, use that:
                if (response.data.new_vote_value !== undefined) {
                     setUserVoteStatus(response.data.new_vote_value);
                } else {
                     // FALLBACK: Since we clicked the upvote button, the new state is 1, 
                     // unless the old state was 1 (in which case the API sets it to 0).
                     // This is less reliable than getting the value from the server.
                     setUserVoteStatus(targetVoteValue); 
                }
            }
        } catch (error) {
            console.error("Upvote failed:", error.response || error);
            alert("Error al intentar votar. Revisa la consola para más detalles.");
        }
    };

    const downvotePost = async () => {
        if (!isLoggedIn) { alert("Debes iniciar sesión para votar."); return; }

        // Determine the vote value to send: 
        // If already downvoted (-1), the next click is an unvote (0).
        // Otherwise, it's a standard downvote (-1).
        const targetVoteValue = userVoteStatus === -1 ? 0 : -1; 

        try {
            const response = await apiDownvotePost(id); 
            
            if (response.data && response.data.score !== undefined) {
                setCurrentScore(response.data.score);
                
                if (response.data.new_vote_value !== undefined) {
                     setUserVoteStatus(response.data.new_vote_value);
                } else {
                     setUserVoteStatus(targetVoteValue);
                }
            }
        } catch (error) {
            console.error("Downvote failed:", error.response || error);
            alert("Error al intentar votar. Revisa la consola para más detalles.");
        }
    };

    // --- Dynamic URL generation (JSX equivalent of Rails path helpers) ---
    const postDetailUrl = `/posts/${id}`; // Matches your router setup
    const userProfileUrl = `/users/${user_id}`; 
    const communityUrl = `/c/${community_name}`;
    const commentsUrl = `/posts/${id}/comments`; // Assuming this route exists

    // Helper for truncating content (JSX equivalent of post.content.truncate(120))
    const truncatedContent = content?.length > 150 ? content.substring(0, 150) + '...' : content;
    
    // Helper for safe URL handling
    const safeUrl = url && (url.startsWith('http') ? url : `http://${url}`);
    
    const imageThumbnailUrl = post.image_url 
        ? (post.image_url.startsWith('http') 
            ? post.image_url 
            : `${API_BASE_URL}${post.image_url}`)
        : null; 
    
    // Convert inline styles from CSS syntax to JSX (camelCase)
    const upvoteStyle = { 
        background: 'none', 
        border: 'none', 
        padding: 0, 
        color: userVoteStatus === 1 ? '#0455a7ff' : '#30353fff' 
    };
    const downvoteStyle = { 
        background: 'none', 
        border: 'none', 
        padding: 0, 
        color: userVoteStatus === -1 ? '#7e0000ff' : '#30353fff' 
    // --- NUEVA FUNCIÓN DE ELIMINAR ---
    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.")) {
            try {
                await deletePost(id);
                // Recargamos la página para reflejar el cambio (en una app real usaríamos un callback para actualizar el estado del padre)
                window.location.reload(); 
            } catch (error) {
                console.error("Error eliminando el post:", error);
                alert("Hubo un error al eliminar la publicación.");
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            backgroundColor: '#F5F8FF',
            borderRadius: '12px',
            border: '1px solid #E0E7FF',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            overflow: 'hidden',
            transition: 'box-shadow 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'}
        >
            {/* 1. Columna de Votos */}
            <div className="voting-box">
                
                {/* UPVOTE BUTTON */}
                <button 
                    onClick={upvotePost} 
                    className="vote-button upvote-button" 
                    style={upvoteStyle}
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                </button>
                
                <span className="vote-score">{currentScore}</span>
                
                {/* DOWNVOTE BUTTON */}
                <button 
                    onClick={downvotePost} 
                    className="vote-button downvote-button" 
                    style={downvoteStyle}
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </button>
            </div>

            {/* 2. Columna de Imagen */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                paddingLeft: '16px',
                paddingTop: '16px',
                paddingBottom: '16px'
            }}>
                <Link to={`/posts/${id}`} style={{ flexShrink: 0 }}>
                    <div style={{
                        width: '100px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #D1D5DB',
                        backgroundColor: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {imageThumbnailUrl ? (
                            <img 
                                src={imageThumbnailUrl} 
                                alt={title} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ color: '#9CA3AF' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            </div>
                        )}
                    </div>
                </Link>
            </div>

            {/* 3. Columna de Contenido Principal */}
            <div style={{ padding: '16px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                
                {/* Meta Header */}
                <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {community_name && (
                        <>
                            <Link to={`/c/${community_name}`} style={{ fontWeight: '700', color: '#111827', textDecoration: 'none' }}>
                                {community_name}
                            </Link>
                            <span>•</span>
                        </>
                    )}
                    <span>publicado por</span>
                    <Link to={`/users/${user?.id}`} style={{ color: '#6B7280', textDecoration: 'none' }}>
                        {user?.username}
                    </Link>
                </div>

                {/* Título y Contenido */}
                <Link to={`/posts/${id}`} style={{ textDecoration: 'none', color: '#111827' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                        {title}
                    </h3>
                </Link>
                
                {content && (
                    <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5', margin: '0 0 8px 0' }}>
                        {truncatedContent}
                    </p>
                )}
                
                {/* External Link */}
                {url && (
                    <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#3B82F6', marginBottom: '8px', display: 'inline-block', textDecoration: 'none' }}>
                        🔗 {url.replace(/(^\w+:|^)\/\//, '').substring(0, 30)}...
                    </a>
                )}

                {/* Footer de Acciones */}
                <div style={{ display: 'flex', gap: '15px', marginTop: 'auto', alignItems: 'center' }}>
                    <Link to={`/posts/${id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#6B7280', textDecoration: 'none', padding: '4px 8px', borderRadius: '4px' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#E0E7FF'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        💬 {comments_count} Comentarios
                    </Link>

                    {isLoggedIn && currentUser.id === post.user.id && (
                        <>
                            <Link to={`/posts/${id}/edit`} style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textDecoration: 'none', padding: '4px 8px' }}>
                                ✏️ Editar
                            </Link>
                            
                            {/* --- BOTÓN ELIMINAR (NUEVO) --- */}
                            <button 
                                onClick={handleDelete}
                                style={{ 
                                    fontSize: '12px', 
                                    fontWeight: '600', 
                                    color: '#EF4444', // Rojo
                                    textDecoration: 'none', 
                                    padding: '4px 8px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#FEF2F2'} // Rojo muy suave al hover
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                🗑️ Eliminar
                            </button>
                        </>
                    )}
                    
                    <button 
                        style={{ 
                            marginLeft: 'auto', 
                            display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' 
                        }} 
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#E0E7FF'} 
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        🔖 Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

PostCard.propTypes = {
    post: PropTypes.object.isRequired,
};

export default PostCard;
