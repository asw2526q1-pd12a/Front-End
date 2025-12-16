// src/pages/CommunityPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCommunity } from '../services/api';

export default function CommunityPage() {
    const { name } = useParams();
    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const response = await getCommunity(name);
                setCommunity(response.data);
            } catch (err) {
                setError("Comunidad no encontrada: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunity();
    }, [name]);

    if (loading) return <div>Cargando comunidad...</div>;
    if (error) return <div style={{padding: '20px', color: 'red'}}>{error}</div>;
    if (!community) return null;

    // Estilos dinámicos basados en la estructura HTML ERB [cite: 2, 3, 4]
    const bannerStyle = community.banner 
        ? { backgroundImage: `url(${community.banner})` } 
        : { backgroundColor: '#3f526eff' };

    return (
        <div style={{ width: '100%' }}>
            {/* --- HEADER DE LA COMUNIDAD --- [cite: 1] */}
            <div className="community-header-container" style={{ position: 'relative', backgroundColor: '#242424', marginBottom: '20px' }}>
                
                {/* Banner Background */}
                <div className="community-banner-background" style={{ 
                    height: '150px', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    ...bannerStyle 
                }}></div>

                {/* Content Wrapper */}
                <div className="community-content-wrapper" style={{ padding: '0 20px', position: 'relative', top: '-20px', display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                    
                    {/* Avatar Container [cite: 3] */}
                    <div className="community-avatar-container" style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '50%', 
                        border: '4px solid #242424', 
                        backgroundColor: '#fff', 
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {community.avatar ? (
                            <img src={community.avatar} alt={community.name} className="community-avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div className="community-avatar-placeholder" style={{ fontSize: '30px', fontWeight: 'bold', color: '#333' }}>
                                {community.title ? community.title.charAt(0).toUpperCase() : '?'}
                            </div>
                        )}
                    </div>

                    {/* Texto Overlay */}
                    <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                        <h1 className="community-title-overlay" style={{ margin: 0, fontSize: '28px', color: 'white' }}>
                            {community.title}
                        </h1>
                        <p className="community-name-overlay" style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                            {community.name}
                        </p>
                    </div>

                    {/* Acciones Overlay [cite: 5] */}
                    <div className="community-actions-overlay" style={{ marginLeft: 'auto', marginBottom: '15px' }}>
                        {/* El enlace original lleva a new_post_path, pero lo mantenemos visualmente o lo desactivamos según instrucciones */}
                        <button className="nav-button primary-button" disabled title="Funcionalidad de posts deshabilitada">
                            Crear una publicación
                        </button>
                    </div>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <main className="main-layout" style={{ marginTop: '20px', padding: '0 20px' }}>
                <div className="feed-column">
                    <h2 style={{ color: '#d1d5db', fontSize: '20px', marginBottom: '20px', textAlign: 'left' }}>
                        Posts en {community.name}
                    </h2>
                    
                    {/* Placeholder porque no implementamos posts [cite: 6] */}
                    <div className="post-card" style={{ textAlign: 'center', padding: '40px', display: 'block', backgroundColor: '#333', borderRadius: '8px' }}>
                        <p>La visualización de posts no está implementada en esta vista.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}