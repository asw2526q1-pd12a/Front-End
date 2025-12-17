import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { updateCurrentUser, deleteCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function EditProfilePage() {
    const { user, logout, updateUser } = useUser(); 
    const navigate = useNavigate();
    
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setBio(user.bio || '');
        }
    }, [user]);

    const handleFileChange = (e, setter) => {
        if (e.target.files && e.target.files[0]) {
            setter(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('user[full_name]', fullName);
        formData.append('user[bio]', bio);
        if (avatar) formData.append('user[avatar]', avatar);
        if (banner) formData.append('user[banner]', banner);

        try {
            const response = await updateCurrentUser(formData);
            if (response.data) {
                 const updatedUser = response.data.user || response.data;
                 updateUser(updatedUser);
                 navigate('/profile');
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Error al actualizar el perfil. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
            setLoading(true);
            try {
                await deleteCurrentUser();
                logout();
                navigate('/');
            } catch (err) {
                console.error("Error deleting account:", err);
                setError("Error al eliminar la cuenta.");
                setLoading(false);
            }
        }
    };

    if (!user) return <div style={{padding: '20px'}}>Cargando o no autenticado...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            <h1 style={{ marginBottom: '20px' }}>Editar Perfil</h1>
            
            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre de usuario</label>
                    <input 
                        type="text" 
                        value={user.username || ''} 
                        disabled
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--navbar-bg)', color: 'var(--text-color)', opacity: 0.7, cursor: 'not-allowed' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Correo electrónico</label>
                    <input 
                        type="email" 
                        value={user.email || ''} 
                        disabled
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--navbar-bg)', color: 'var(--text-color)', opacity: 0.7, cursor: 'not-allowed' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre Completo</label>
                    <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Biografía</label>
                    <textarea 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px', backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Avatar</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {user.avatar_url && (
                            <img 
                                src={`${user.avatar_url}?t=${user._lastRefreshed}`} 
                                alt="Avatar Actual" 
                                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} 
                            />
                        )}
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, setAvatar)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Banner</label>
                    {user.banner_url && (
                        <div style={{ marginBottom: '10px' }}>
                            <img 
                                src={`${user.banner_url}?t=${user._lastRefreshed}`} 
                                alt="Banner Actual" 
                                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} 
                            />
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setBanner)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="nav-button primary-button"
                            style={{ padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/profile')}
                            className="nav-button"
                            style={{ padding: '10px 20px', backgroundColor: 'transparent', border: '1px solid #ccc' }}
                        >
                            Cancelar
                        </button>
                    </div>
                    
                    <button 
                        type="button" 
                        onClick={handleDelete}
                        className="nav-button"
                        style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        Borrar Cuenta
                    </button>
                </div>
            </form>
        </div>
    );
}
