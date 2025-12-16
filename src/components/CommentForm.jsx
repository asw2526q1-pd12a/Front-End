// src/components/CommentForm.jsx
import React, { useState } from 'react';
import { createComment } from '../services/api';

function CommentForm({ post, parentId = null }) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // --- Logic for replying to a specific user (Translates ERB logic) ---
    // If parentId is present, you'd fetch the parent comment's user here.
    const replyingToUser = parentId ? "Some User" : null; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);

        const commentData = {
            post_id: post.id,
            parent_id: parentId, // Will be null for top-level comments
            content: content
        };

        try {
            // Note the endpoint: /api/v1/posts/:post_id/comments
            const response = await createComment(post.id, { comment: commentData });
            
            console.log("Comment posted successfully:", response.data);
            setContent(''); // Clear the form
            // TODO: Ideally, you would refresh the post state to show the new comment

        } catch (error) {
            console.error("Error posting comment:", error.response?.data || error.message);
            alert("Failed to post comment.");

        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- Render the Fixed Comment Input (Translated ERB) ---
    return (
        <div className="fixed-comment-input-container" id="reply_form">
            <div className="fixed-comment-input-content">
                
                <form onSubmit={handleSubmit} className="comment-form fixed-form">
                    
                    {replyingToUser && (
                        <p style={{ color: '#202124ff', marginBottom: '5px' }}>
                            Respondiendo a {replyingToUser}:
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                        <textarea
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="En que estas pensando?"
                            disabled={isSubmitting}
                            required
                            style={{ 
                                flexGrow: 1, 
                                minHeight: '40px', 
                                maxHeight: '40px', 
                                padding: '10px', 
                                border: '1px solid #374151', 
                                borderRadius: '4px', 
                                backgroundColor: '#b5bccaff', 
                                color: '#000000ff' 
                            }}
                        />

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            style={{ 
                                padding: '15px 15px', 
                                backgroundColor: isSubmitting ? '#93c5fd' : '#4da6ff', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer', 
                                fontWeight: 'bold', 
                                alignSelf: 'flex-start' 
                            }}
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CommentForm;