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
        return <div className="post-form-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>Loading Editor...</div>;
    }

    const imageURL = `/posts/${id}/comments`; // The cancel link destination

    return (
        <div className="post-form-wrapper">
            <div className="post-form-container">
                <h1 className="form-title">Editar Publicación</h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Error Display */}
                    {errors && errors.length > 0 && (
                        <div style={{ color: '#dc2626', marginBottom: '15px', padding: '10px', border: '1px solid #dc2626', borderRadius: '4px' }}>
                            <h2 style={{ fontSize: '1em', color: 'inherit', margin: '0 0 5px 0' }}>
                                {errors.length} {errors.length === 1 ? 'error' : 'errores'} impidieron guardar la publicación:
                            </h2>
                            <ul style={{ listStyle: 'disc', marginLeft: '20px' }}>
                                {errors.map((message, index) => (
                                    <li key={index}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Title Field */}
                    <div className="form-field">
                        <label htmlFor="title" className="form-label">Título del post:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Introduce un título para tu publicación"
                            required
                            className="form-input"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* URL Field */}
                    <div className="form-field">
                        <label htmlFor="url" className="form-label">URL:</label>
                        <input
                            type="url"
                            id="url"
                            name="url"
                            placeholder="Link opcional (e.g., https://example.com)"
                            className="form-input"
                            value={formData.url}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Image Field */}
                    <div className="form-field">
                        <label htmlFor="image" className="form-label">Imagen:</label>

                        {/* Current Image Preview */}
                        {formData.image_preview_url && (
                            <div className="post-image-container" style={{ marginBottom: '10px' }}>
                                <img
                                    src={formData.image_preview_url}
                                    alt="Current Post Image"
                                    className="post-image"
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        display: 'block',
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

                    {/* Content Field */}
                    <div className="form-field form-field-stacked">
                        <label htmlFor="content" className="form-label">Contenido:</label>
                        <textarea
                            id="content"
                            name="content"
                            rows="6"
                            placeholder="Escribe el contenido de tu post aquí..."
                            required
                            className="form-input form-textarea"
                            value={formData.content}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions" style={{ marginTop: '20px',  }}>
                        <button
                            type="submit"
                            className="nav-button create-post-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Actualizando...' : 'Actualizar Publicación'}
                        </button>

                        <Link
                            to={imageURL}
                            className="nav-button"
                            style={{
                                backgroundColor: '#d61919ff',
                                marginLeft: '10px'
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
