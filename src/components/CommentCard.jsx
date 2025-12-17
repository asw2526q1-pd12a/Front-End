// src/components/CommentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { deleteComment, updateComment } from '../services/api';
import { useState } from 'react';

function CommentCard({ comment, postId, onReply, onCommentUpdated }) {
    const { user: currentUser } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    return (
        <div className="comment-card-container">
            <div className="comment-card">
                <p className="comment-author">
                    {comment.user ? (
                        <Link to={`/users/${comment.user.id}`} className="comment-author-link" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                            {comment.user.username}
                        </Link>
                    ) : (
                        `User ID: ${comment.user_id}`
                    )}
                </p>

                {isEditing ? (
                    <form onSubmit={handleEditSubmit} className="comment-edit-form">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="comment-edit-textarea"
                            disabled={isSubmitting}
                            style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <div className="comment-actions">
                            <button type="submit" disabled={isSubmitting} className="save-button" style={{ marginRight: '10px', cursor: 'pointer', color: 'green' }}>Guardar</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="cancel-button" style={{ cursor: 'pointer', color: 'gray' }}>Cancelar</button>
                        </div>
                    </form>
                ) : (
                    <p className="comment-content">{comment.content}</p>
                )}
                
                <small>Publicado: {new Date(comment.created_at).toLocaleDateString()}</small>
                
                <div className="comment-actions-bar" style={{ marginTop: '5px', display: 'flex', gap: '15px' }}>
                    <button onClick={handleReplyClick} className="reply-button">Responder</button>
                    
                    {isOwner && !isEditing && (
                        <>
                            <button onClick={() => setIsEditing(true)} className="edit-button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '0.9em' }}>Editar</button>
                            <button onClick={handleDelete} className="delete-button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.9em' }}>Eliminar</button>
                        </>
                    )}
                </div> 
            </div>

            {/* Nested replies container */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
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