// src/components/CommentCard.jsx
import React from 'react';

function CommentCard({ comment, postId }) {
    
    // Placeholder function that uses postId
    const handleReply = () => {
        // This postId would be critical for defining the context of the reply endpoint
        console.log(`Replying to comment ${comment.id} on post ${postId}`); 
        // In a real app, this would update state to show the CommentForm component with parentId set.
    };

    return (
        <div className="comment-card" key={comment.id}>
            <p className="comment-author">
                {comment.user ? comment.user.username : `User ID: ${comment.user_id}`}
            </p>
            <p className="comment-content">{comment.content}</p>
            <small>Posted: {new Date(comment.created_at).toLocaleDateString()}</small>
            
            {/* Use postId in a functional element to resolve the warning */}
            <button onClick={handleReply} className="reply-button">Reply</button> 
            {/* The actual API endpoint for a reply would look like: 
                POST /api/v1/posts/{postId}/comments 
                with { parent_id: comment.id } in the body. 
            */}
        </div>
    );
}

export default CommentCard;