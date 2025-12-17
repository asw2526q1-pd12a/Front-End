import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPost, updatePost, API_BASE_URL } from '../services/api';
import PropTypes from 'prop-types'; // Used for PostEditPage's prop-like post structure

function PostEditPage() {
    // 1. HOOKS AND STATE
    const { id } = useParams(); // Get post ID from URL
    const navigate = useNavigate();
    
    // Initial state based on your form fields
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        url: '',
        image: null, // For file upload
        image_preview_url: null, // For displaying existing image
    });

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null); // To store API validation errors
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // 2. DATA FETCHING (GET request to load current post data)
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await getPost(id);
                const post = response.data.post; // Access the nested 'post' key (from previous fix)

                setFormData({
                    title: post.title || '',
                    content: post.content || '',
                    url: post.url || '',
                    image: null,
                    image_preview_url: post.image_url 
                        ? (post.image_url.startsWith('http') ? post.image_url : `${API_BASE_URL}${post.image_url}`)
                        : null,
                });
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch post for editing:", err);
                // Handle 404 or authorization error
                setErrors(["Failed to load post. Check authorization or ID."]);
                setLoading(false);
            }
        };

        fetchPostData();
    }, [id]);

    // 3. HANDLERS
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, image: file }));
        
        // Optional: Create a temporary preview URL for the newly selected image
        if (file) {
            setFormData(prev => ({ ...prev, image_preview_url: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors(null);

        // Prepare form data for API submission (Handles file and text)
        const data = new FormData();
        
        // Append post fields to FormData
        data.append('post[title]', formData.title);
        data.append('post[content]', formData.content);
        data.append('post[url]', formData.url);
        
        // Append image file if a new one was selected
        if (formData.image) {
            data.append('post[image]', formData.image);
        }

        try {
            // Use PUT/PATCH for updating, essential for Rails API updates
            await updatePost(id, data);

            // Success: Redirect to the post's detail page
            navigate(`/posts/${id}`); 

        } catch (err) {
            setIsSubmitting(false);
            const apiErrors = err.response?.data?.errors;
            if (apiErrors) {
                // Assuming API returns errors in a standard format
                setErrors(Object.values(apiErrors).flat());
            } else {
                setErrors(["An unknown error occurred while updating the post."]);
            }
        }
    };
    
    // 4. RENDERING
    if (loading) {
        return <div className="main-layout" style={{ justifyContent: 'center', color: '#000' }}>Loading Editor...</div>;
    }
    
    const imageURL = `/posts/${id}/comments`; // The cancel link destination

    return (
        <div className="main-layout" style={{ justifyContent: 'center' }}>
            <div 
                className="feed-column" 
                style={{
                    maxWidth: '600px', 
                    backgroundColor: '#b7cbe7ff', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    border: '1px solid #374151', 
                    marginBottom: '20px'
                }}
            >
                
                <h1 style={{ color: '#000000ff', marginTop: 0, marginBottom: '20px' }}>Edit Post</h1>
                
                <form onSubmit={handleSubmit} className="post-form">
                    
                    {/* Error Display (Translated from @post.errors.any?) */}
                    {errors && errors.length > 0 && (
                        <div id="error_explanation" style={{ color: '#f87171', marginBottom: '15px', padding: '10px', border: '1px solid #f87171', borderRadius: '4px' }}>
                            <h2 style={{ fontSize: '1em', color: 'inherit', margin: '0 0 5px 0' }}>
                                {errors.length} {errors.length === 1 ? 'error' : 'errors'} prohibited this post from being saved:
                            </h2>
                            <ul style={{ listStyle: 'disc', marginLeft: '20px' }}>
                                {errors.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Title Field (f.text_field :title) */}
                    <div className="form-group">
                        <label htmlFor="title" style={{ color: '#313233ff' }}>Título:</label>
                        <input 
                            type="text"
                            id="title"
                            name="title" 
                            className="text-input" 
                            placeholder="A compelling title..." 
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            style={{ backgroundColor: '#c9d1e7ff', width: '100%' }} 
                        />
                    </div>

                    {/* Content Field (f.text_area :content) */}
                    <div className="form-group">
                        <label htmlFor="content" style={{ color: '#313233ff' }}>Contenido:</label>
                        <textarea 
                            id="content"
                            name="content" 
                            className="text-area-input" 
                            placeholder="Post content (optional)..." 
                            value={formData.content}
                            onChange={handleInputChange}
                            style={{ backgroundColor: '#c9d1e7ff', minHeight: '150px', width: '100%' }} 
                        />
                    </div>

                    {/* URL Field (f.text_field :url) */}
                    <div className="form-group">
                        <label htmlFor="url" style={{ color: '#313233ff' }}>Link URL (opcional):</label>
                        <input 
                            type="url"
                            id="url"
                            name="url" 
                            className="text-input" 
                            placeholder="e.g., https://example.com/article" 
                            value={formData.url}
                            onChange={handleInputChange}
                            style={{ backgroundColor: '#c9d1e7ff', width: '100%' }} 
                        />
                    </div>

                    {/* Image Field (f.file_field :image) */}
                    <div className="form-group">
                        <label htmlFor="image" style={{ color: '#313233ff' }}>Imagen:</label>
                        
                        {/* Current Image Preview (@post.image.attached?) */}
                        {formData.image_preview_url && (
                            <div className="post-image-container">
                                <img 
                                    src={formData.image_preview_url} 
                                    alt="Current Post Image" 
                                    className="post-image" 
                                    style={{ 
                                        maxWidth: '100%', 
                                        height: 'auto', 
                                        display: 'block', 
                                        marginBottom: '10px', 
                                        borderRadius: '4px' 
                                    }}
                                />
                            </div>
                        )}
                        
                        <input 
                            type="file"
                            id="image"
                            name="image"
                            className="form-input form-file-input"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Form Actions (f.submit and link_to) */}
                    <div className="form-actions" style={{ marginTop: '20px' }}>
                        <button 
                            type="submit" 
                            className="submit-button" 
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#4da6ff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            {isSubmitting ? 'Actualizando...' : 'Actualizar Publicación'}
                        </button>
                        
                        <Link 
                            to={imageURL} 
                            className="nav-button" 
                            style={{ 
                                backgroundColor: '#d61919ff', 
                                color: 'white', 
                                padding: '10px 15px', 
                                borderRadius: '4px', 
                                marginLeft: '10px',
                                textDecoration: 'none'
                            }}
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostEditPage;