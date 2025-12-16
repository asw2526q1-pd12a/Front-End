// src/components/CommunityCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function CommunityCard({ community, isSubscribed, onSubscribe, onUnsubscribe, showSubscribeButton }) {
    // Si no hay avatar, usamos un placeholder con la inicial
    const avatarUrl = community.avatar || null;
    const initial = community.title ? community.title.charAt(0).toUpperCase() : '?';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Separa info a la izq y botones a la der
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgb(145, 141, 219)', // Borde sutil
            marginBottom: '15px',         // Separación entre tarjetas
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'transform 0.1s ease-in-out',
        }}>
            {/* IZQUIERDA: Avatar + Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                
                {/* Avatar Circular */}
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
                    color: '#9CA3AF'
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

                {/* Textos */}
                <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
                        <Link 
                            to={`/c/${community.title}`} 
                            style={{ textDecoration: 'none', color: '#111827' }}
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        >
                            {community.title}
                        </Link>
                    </h3>
                    <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '13px' }}>
                        {community.members_size || 0} suscriptores • {community.posts_size || 0} publicaciones
                    </p>
                </div>
            </div>

            {/* DERECHA: Botones alineados verticalmente al centro */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* Botón Ver (Secundario) */}
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

                {/* Botón Suscribirse (Primario/Acción) */}
                {showSubscribeButton && (
                    isSubscribed ? (
                        <button 
                            onClick={() => onUnsubscribe(community.name)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #D1D5DB',
                                backgroundColor: '#fff',
                                color: '#EF4444', // Rojo para salir
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '14px'
                            }}
                        >
                            Salir
                        </button>
                    ) : (
                        <button 
                            onClick={() => onSubscribe(community.name)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                backgroundColor: '#111827', // Negro
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