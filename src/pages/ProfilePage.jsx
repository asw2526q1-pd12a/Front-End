import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link, useParams } from 'react-router-dom';
import { getUserById } from '../services/api';

export default function ProfilePage() {
  const { user: currentUser, loading: contextLoading, error: contextError } = useUser();
  const { userId } = useParams();
  
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Determine if we are viewing our own profile or another user's
  const isOwnProfile = !userId || (currentUser && currentUser.id === parseInt(userId));

  useEffect(() => {
    // If viewing own profile (no ID in URL), we rely on UserContext
    if (!userId) {
      setProfileUser(currentUser);
      return;
    }

    // If viewing another user (ID in URL), fetch it
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUserById(userId);
        // Unwrap 'user' key if present (Rails API convention)
        const userData = response.data.user || response.data;
        setProfileUser(userData);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Usuario no encontrado.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser]);

  // Handle loading state
  if (loading || (isOwnProfile && contextLoading)) return <div>Cargando perfil...</div>;

  // Handle error state
  const displayError = userId ? error : contextError;
  if (displayError) {
    return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
            <h2>Error</h2>
            <p>{displayError}</p>
            {isOwnProfile && <p style={{ color: '#666' }}>Por favor verifica tu conexión o API Key.</p>}
        </div>
    )
  }

  // Handle case where no user data is available yet (or guest mode which is disabled but just in case)
  if (!profileUser) {
    // If it's own profile and we are here, it means we are logged out or context is empty
    if (isOwnProfile) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h2>No identificado</h2>
              <p>Por favor selecciona un usuario.</p>
            </div>
          );
    }
    // If explicit fetch failed or returned null
    return null; 
  }

  const userToDisplay = profileUser;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }}>
        {/* Banner */}
        <div style={{ height: '150px', backgroundColor: 'var(--navbar-border)', backgroundImage: userToDisplay?.banner_url ? `url(${userToDisplay.banner_url}?t=${userToDisplay._lastRefreshed})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {!userToDisplay?.banner_url && <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color: 'var(--navbar-text)'}}>Sin Banner</div>}
        </div>
        
        {/* Profile Info */}
        <div style={{ padding: '20px', position: 'relative' }}>
          {/* Avatar */}
          <div key={userToDisplay?.id} style={{ position: 'absolute', top: '-50px', left: '20px', width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--card-bg)', overflow: 'hidden', backgroundColor: 'var(--border-color)' }}>
            {userToDisplay?.avatar_url && !imageError ? (
              <img 
                src={`${userToDisplay.avatar_url}?t=${userToDisplay._lastRefreshed}`} 
                alt={userToDisplay.username} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
                <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '30px', color: '#fff', backgroundColor: 'var(--navbar-text)'}}>
                    {userToDisplay?.username?.charAt(0).toUpperCase() || '?'}
                </div>
            )}
          </div>

          <div style={{ marginLeft: '120px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h1 style={{ margin: '0', fontSize: '24px' }}>{userToDisplay?.full_name || 'Desconocido'}</h1>
                <p style={{ margin: '0', color: 'var(--navbar-text)', opacity: 0.8 }}>@{userToDisplay?.username || 'desconocido'}</p>
            </div>
            {isOwnProfile && (
                <Link to="/profile/edit" className="nav-button primary-button" style={{ fontSize: '0.9rem', padding: '5px 10px' }}>
                    Editar Perfil
                </Link>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            {userToDisplay?.bio ? <p>{userToDisplay.bio}</p> : <p style={{ fontStyle: 'italic', color: 'var(--navbar-text)' }}>Sin biografía</p>}
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
            <div>
              <strong>{userToDisplay?.posts_count || 0}</strong> Publicaciones
            </div>
            <div>
              <strong>{userToDisplay?.comments_count || 0}</strong> Comentarios
            </div>
            {/* Do not show email for other users (privacy) unless API allows it, usually hidden */}
            {isOwnProfile && (
                <div>
                  <strong>{userToDisplay?.email}</strong>
                </div>
            )}
          </div>
          
           <div style={{ marginTop: '20px', fontSize: '0.8em', color: 'var(--navbar-text)', opacity: 0.7 }}>
            <p>ID de Usuario: {userToDisplay?.id}</p>
            <p>Miembro desde: {userToDisplay?.created_at ? new Date(userToDisplay.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>

        </div>
      </div>
    </div>
  );
};
