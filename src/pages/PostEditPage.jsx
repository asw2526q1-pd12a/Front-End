// src/pages/PostEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost } from '../services/api';
import { TextInput } from '../components/ui/TextInput';
import { FileInput } from '../components/ui/FileInput';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ErrorAlert } from '../components/ui/ErrorAlert';

export default function PostEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Estados del formulario
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');
    const [image, setImage] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar datos iniciales
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await getPost(id);
                // Ajustamos según la estructura que devuelva tu API (usualmente response.data o response.data.post)
                const post = response.data.post || response.data;
                
                setTitle(post.title || '');
                setContent(post.content || '');
                setUrl(post.url || '');
                setLoading(false);
            } catch (err) {
                setErrors(["No se pudo cargar la información de la publicación: " + (err.response?.data?.message || err.message)]);
                setLoading(false);
            }
        };
        fetchPostData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('post[title]', title);
        formData.append('post[content]', content);
        formData.append('post[url]', url);
        if (image) formData.append('post[image]', image);

        try {
            await updatePost(id, formData);
            navigate(`/posts/${id}`); 
        } catch (error) {
            setIsSubmitting(false);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors(["Ocurrió un error al intentar actualizar la publicación."]);
            }
        }
    };

    if (loading) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
                <p style={{ color: '#6B7280' }}>Cargando datos...</p>
            </main>
        );
    }

    return (
        <main style={{ 
            minHeight: '100vh', 
            backgroundColor: '#ffffff', // Fondo gris claro para resaltar la caja
            display: 'flex',             
            justifyContent: 'center',    // Centrado horizontal
            alignItems: 'center',        // Centrado vertical
            padding: '20px'              
        }}>
            {/* CAJA CONTENEDORA CON SOMBRA Y BORDES (Igual a CreateCommunity) */}
            <div style={{ 
                width: '100%', 
                maxWidth: '550px',       
                backgroundColor: '#ffffff', 
                borderRadius: '16px',    
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
                padding: '40px',
                border: '1px solid #E5E7EB'
            }}>
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '37px', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
                        Editar publicación
                    </h2>
                    <p style={{ color: '#4B5563', fontSize: '15px', margin: 0 }}>
                        Actualiza la información de tu post
                    </p>
                </div>

                <ErrorAlert errors={errors} />

                <form onSubmit={handleSubmit}>
                    <TextInput 
                        label="Título"
                        placeholder="Escribe un título..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <TextInput 
                        label="URL (Enlace externo)"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                            Contenido
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Contenido de la publicación..."
                            rows="5"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '14px',
                                outline: 'none',
                                backgroundColor: '#F9FAFB',
                                color: '#111827',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <FileInput 
                            id="edit-post-image" 
                            label="Cambiar Imagen (Opcional)" 
                            file={image} 
                            setFile={setImage} 
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Actualizar Publicación'}
                        </PrimaryButton>
                        
                        <button 
                            type="button"
                            onClick={() => navigate(-1)}
                            style={{
                                width: '100%',
                                backgroundColor: 'transparent',
                                color: '#6B7280',
                                fontWeight: '600',
                                padding: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textDecoration: 'underline'
                            }}
                        >
                            Cancelar y volver
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}