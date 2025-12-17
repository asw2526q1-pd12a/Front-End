import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { getUserById, getUserPosts, getUserComments, getCurrentUserSavedPosts, getCurrentUserSavedComments } from '../services/api'; // Added feed API methods
import PostCard from '../components/PostCard';
import CommentCard from '../components/CommentCard';
import Sorter from '../components/Sorter';
import ViewSwitch from '../components/ViewSwitch';

export default function ProfilePage() {
  const { user: currentUser, loading: contextLoading, error: contextError } = useUser();
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Feed State
  const queryParams = new URLSearchParams(location.search);
  const currentView = queryParams.get('view') || 'posts';
  const sort = queryParams.get('sort') || 'new';

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Feed Data State
  const [feedItems, setFeedItems] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false); // Toggle for saved items

  // Feed Data State
  const [feedItems, setFeedItems] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false); // Toggle for saved items

  // Determine if we are viewing our own profile or another user's
  const isOwnProfile = !userId || (currentUser && currentUser.id === parseInt(userId));

  // 1. Fetch User Profile
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

  // 2. Fetch User Feed (Posts/Comments)
  useEffect(() => {
    // We need a user ID to fetch their content.
    // If it's your own profile, wait for currentUser to be available.
    // If it's another user, wait for profileUser (fetched above) OR just use userId from params.
    // Using profileUser is safer to ensure existence, but userId is faster if valid.

    const targetId = userId || (currentUser?.id);

    if (!targetId) return;

    const fetchFeed = async () => {
      setFeedLoading(true);
      setFeedError(null);
      try {
        let response;
        // Determine which API to call based on view and saved toggle
        if (currentView === 'posts') {
          if (showSavedOnly && isOwnProfile) {
            response = await getCurrentUserSavedPosts(sort);
          } else {
            response = await getUserPosts(targetId, sort);
          }
        } else { // comments
          if (showSavedOnly && isOwnProfile) {
            response = await getCurrentUserSavedComments(sort);
          } else {
            response = await getUserComments(targetId, sort);
          }
        }
        // Normalize response
        const data = response.data.posts || response.data.comments || response.data;
        setFeedItems(data || []);
      } catch (err) {
        console.error("Error fetching user feed:", err);
        setFeedError("No se pudo cargar la actividad del usuario.");
      } finally {
        setFeedLoading(false);
      }
    };

    fetchFeed();
  }, [userId, currentUser, currentView, sort, showSavedOnly, isOwnProfile]); // Added showSavedOnly and isOwnProfile


  // --- HANDLERS ---
  const handleViewChange = (newView) => {
    const params = new URLSearchParams(location.search);
    params.set('view', newView);
    params.set('sort', 'new'); // Reset sort on view switch
    navigate(`${location.pathname}?${params.toString()}`);
    setShowSavedOnly(false); // Reset saved toggle when changing view
  };

  // Handle loading state for profile only (feed has its own loading)
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

  // Handle case where no user data is available yet
  if (!profileUser) {
    if (isOwnProfile) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>No identificado</h2>
          <p>Por favor selecciona un usuario.</p>
        </div>
      );
    }
    return null;
  }

  const userToDisplay = profileUser;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
      {/* --- PROFILE CARD --- */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', marginBottom: '30px' }}>
        {/* Banner */}
        <div style={{ height: '150px', backgroundColor: 'var(--navbar-border)', backgroundImage: userToDisplay?.banner_url ? `url(${userToDisplay.banner_url}?t=${userToDisplay._lastRefreshed})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          {!userToDisplay?.banner_url && <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--navbar-text)' }}>Sin Banner</div>}
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
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#fff', backgroundColor: 'var(--navbar-text)' }}>
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

      {/* --- ACTIVITY FEED --- */}
      <div>
        {/* Primera fila: ViewSwitch y Sorter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <ViewSwitch currentView={currentView} onViewChange={handleViewChange} />
          <Sorter type={currentView} />
        </div>

        {/* Segunda fila: Toggle de guardados (solo en propio perfil) */}
        {isOwnProfile && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: showSavedOnly ? '#FEF3C7' : '#F3F4F6',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: showSavedOnly ? '#F59E0B' : '#6B7280',
              transition: 'all 0.2s',
              border: showSavedOnly ? '2px solid #F59E0B' : '2px solid transparent'
            }}>
              <input
                type="checkbox"
                checked={showSavedOnly}
                onChange={(e) => setShowSavedOnly(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              🔖 Guardados
            </label>
          </div>
        )}

        {feedLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Cargando actividad...</div>
        ) : feedError ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#EF4444' }}>{feedError}</div>
        ) : feedItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {showSavedOnly
              ? `🔖 No has guardado ning${currentView === 'posts' ? 'una publicación' : 'ún comentario'} aún.`
              : `Este usuario no tiene ${currentView === 'posts' ? 'publicaciones' : 'comentarios'} aún.`
            }
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentView === 'posts' && feedItems.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
            {currentView === 'comments' && feedItems.map(comment => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
