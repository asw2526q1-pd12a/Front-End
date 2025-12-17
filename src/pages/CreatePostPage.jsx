// src/pages/CreatePostPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCommunities, createPost } from '../services/api';
import { TextInput } from '../components/ui/TextInput';
import { FileInput } from '../components/ui/FileInput';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ErrorAlert } from '../components/ui/ErrorAlert';

export default function CreatePostPage() {
    const navigate = useNavigate();
    
    // Estados del formulario
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [url, setUrl] = useState('');
    const [communityId, setCommunityId] = useState('');
    const [image, setImage] = useState(null);
    
    // Estados de carga y error
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Cargar comunidades (Solución al error de recarga)
    useEffect(() => {
        let isMounted = true;
        const fetchCommunities = async () => {
            try {
                // Si el backend tarda un poco en reconocer la API Key tras F5, 
                // esperamos un instante o simplemente reintentamos
                const response = await getCommunities();
                if (isMounted) {
                    const data = response.data.communities || response.data;
                    setCommunities(Array.isArray(data) ? data : []);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error cargando comunidades:", err);
                    // Solo mostramos error si realmente no hay comunidades cargadas
                    setErrors(prev => [...prev, "No se pudieron cargar las comunidades."]);
                    setLoading(false);
                }
            }
        };

        fetchCommunities();
        return () => { isMounted = false; };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        
        if (!communityId) {
            setErrors(["Debes seleccionar una comunidad."]);
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('post[title]', title);
        formData.append('post[content]', content);
        formData.append('post[url]', url);
        formData.append('post[community_id]', communityId);
        if (image) formData.append('post[image]', image);

        try {
            await createPost(formData);
            // CORRECCIÓN 1: Redirigir al feed principal
            navigate('/'); 
        } catch (error) {
            setIsSubmitting(false);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors(["Ocurrió un error al intentar crear la publicación."]);
            }
        }
    };

    if (loading) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
                <p style={{ color: '#6B7280' }}>Cargando...</p>
            </main>
        );
    }

    return (
        <main style={{ 
            minHeight: '100vh', 
            backgroundColor: '#ffffff', 
            display: 'flex',             
            justifyContent: 'center',    
            alignItems: 'center',        
            padding: '20px'              
        }}>
            {/* CAJA CONTENEDORA MINIMALISTA (Se mantiene el estilo solicitado) */}
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
                        Crear Publicación
                    </h2>
                    <p style={{ color: '#4B5563', fontSize: '15px', margin: 0 }}>
                        Comparte algo con la comunidad
                    </p>
                </div>

                <ErrorAlert errors={errors} />

                <form onSubmit={handleSubmit}>
                    
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                            Comunidad
                        </label>
                        <select
                            value={communityId}
                            onChange={(e) => setCommunityId(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '14px',
                                outline: 'none',
                                backgroundColor: '#F9FAFB',
                                color: '#111827',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Selecciona una comunidad...</option>
                            {communities.map((c) => (
                                <option key={c.id} value={c.id}>c/{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <TextInput 
                        label="Título"
                        placeholder="Escribe un título..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <TextInput 
                        label="URL (Opcional)"
                        placeholder="https://ejemplo.com"
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
                            placeholder="¿De qué quieres hablar?"
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
                        />
                    </div>

                    <div style={{ marginBottom: '35px' }}>
                        <FileInput 
                            id="post-image-upload" 
                            label="Añadir Imagen (Opcional)" 
                            file={image} 
                            setFile={setImage} 
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <PrimaryButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Publicando...' : 'Publicar'}
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
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}