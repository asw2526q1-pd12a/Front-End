import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'; // Best practice for component props

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
const useCurrentUser = () => {
    // Replace this placeholder with an actual call to your UserContext
    return { 
        id: 1, // Example ID 
        username: 'currentuser', 
        isLoggedIn: true 
    }; 
};

// 2. --- POST CARD COMPONENT ---
function PostCard({ post }) {
    // Destructure properties from the post object for cleaner code
    const { 
    id, 
    title, 
    content, 
    score, 
    comments_count, 
    url, 
    user, 
    user_id,
    community_id,    // <-- NEW FIELD
    community_name,  // <-- NEW FIELD
} = post;
    const currentUser = useCurrentUser();
    const isLoggedIn = currentUser?.isLoggedIn;
    
    // --- Voting Logic Placeholders ---
    // These functions would make the API calls to upvote/downvote
    const handleUpvote = () => console.log(`Upvoting post ${id}`);
    const handleDownvote = () => console.log(`Downvoting post ${id}`);

    // This data would typically come from the API response based on the current user's vote
    const userVoteValue = (postId) => {
    // We are using the postId variable here, even if only in a placeholder console log.
    console.log(`Placeholder: Getting vote value for post ID ${postId}`); 
    return 0; // Placeholder return value
};
    const voteValue = userVoteValue(id);

    // --- Dynamic URL generation (JSX equivalent of Rails path helpers) ---
    const postDetailUrl = `/posts/${id}`; // Matches your router setup
    const userProfileUrl = `/users/${user_id}`; 
    const communityUrl = `/communities/${community_id}`;
    const commentsUrl = `/posts/${id}/comments`; // Assuming this route exists

    // Helper for truncating content (JSX equivalent of post.content.truncate(120))
    const truncatedContent = content?.length > 120 ? content.substring(0, 120) + '...' : content;
    
    // Helper for safe URL handling
    const safeUrl = url && (url.startsWith('http') ? url : `http://${url}`);
    
    // Helper for image handling: ASSUMING 'post.image_as_thumbnail_url' is returned by the API
    const imageThumbnailUrl = post.image_as_thumbnail_url; 
    
    // Convert inline styles from CSS syntax to JSX (camelCase)
    const upvoteStyle = { 
        background: 'none', 
        border: 'none', 
        padding: 0, 
        color: voteValue === 1 ? '#0455a7ff' : '#30353fff' 
    };
    const downvoteStyle = { 
        background: 'none', 
        border: 'none', 
        padding: 0, 
        color: voteValue === -1 ? '#7e0000ff' : '#30353fff' 
    };

    return (
        <div className="post-card">
            
            {/* LEFT SECTION: Voting Box */}
            <div className="voting-box">
                
                {/* UPVOTE BUTTON */}
                <button 
                    onClick={handleUpvote} 
                    className="vote-button upvote-button" 
                    style={upvoteStyle}
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                </button>
                
                <span className="vote-score">{score}</span>
                
                {/* DOWNVOTE BUTTON */}
                <button 
                    onClick={handleDownvote} 
                    className="vote-button downvote-button" 
                    style={downvoteStyle}
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </button>
            </div>

            {/* MIDDLE SECTION: Image/Link */}
            {/* Check if API returned an image URL */}
            {imageThumbnailUrl ? (
                // Replaced link_to image_tag with <Link> and <img>
                <Link to={postDetailUrl} className="post-image-link"> 
                    <img src={imageThumbnailUrl} alt={title} />
                </Link>
            ) : (
                <div 
                    className="post-image-link" 
                    data-link={url || ""} // Data attributes in JSX
                >
                    {/* Placeholder if no image */}
                    <svg className="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-12 0h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
            )}
            
            {/* RIGHT SECTION: Content and Actions */}
            <div className="post-content-section">
                
                {isLoggedIn && (
                    <div className="save-button-wrapper">
                        {/* Replaced render '/saves/save_button' with a React component */}
                        <PostSaveButton post={post} /> 
                    </div>
                )}
                
                {/* WRAP THE TITLE WITH THE LINK */}
                <h3 className="post-title">
                    {/* Replaced link_to with <Link> */}
                    <Link to={postDetailUrl}>{title}</Link> 
                </h3>
                
                <p className="post-meta">
                    Publicado por
                    {/* Link to user profile */}
                    <Link to={userProfileUrl} className="post-author-link"> 
                        {user.username} 
                    </Link>
                
                    en 
                    {/* Link to community page */}
                    <Link to={communityUrl} className="post-community-link"> 
                        {community_name} 
                    </Link>
                </p>
                
                {content && ( // Conditional rendering if content exists
                    <p style={{ fontSize: '14px', marginTop: '10px' }}>
                        {truncatedContent}
                    </p>
                )}

                <div className="post-actions">
                    {/* Link to comments section */}
                    <a href={commentsUrl} className="action-button"> 
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '5px' }} xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                        {comments_count} Comentarios
                    </a>
                  
                    {/* External Link Button */}
                    {url && (
                        <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="action-button clickable-override">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '5px' }} xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.815l-1.554 1.553m0 0L5.63 18.064m1.102-1.101a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101z"></path></svg>
                            View Link
                        </a>
                    )}
                    
                    {/* Edit and Delete Buttons (Visible only to post author) */}
                    {isLoggedIn && currentUser.id === user_id && (
                        <>
                            <Link to={`/posts/${id}/edit`} 
                                className="nav-button" 
                                style={{ 
                                    fontSize: '0.75em', 
                                    padding: '4px 8px', 
                                    backgroundColor: '#4da6ff', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer', 
                                    textDecoration: 'none', 
                                    marginRight: '0px' 
                                }}
                            >
                                Editar
                            </Link> 
                            
                            {/* Deletion needs a dedicated React function */}
                            <button 
                                onClick={() => {
                                    if (window.confirm("Segur@ que quiere eliminar esta publicacion?")) {
                                        // TODO: Implement Axios DELETE call here
                                        console.log(`DELETING post ${id}`);
                                    }
                                }}
                                className="nav-button" 
                                style={{ 
                                    fontSize: '0.75em', 
                                    padding: '4px 8px', 
                                    backgroundColor: '#dc2626', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer'
                                }}
                            >
                                Eliminar
                            </button> 
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// 3. --- PROPS VALIDATION (Best Practice) ---
PostCard.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string,
        score: PropTypes.number.isRequired,
        comments_count: PropTypes.number.isRequired,
        url: PropTypes.string,
        user_id: PropTypes.number.isRequired,
        // Assuming your API returns nested user and community objects
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
        }).isRequired,
        community_id: PropTypes.number.isRequired, 
        community_name: PropTypes.string.isRequired,
        image_as_thumbnail_url: PropTypes.string, // Assumed property from API
    }).isRequired,
};

export default PostCard;