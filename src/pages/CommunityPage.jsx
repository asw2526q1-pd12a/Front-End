// src/pages/CommunityPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

    if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando comunidad...</div>;
    
    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );
    }
    
    if (!community) return null;

    return (
        // Contenedor principal centrado, igual que ProfilePage
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            
            {/* Tarjeta de la Comunidad: Fondo blanco, borde sutil, sombra suave */}
            <div style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                backgroundColor: 'white', 
                color: 'black',
                marginBottom: '20px'
            }}>
                
                {/* Banner: Altura fija, gris por defecto si no hay imagen */}
                <div style={{ 
                    height: '150px', 
                    backgroundColor: '#e0e0e0', 
                    backgroundImage: community.banner ? `url(${community.banner})` : 'none', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}>
                    {!community.banner && (
                        <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#888'}}>
                            No Banner
                        </div>
                    )}
                </div>

                {/* Contenedor de Información (Avatar + Textos) */}
                <div style={{ padding: '20px', position: 'relative' }}>
                    
                    {/* Avatar Superpuesto */}
                    <div style={{ 
                        position: 'absolute', 
                        top: '-50px', 
                        left: '20px', 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '50%', 
                        border: '4px solid white', 
                        overflow: 'hidden', 
                        backgroundColor: '#ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {community.avatar ? (
                            <img 
                                src={community.avatar} 
                                alt={community.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <span style={{ fontSize: '30px', fontWeight: 'bold', color: '#fff' }}>
                                {community.title ? community.title.charAt(0).toUpperCase() : '?'}
                            </span>
                        )}
                    </div>

                    {/* Encabezado: Título y Slug (con margen izquierdo para salvar el avatar) */}
                    <div style={{ marginLeft: '120px', marginBottom: '20px', minHeight: '60px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h1 style={{ margin: '0', fontSize: '24px', color: '#111827' }}>
                                    {community.title}
                                </h1>
                                <p style={{ margin: '0', color: '#666' }}>
                                    c/{community.name}
                                </p>
                            </div>
                            
                            {/* Botón de Acción Minimalista */}
                            <button 
                                className="nav-button primary-button" 
                                disabled 
                                title="Funcionalidad de posts deshabilitada"
                                style={{ 
                                    padding: '8px 16px', 
                                    fontSize: '13px', 
                                    height: 'fit-content' 
                                }}
                            >
                                Crear Post
                            </button>
                        </div>
                    </div>

                    {/* Estadísticas: Pie de tarjeta con borde superior */}
                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                        <div>
                            <strong>{community.members_size || 0}</strong> Suscriptores
                        </div>
                        <div>
                            <strong>{community.posts_size || 0}</strong> Publicaciones
                        </div>
                        <div>
                            <strong>{community.total_comments_count || 0}</strong> Comentarios
                        </div>
                    </div>

                </div>
            </div>

            {/* Sección de Posts (Separada visualmente pero alineada) */}
            <div style={{ marginTop: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '15px' }}>
                    Publicaciones
                </h3>
                
                {/* Placeholder para posts con estilo limpio */}
                <div style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    border: '1px solid #ddd', 
                    color: '#666',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                    <p>No hay publicaciones para mostrar.</p>
                </div>
            </div>
        </div>
    );
}