// src/components/CommunityCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function CommunityCard({ community, isSubscribed, onSubscribe, onUnsubscribe, showSubscribeButton }) {
    const avatarUrl = community.avatar || null;
    const initial = community.title ? community.title.charAt(0).toUpperCase() : '?';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', 
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #E5E7EB', 
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'transform 0.1s ease-in-out',
        }}>
            {/* IZQUIERDA: Avatar + Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#9CA3AF',
                    border: '1px solid #E5E7EB'
                }}>
                    {avatarUrl ? (
                        <img 
                            src={avatarUrl} 
                            alt={community.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    ) : (
                        <span>{initial}</span>
                    )}
                </div>

                <div style={{ textAlign: 'left' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
                        {/* CORRECCIÓN AQUÍ: Usamos `community.name` para el enlace */}
                        <Link 
                            to={`/c/${community.name}`} 
                            style={{ textDecoration: 'none', color: '#111827' }}
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        >
                            {community.title || community.name}
                        </Link>
                    </h3>
                    <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '13px' }}>
                        {community.members_size || 0} suscriptores • {community.posts_size || 0} publicaciones • {community.total_comments_count || 0} comentarios
                    </p>
                </div>
            </div>

            {/* DERECHA: Botones */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Link 
                    to={`/c/${community.name}`} 
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        color: '#374151',
                        fontWeight: '600',
                        fontSize: '14px',
                        backgroundColor: '#F3F4F6',
                        border: '1px solid transparent'
                    }}
                >
                    Ver
                </Link>

                {showSubscribeButton && (
                    isSubscribed ? (
                        <button 
                            onClick={onUnsubscribe} // Ya pasamos la función con los parámetros desde el padre
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #D1D5DB',
                                backgroundColor: '#fff',
                                color: '#EF4444', 
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                        >
                            Salir
                        </button>
                    ) : (
                        <button 
                            onClick={onSubscribe}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                backgroundColor: '#111827',
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                        >
                            Unirse
                        </button>
                    )
                )}
            </div>
        </div>
    );
}