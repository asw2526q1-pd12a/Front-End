import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostNewPage() {
    // 1. STATE MANAGEMENT
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        community_id: '', // Will store the selected community ID
        content: '',
        image: null,      // For file object
    });
    
    // State for dynamic content
    const [communities, setCommunities] = useState([]);
    const [loadingCommunities, setLoadingCommunities] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(null); // For validation errors

    // 2. FETCHING COMMUNITIES (Replaces Rails' Community.all.order(:name))
    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                // Assuming an API endpoint exists for fetching all communities
                const response = await axios.get('/api/v1/communities');
                // Assuming the response data is an array of {id, name} objects
                setCommunities(response.data.communities || response.data); 
            } catch (err) {
                console.error("Failed to load communities:", err);
                setErrors(["Error al cargar las comunidades. Inténtalo de nuevo."]);
            } finally {
                setLoadingCommunities(false);
            }
        };

        fetchCommunities();
    }, []);

    // 3. HANDLERS
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, image: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors(null);
        
        // Use FormData for multipart/form-data submission (required for file uploads)
        const data = new FormData();
        
        // Append all text/ID fields
        data.append('post[title]', formData.title);
        data.append('post[content]', formData.content);
        data.append('post[url]', formData.url);
        data.append('post[community_id]', formData.community_id);

        // Append image file if selected
        if (formData.image) {
            data.append('post[image]', formData.image);
        }
        
        // Check for required fields before API call
        if (!formData.title || !formData.content || !formData.community_id) {
            setErrors(["Título, contenido y comunidad son campos obligatorios."]);
            setIsSubmitting(false);
            return;
        }

        try {
            // POST request to create the new post
            const response = await axios.post('/api/v1/posts', data, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });

            // Success: Redirect to the newly created post's detail page
            const newPostId = response.data.post.id; // Assuming API returns the new post
            navigate(`/posts/${newPostId}`); 

        } catch (err) {
            setIsSubmitting(false);
            const apiErrors = err.response?.data?.errors;
            if (apiErrors) {
                // Assuming API returns errors like: { title: ["can't be blank"], content: ["is too short"] }
                // Flatten and store errors
                setErrors(Object.values(apiErrors).flat());
            } else {
                setErrors(["Error al crear la publicación. Verifica tu conexión o permisos."]);
            }
        }
    };

    // 4. RENDERING
    return (
        <div className="post-form-wrapper">
            <div className="post-form-container">
                <h1 className="form-title">Crea una nueva publicación</h1>
                
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

                    {/* Title Field (form.text_field :title) */}
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

                    {/* URL Field (form.text_field :url) */}
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

                    {/* Community Selection (form.collection_select :community_id) */}
                    <div className="form-field">
                        <label htmlFor="community_id">Comunidad</label>
                        <select
                            id="community_id"
                            name="community_id"
                            className="form-input"
                            required
                            value={formData.community_id}
                            onChange={handleInputChange}
                            disabled={loadingCommunities}
                        >
                            {/* Replaces { prompt: "Elige una comunidad" } */}
                            <option value="" disabled>
                                {loadingCommunities ? 'Cargando comunidades...' : 'Elige una comunidad'}
                            </option>
                            
                            {/* Map fetched communities to options */}
                            {communities.map((community) => (
                                <option key={community.id} value={community.id}>
                                    {community.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Image Selection (form.file_field :image) */}
                    <div className="form-field">
                        <label htmlFor="image" className="form-label">Imagen:</label>
                        <input 
                            type="file"
                            id="image"
                            name="image" 
                            className="form-input form-file-input"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Content Field (form.text_area :content) */}
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

                    {/* Submit Button (form.submit "Crear Publicación") */}
                    <div className="form-actions" style={{ marginTop: '20px', marginLeft: '278px' }}>
                        <button 
                            type="submit"
                            className="nav-button create-post-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creando...' : 'Crear Publicación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostNewPage;