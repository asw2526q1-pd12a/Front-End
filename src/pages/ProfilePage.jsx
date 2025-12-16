import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export default function ProfilePage() {
  const { user, loading, error } = useUser();
  const [imageError, setImageError] = useState(false);

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false);
  }, [user]);

  if (loading) return <div>Loading user data...</div>;
  
  if (error) {
    return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
            <h2>Authentication Error</h2>
            <p>{error}</p>
            <p style={{ color: '#666' }}>Please try selecting a different user or check your API Key.</p>
        </div>
    )
  }
  
  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Guest Mode</h2>
        <p>Please select a user from the simulator in the bottom right corner.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: 'white', color: 'black' }}>
        {/* Banner */}
        <div style={{ height: '150px', backgroundColor: '#e0e0e0', backgroundImage: user?.banner_url ? `url(${user.banner_url})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {!user?.banner_url && <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#888'}}>No Banner</div>}
        </div>
        
        {/* Profile Info */}
        <div style={{ padding: '20px', position: 'relative' }}>
          {/* Avatar */}
          <div style={{ position: 'absolute', top: '-50px', left: '20px', width: '100px', height: '100px', borderRadius: '50%', border: '4px solid white', overflow: 'hidden', backgroundColor: '#ccc' }}>
            {user?.avatar_url && !imageError ? (
              <img 
                src={user.avatar_url} 
                alt={user.username} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
                <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize: '30px', color:'#fff', backgroundColor: '#888'}}>
                    {user?.username?.charAt(0).toUpperCase() || '?'}
                </div>
            )}
          </div>

          <div style={{ marginLeft: '120px', marginBottom: '20px' }}>
            <h1 style={{ margin: '0', fontSize: '24px' }}>{user?.full_name || 'Unknown'}</h1>
            <p style={{ margin: '0', color: '#666' }}>@{user?.username || 'unknown'}</p>
          </div>

          <div style={{ marginTop: '20px' }}>
            {user?.bio ? <p>{user.bio}</p> : <p style={{ fontStyle: 'italic', color: '#888' }}>No bio available</p>}
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <div>
              <strong>{user?.posts_count || 0}</strong> Posts
            </div>
            <div>
              <strong>{user?.comments_count || 0}</strong> Comments
            </div>
            <div>
              <strong>{user?.email}</strong>
            </div>
          </div>
          
           <div style={{ marginTop: '20px', fontSize: '0.8em', color: '#aaa' }}>
            <p>User ID: {user?.id}</p>
            <p>Member Since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>

        </div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px', color:'black' }}>
         <h3>Debug Info</h3>
         <pre style={{ overflowX: 'auto' }}>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
};

