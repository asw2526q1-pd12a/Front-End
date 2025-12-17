// src/components/CommentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { deleteComment, updateComment, upvoteComment, downvoteComment, saveComment, unsaveComment } from '../services/api';
import { useState, useEffect } from 'react';

function CommentCard({ comment, postId, onReply, onCommentUpdated, onUpdate }) {
    const { user: currentUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper functions for localStorage persistence
    const getVoteFromStorage = (commentId) => {
        if (!currentUser) return 0;
        const key = `vote_comment_${commentId}_user_${currentUser.id}`;
        const stored = localStorage.getItem(key);
        return stored ? parseInt(stored) : 0;
    };

    const saveVoteToStorage = (commentId, value) => {
        if (!currentUser) return;
        const key = `vote_comment_${commentId}_user_${currentUser.id}`;
        if (value === 0) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, value.toString());
        }
    };

    const getSaveFromStorage = (commentId) => {
        if (!currentUser) return false;
        const key = `save_comment_${commentId}_user_${currentUser.id}`;
        return localStorage.getItem(key) === 'true';
    };

    const saveSaveToStorage = (commentId, value) => {
        if (!currentUser) return;
        const key = `save_comment_${commentId}_user_${currentUser.id}`;
        if (value) {
            localStorage.setItem(key, 'true');
        } else {
            localStorage.removeItem(key);
        }
    };

    // Initialize state from localStorage or props (localStorage takes precedence)
    const [voteValue, setVoteValue] = useState(() => {
        const storedVote = getVoteFromStorage(comment.id);
        return storedVote !== 0 ? storedVote : (comment.user_vote_value || 0);
    });
    const [score, setScore] = useState(comment.score || 0);
    const [isSaved, setIsSaved] = useState(() => {
        const storedSave = getSaveFromStorage(comment.id);
        return storedSave || (comment.is_saved || false);
    });

    // Update state when comment data changes (after refresh)
    useEffect(() => {
        // Only update from props if localStorage doesn't have a value
        const storedVote = getVoteFromStorage(comment.id);
        if (storedVote === 0 && comment.user_vote_value !== undefined) {
            setVoteValue(comment.user_vote_value);
        }
        setScore(comment.score || 0);

        const storedSave = getSaveFromStorage(comment.id);
        if (!storedSave && comment.is_saved !== undefined) {
            setIsSaved(comment.is_saved);
        }
    }, [comment.user_vote_value, comment.score, comment.is_saved, comment.id, currentUser]);

    const isOwner = currentUser && comment.user && currentUser.id === comment.user.id;

    const handleReplyClick = () => {
        if (onReply) {
            onReply(comment);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
            try {
                await deleteComment(comment.id);
                if (onCommentUpdated) onCommentUpdated();
            } catch (error) {
                console.error("Error deleting comment:", error);
                alert("Error al eliminar el comentario.");
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editContent.trim()) return;

        setIsSubmitting(true);
        try {
            await updateComment(comment.id, { comment: { content: editContent } });
            setIsEditing(false);
            if (onCommentUpdated) onCommentUpdated();
        } catch (error) {
            console.error("Error updating comment:", error);
            alert("Error al actualizar el comentario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Voting handlers with rollback on error and localStorage persistence
    const handleUpvote = async () => {
        if (!currentUser) {
            alert("Debes iniciar sesión para votar.");
            return;
        }

        const previousVote = voteValue;
        const previousScore = score;

        let newVote, newScore;
        if (voteValue === 1) {
            newVote = 0;
            newScore = score - 1;
        } else if (voteValue === -1) {
            newVote = 1;
            newScore = score + 2;
        } else {
            newVote = 1;
            newScore = score + 1;
        }

        setVoteValue(newVote);
        setScore(newScore);
        saveVoteToStorage(comment.id, newVote);

        try {
            const response = await upvoteComment(comment.id);
            // Refresh comment data from backend
            if (onCommentUpdated) {
                setTimeout(() => onCommentUpdated(), 500);
            }
            if (onUpdate) {
                onUpdate(response.data); 
            }
        } catch (error) {
            setVoteValue(previousVote);
            setScore(previousScore);
            saveVoteToStorage(comment.id, previousVote);
            console.error("Error upvoting comment:", error);
            alert("Error al votar el comentario. Por favor, inténtalo de nuevo.");
        }
    };

    const handleDownvote = async () => {
        if (!currentUser) {
            alert("Debes iniciar sesión para votar.");
            return;
        }

        const previousVote = voteValue;
        const previousScore = score;

        let newVote, newScore;
        if (voteValue === -1) {
            newVote = 0;
            newScore = score + 1;
        } else if (voteValue === 1) {
            newVote = -1;
            newScore = score - 2;
        } else {
            newVote = -1;
            newScore = score - 1;
        }

        setVoteValue(newVote);
        setScore(newScore);
        saveVoteToStorage(comment.id, newVote);

        try {
            const response = await downvoteComment(comment.id);
            // Refresh comment data from backend
            if (onCommentUpdated) {
                setTimeout(() => onCommentUpdated(), 500);
            }
            if (onUpdate) {
                onUpdate(response.data); 
            }
        } catch (error) {
            setVoteValue(previousVote);
            setScore(previousScore);
            saveVoteToStorage(comment.id, previousVote);
            console.error("Error downvoting comment:", error);
            alert("Error al votar el comentario. Por favor, inténtalo de nuevo.");
        }
    };

    const handleToggleSave = async () => {
        if (!currentUser) {
            alert("Debes iniciar sesión para guardar comentarios.");
            return;
        }

        const previousSaved = isSaved;
        const newSaved = !isSaved;
        setIsSaved(newSaved);
        saveSaveToStorage(comment.id, newSaved);

        try {
            if (previousSaved) {
                await unsaveComment(comment.id);
            } else {
                await saveComment(comment.id);
            }
        } catch (error) {
            setIsSaved(previousSaved);
            saveSaveToStorage(comment.id, previousSaved);
            console.error("Error toggling save:", error);
            alert("Error al guardar/des-guardar el comentario. Por favor, inténtalo de nuevo.");
        }
    };

    return (
        <div className="comment-card-container" style={{ marginBottom: '12px' }}>
            <div style={{
                display: 'flex',
                backgroundColor: '#F9FAFB',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                overflow: 'hidden'
            }}>
                {/* 1. Columna de Votos a la izquierda */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '8px 6px',
                    backgroundColor: '#F3F4F6',
                    width: '48px',
                    flexShrink: 0,
                    borderRight: '1px solid #E5E7EB'
                }}>
                    <button
                        onClick={handleUpvote}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: voteValue === 1 ? '#3B82F6' : '#9CA3AF',
                            fontSize: '16px',
                            padding: '4px',
                            lineHeight: '1'
                        }}
                        title="Upvote"
                    >
                        ▲
                    </button>
                    <span style={{
                        fontWeight: '700',
                        fontSize: '13px',
                        margin: '4px 0',
                        color: '#374151'
                    }}>
                        {score}
                    </span>
                    <button
                        onClick={handleDownvote}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: voteValue === -1 ? '#EF4444' : '#9CA3AF',
                            fontSize: '16px',
                            padding: '4px',
                            lineHeight: '1'
                        }}
                        title="Downvote"
                    >
                        ▼
                    </button>
                </div>

                {/* 2. Contenido Principal del Comentario */}
                <div style={{ flex: 1, padding: '12px' }}>
                    <p className="comment-author" style={{ marginBottom: '6px' }}>
                        {comment.user ? (
                            <Link to={`/users/${comment.user.id}`} className="comment-author-link" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#111827', fontSize: '13px' }}>
                                {comment.user.username}
                            </Link>
                        ) : (
                            <span style={{ fontSize: '13px', color: '#6B7280' }}>User ID: {comment.user_id}</span>
                        )}
                        <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '8px' }}>
                            • {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                    </p>

                    {isEditing ? (
                        <form onSubmit={handleEditSubmit} className="comment-edit-form">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="comment-edit-textarea"
                                disabled={isSubmitting}
                                style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button type="submit" disabled={isSubmitting} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}>
                                    Guardar
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: '#6B7280', color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                            {comment.content}
                        </p>
                    )}

                    {/* Barra de acciones */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* Link to Post - Visible only when not in PostShow context */ }
                        {!postId && comment.post_id && (
                            <Link
                                to={`/posts/${comment.post_id}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#6B7280',
                                    textDecoration: 'none',
                                    padding: '4px 6px',
                                    borderRadius: '4px'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#E0E7FF'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                📄 Ver Post
                            </Link>
                        )}

                        {/* Reply button */}
                        <button
                            onClick={handleReplyClick}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#6B7280',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px 6px',
                                borderRadius: '4px'
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#E0E7FF'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            💬 Responder
                        </button>

                        {/* Edit/Delete buttons */}
                        {isOwner && !isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#6B7280',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px 6px',
                                        borderRadius: '4px'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#E0E7FF'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#EF4444',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '4px 6px',
                                        borderRadius: '4px'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    🗑️ Eliminar
                                </button>
                            </>
                        )}

                        {/* Save button - moved to the right */}
                        {currentUser && (
                            <button
                                onClick={handleToggleSave}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: isSaved ? '#F59E0B' : '#6B7280',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    marginLeft: 'auto'
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#FEF3C7'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                title={isSaved ? "Guardado" : "Guardar"}
                            >
                                🔖 {isSaved ? 'Guardado' : 'Guardar'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Nested replies container */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies" style={{ marginLeft: '24px', marginTop: '8px' }}>
                    {comment.replies.map(reply => (
                        <CommentCard
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            onReply={onReply}
                            onCommentUpdated={onCommentUpdated}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentCard;
