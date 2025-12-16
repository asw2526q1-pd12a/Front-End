// src/pages/CommunitiesPage.jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCommunities, subscribeCommunity, unsubscribeCommunity } from '../services/api';
import { useUser } from '../contexts/UserContext';

export default function CommunitiesPage() {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useUser();
    
    // Obtener el filtro de la URL (?filter=subscribed) o por defecto 'todas'
    const filter = searchParams.get('filter') || 'todas';

    useEffect(() => {
        fetchCommunities();
    }, [filter, user]); // Recargar si cambia el filtro o el usuario

    const fetchCommunities = async () => {
        setLoading(true);
        try {
            // El backend espera 'subscribed' para el filtro, mapeamos 'suscritas' de la UI a 'subscribed' de la API
            const apiFilter = filter === 'suscritas' ? 'subscribed' : null;
            const response = await getCommunities(apiFilter);
            setCommunities(response.data);
        } catch (error) {
            console.error("Error cargando comunidades:", error);
            setCommunities([]); // En caso de error (ej. 404 por no tener suscripciones), vaciamos
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (name) => {
        try {
            await subscribeCommunity(name);
            fetchCommunities(); // Recargamos para actualizar estado
        } catch (error) {
            alert("Error al suscribirse: " + error.message);
        }
    };

    const handleUnsubscribe = async (name) => {
        try {
            await unsubscribeCommunity(name);
            fetchCommunities(); // Recargamos para actualizar estado
        } catch (error) {
            alert("Error al salir de la comunidad: " + error.message);
        }
    };

    return (
        <main className="main-layout">
            <div className="feed-column">
                {/* Header y Filtros  */}
                <div className="feed-header-filters">
                    <h2 style={{ color: '#242527', fontSize: '20px', margin: 0 }}>
                        {filter === 'suscritas' ? 'Mis Comunidades' : 'Todas las Comunidades'}
                    </h2>
                    
                    <div className="filter-buttons">
                        <button 
                            className={`nav-button ${filter === 'todas' ? 'active' : ''}`}
                            onClick={() => setSearchParams({ filter: 'todas' })}
                        >
                            Todas
                        </button>

                        {user && (
                            <button 
                                className={`nav-button ${filter === 'suscritas' ? 'active' : ''}`}
                                onClick={() => setSearchParams({ filter: 'suscritas' })}
                            >
                                Suscritas
                            </button>
                        )}

                        <Link to="/communities/new" className="nav-button primary-button">
                            Crear Comunidad
                        </Link>
                    </div>
                </div>

                {/* Lista de Comunidades */}
                {loading ? (
                    <p>Cargando...</p>
                ) : communities.length === 0 ? (
                    <div className="post-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <p>No hay comunidades. ¡Crea la primera!</p>
                    </div>
                ) : (
                    communities.map((community) => (
                        <div key={community.id} className="post-card" style={{ padding: '20px', display: 'flex', justifyContent: 'spaceBetween', alignItems: 'center', marginBottom: '10px' }}>
                            
                            {/* Sección Información [cite: 16] */}
                            <div style={{textAlign: 'left'}}>
                                <h3 className="post-title" style={{ margin: 0 }}>
                                    <Link to={`/c/${community.name}`} className="post-title-link">
                                        {community.title || community.name}
                                    </Link>
                                </h3>
                                <p className="post-meta" style={{ margin: '5px 0 0 0', color: '#555', fontSize: '0.9em' }}>
                                    {community.name} &bull; {community.members_size || 0} suscriptores &bull; {community.posts_size || 0} publicaciones &bull; {community.total_comments_count || 0} comentarios
                                </p>
                            </div>

                            {/* Sección Botones [cite: 20] */}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                                {user && (
                                    // Nota: Para saber si está suscrito en la vista "Todas", idealmente el backend debería devolver un campo "subscribed_by_current_user".
                                    // Por ahora, usamos la lógica visual: si estamos en la pestaña "Suscritas", mostramos Salir.
                                    filter === 'suscritas' ? (
                                        <button onClick={() => handleUnsubscribe(community.name)} className="nav-button">
                                            Salir
                                        </button>
                                    ) : (
                                         // En "Todas", asumimos botón de suscribirse (o "Ver" si ya lo está, requeriría lógica extra del backend)
                                        <button onClick={() => handleSubscribe(community.name)} className="nav-button primary-button">
                                            Suscribirse
                                        </button>
                                    )
                                )}
                                <Link to={`/c/${community.name}`} className="nav-button">Ver</Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}
