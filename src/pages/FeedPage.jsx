// src/pages/FeedPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    getPosts, 
    getSubscribedPosts, 
    getComments, 
    getSubscribedComments 
} from '../services/api'; // Usamos las llamadas existentes

import PostCard from '../components/PostCard'; 
import CommentCard from '../components/CommentCard'; // Asegúrate de tener este componente o crea uno básico
import Sorter from '../components/Sorter'; 
import SubscribedToggle from '../components/SubscribedToggle';
import ViewSwitch from '../components/ViewSwitch';
import { useUser } from '../contexts/UserContext';

function FeedPage() {
    const { user } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    
    // 1. Obtener estado de la URL
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('query') || '';
    const isSubscribed = queryParams.get('subscribed') === 'true';
    const currentView = queryParams.get('view') || 'posts'; // 'posts' o 'comments'
    const sort = queryParams.get('sort') || 'new';

    // 2. Estado local
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(initialQuery);

    // 3. Efecto principal: Cargar datos
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                let response;

                // LÓGICA DE SELECCIÓN DE API
                // IMPORTANTE: Tu api.js espera getPosts(sortString), no un objeto.
                
                if (currentView === 'posts') {
                    if (isSubscribed && user) {
                        // Modo: Suscripciones
                        response = await getSubscribedPosts(sort);
                    } else {
                        // Modo: Global (Aquí estaba el error, ahora llamamos correctamente)
                        response = await getPosts(sort);
                    }
                } else { // currentView === 'comments'
                    if (isSubscribed && user) {
                        response = await getSubscribedComments(sort);
                    } else {
                        response = await getComments(sort);
                    }
                }

                // Normalizar respuesta: El backend puede devolver { posts: [] } o directamente []
                let data = response.data.posts || response.data.comments || response.data;
                
                // Filtrado Cliente-Side para la búsqueda (ya que api.js getPosts solo acepta sort)
                if (initialQuery) {
                    const q = initialQuery.toLowerCase();
                    data = data.filter(item => {
                        const contentMatch = item.content && item.content.toLowerCase().includes(q);
                        const titleMatch = item.title && item.title.toLowerCase().includes(q); // Solo posts tienen título
                        const bodyMatch = item.body && item.body.toLowerCase().includes(q); // Comentarios suelen tener body
                        return contentMatch || titleMatch || bodyMatch;
                    });
                }

                setItems(data);

            } catch (err) {
                console.error("Error cargando feed:", err);
                setError("No se pudieron cargar los datos.");
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search, user]); 

    // --- HANDLERS ---

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateUrl({ query: searchQuery });
    };

    const handleToggleSubscribed = () => {
        if (!user) return alert("Inicia sesión para ver tus suscripciones");
        // Toggle: Si es true lo pasamos a null (borrar param), si es null/false a 'true'
        const newValue = isSubscribed ? null : 'true'; 
        updateUrl({ subscribed: newValue });
    };

    const handleViewChange = (newView) => {
        // Al cambiar de vista, reiniciamos sort a 'new' por si acaso
        updateUrl({ view: newView, sort: 'new' });
    };

    const updateUrl = (newParams) => {
        const params = new URLSearchParams(location.search);
        Object.keys(newParams).forEach(key => {
            if (newParams[key] === null || newParams[key] === '') {
                params.delete(key);
            } else {
                params.set(key, newParams[key]);
            }
        });
        navigate(`${location.pathname}?${params.toString()}`);
    };

    return (
        <main className="main-layout" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
            
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '20px 0' }}>
                
                {/* --- HEADER: Switch de Vista y Buscador --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    
                    <div style={{ minWidth: '200px' }}>
                        {/* Switch entre Posts y Comentarios */}
                        <ViewSwitch 
                            currentView={currentView} 
                            onViewChange={handleViewChange} 
                        />
                    </div>

                    <form onSubmit={handleSearchSubmit} style={{ width: '300px' }}>
                        <input 
                            type="text"
                            placeholder={currentView === 'posts' ? "Buscar posts..." : "Buscar comentarios..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 16px',
                                borderRadius: '20px',
                                border: '1px solid #E5E7EB',
                                backgroundColor: '#F9FAFB',
                                outline: 'none',
                                fontSize: '14px',
                            }}
                        />
                    </form>
                </div>

                {/* --- BARRA DE HERRAMIENTAS: Ordenar y Toggle Suscritos --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    
                    {/* Sorter */}
                    <Sorter type={currentView} />

                    {/* Toggle Global / Mis Suscripciones */}
                    {user && (
                        <SubscribedToggle 
                            isSubscribed={isSubscribed} 
                            onToggle={handleToggleSubscribed} 
                        />
                    )}
                </div>

                {/* --- LISTADO DE CONTENIDO --- */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Cargando...</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#EF4444' }}>{error}</div>
                ) : items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
                        <p style={{ fontSize: '18px', fontWeight: '600' }}>No hay nada por aquí.</p>
                        <p>Intenta cambiar los filtros o la búsqueda.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Renderizado condicional del componente correcto */}
                        {currentView === 'posts' ? (
                            items.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))
                        ) : (
                            items.map(comment => (
                                // Renderizar CommentCard (asumiendo que existe o usando div temporal)
                                <CommentCard key={comment.id} comment={comment} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

export default FeedPage;