// src/components/PostCard.jsx
import React from 'react';
import { API_BASE_URL, deletePost } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Best practice for component props
import axios from 'axios';

// 1. --- PLACEHOLDER COMPONENTS & HOOKS ---
// In a real app, these would be separate, functional components/hooks
const PostSaveButton = ({ post }) => {
    // This is where you would put the API logic to save/unsave the post
    // For now, let's make this dynamic to use the variable:
    const isSaved = false; // Replace with actual state (e.g., useState or context lookup)

    return (
        <button
            className="save-button"
            onClick={() => console.log(`Save/Unsave post ${post.id}`)}
        >
            {/* USE the variable here */}
            {isSaved ? 'Unsave' : 'Save'}
        </button>
    );
};

// Assuming you have access to your current user object via context or props
import { useUser } from '../contexts/UserContext';
//import axios from 'axios';

function PostCard({ post }) {
    const { 
        id, title, content, score, comments_count, url, 
        user, community_name 
    } = post;
    const { user: currentUser } = useUser();
    const isLoggedIn = !!currentUser;

    const truncatedContent = content?.length > 150 ? content.substring(0, 150) + '...' : content;
    
    const imageThumbnailUrl = post.image_url 
        ? (post.image_url.startsWith('http') ? post.image_url : `${API_BASE_URL}${post.image_url}`)
        : null;

    const handleVote = (type) => console.log(`${type} post ${id}`);

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
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                backgroundColor: '#EFF6FF',
                width: '50px',
                flexShrink: 0,
                borderRight: '1px solid #E0E7FF'
            }}>
                <button onClick={() => handleVote('up')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                    ▲
                </button>
                <span style={{ fontWeight: '700', fontSize: '14px', margin: '5px 0', color: '#111827' }}>
                    {score}
                </span>
                <button onClick={() => handleVote('down')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                    ▼
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
