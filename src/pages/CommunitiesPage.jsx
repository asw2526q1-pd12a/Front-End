// src/pages/CommunitiesPage.jsx
import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCommunities, subscribeCommunity, unsubscribeCommunity } from '../services/api';
import { useUser } from '../contexts/UserContext';
import CommunityCard from '../components/CommunityCard';

export default function CommunitiesPage() {
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [subscribedIds, setSubscribedIds] = useState(new Set()); 
    const { user } = useUser();
    
    const filter = searchParams.get('filter') || 'todas';

    const fetchCommunities = useCallback(async () => {
        setLoading(true);
        try {
            const apiFilter = filter === 'suscritas' ? 'subscribed' : null;
            
            const promises = [getCommunities(apiFilter)];
            
            if (user && filter === 'todas') {
                promises.push(getCommunities('subscribed'));
            }

            const [communitiesResponse, subscribedResponse] = await Promise.all(promises);
            setCommunities(communitiesResponse.data);

            if (filter === 'suscritas') {
                setSubscribedIds(new Set(communitiesResponse.data.map(c => c.id)));
            } else if (subscribedResponse) {
                setSubscribedIds(new Set(subscribedResponse.data.map(c => c.id)));
            }

        } catch (error) {
            console.error("Error cargando comunidades:", error);
            setCommunities([]);
        } finally {
            setLoading(false);
        }
    }, [filter, user]);

    useEffect(() => {
        fetchCommunities();
    }, [fetchCommunities, user]);

    const handleSubscribe = async (name, id) => {
        try {
            setSubscribedIds(prev => new Set(prev).add(id));
            await subscribeCommunity(name);
        } catch (error) {
            setSubscribedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
            alert("Error al suscribirse: " + error.message);
        }
    };

    const handleUnsubscribe = async (name, id) => {
        try {
            setSubscribedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
            await unsubscribeCommunity(name);
        } catch (error) {
            setSubscribedIds(prev => new Set(prev).add(id));
            alert("Error al salir de la comunidad: " + error.message);
        }
    };

    return (
        <main className="main-layout" style={{ backgroundColor: '#ffffff' }}>
            <div className="feed-column" style={{ 
                backgroundColor: 'transparent', 
                boxShadow: 'none', 
                border: 'none',
                maxWidth: '800px', 
                width: '100%', // <--- IMPORTANTE: Asegura que la columna use todo el ancho posible (hasta 800px)
                margin: '0 auto', 
                padding: '20px 0' 
            }}>
                {/* Header y Filtros */}
                <div className="feed-header-filters" style={{ width: '100%' }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '25px',
                        width: '100%' // <--- CLAVE: Esto fuerza la separación MÁXIMA entre los hijos
                    }}>
                        {/* GRUPO IZQUIERDA: Título + Botones Toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: 0 }}>
                                Comunidades
                            </h2>
                            
                            <div style={{ display: 'flex', backgroundColor: '#F3F4F6', padding: '4px', borderRadius: '20px' }}>
                                <button 
                                    onClick={() => setSearchParams({ filter: 'todas' })}
                                    style={{
                                        border: 'none',
                                        padding: '6px 16px',
                                        borderRadius: '16px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        backgroundColor: filter === 'todas' ? '#ffffff' : 'transparent',
                                        color: filter === 'todas' ? '#111827' : '#6B7280',
                                        boxShadow: filter === 'todas' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Todas
                                </button>
                                {user && (
                                    <button 
                                        onClick={() => setSearchParams({ filter: 'suscritas' })}
                                        style={{
                                            border: 'none',
                                            padding: '6px 16px',
                                            borderRadius: '16px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            backgroundColor: filter === 'suscritas' ? '#ffffff' : 'transparent',
                                            color: filter === 'suscritas' ? '#111827' : '#6B7280',
                                            boxShadow: filter === 'suscritas' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Suscritas
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* GRUPO DERECHA: Botón Crear */}
                        <Link 
                            to="/communities/new" 
                            style={{
                                backgroundColor: '#111827',
                                color: '#fff',
                                padding: '10px 20px',
                                borderRadius: '24px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <span>+</span> Crear Comunidad
                        </Link>
                    </div>
                </div>

                {/* Lista de Comunidades */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Cargando...</div>
                ) : communities.length === 0 ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 20px', 
                        border: 'none', 
                        backgroundColor: 'transparent'
                    }}>
                        <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>No se encontraron comunidades.</p>
                        <p style={{ color: '#9CA3AF' }}>¡Sé el primero en crear una!</p>
                    </div>
                ) : (
                    communities.map((community) => (
                        <CommunityCard 
                            key={community.id}
                            community={community}
                            isSubscribed={subscribedIds.has(community.id)} 
                            showSubscribeButton={!!user}
                            onSubscribe={() => handleSubscribe(community.name, community.id)}
                            onUnsubscribe={() => handleUnsubscribe(community.name, community.id)}
                        />
                    ))
                )}
            </div>
        </main>
    );
}