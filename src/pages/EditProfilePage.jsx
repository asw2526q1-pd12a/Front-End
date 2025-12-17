import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { updateCurrentUser, deleteCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '../components/ui/TextInput';
import { FileInput } from '../components/ui/FileInput';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ErrorAlert } from '../components/ui/ErrorAlert';

export default function EditProfilePage() {
    const { user, logout, updateUser } = useUser(); 
    const navigate = useNavigate();
    
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setBio(user.bio || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

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
            const apiErrors = err.response?.data?.errors;
            setErrors(apiErrors ? (Array.isArray(apiErrors) ? apiErrors : [apiErrors]) : ["Error al actualizar el perfil."]);
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
                setErrors(["Error al eliminar la cuenta."]);
                setLoading(false);
            }
        }
    };

    if (!user) return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
            <p style={{ color: '#6B7280' }}>Cargando datos del usuario...</p>
        </main>
    );

    return (
        <main style={{ 
            minHeight: '100vh', 
            backgroundColor: '#ffffff', 
            display: 'flex',             
            justifyContent: 'center',    
            alignItems: 'center',        
            padding: '20px'              
        }}>
            {/* CAJA CONTENEDORA MINIMALISTA */}
            <div style={{ 
                width: '100%', 
                maxWidth: '550px',       
                backgroundColor: '#ffffff', 
                borderRadius: '16px',    
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
                padding: '40px',
                border: '1px solid #E5E7EB'
            }}>
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '37px', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
                        Editar Perfil
                    </h2>
                    <p style={{ color: '#4B5563', fontSize: '15px', margin: 0 }}>
                        Gestiona tu información personal
                    </p>
                </div>

                <ErrorAlert errors={errors} />

                <form onSubmit={handleSubmit}>
                    
                    {/* Campos Bloqueados (Lectura) */}
                    <div style={{ opacity: 0.6, marginBottom: '20px' }}>
                        <TextInput 
                            label="Nombre de Usuario (no editable)"
                            value={user.username || ''} 
                            disabled
                        />
                    </div>

                    <TextInput 
                        label="Nombre Completo"
                        placeholder="Tu nombre real..."
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />

                    {/* Área de Biografía Estilizada */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                            Biografía
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Cuéntanos algo sobre ti..."
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '14px',
                                outline: 'none',
                                backgroundColor: '#F9FAFB',
                                color: '#111827',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                    </div>

                    {/* --- PREVISUALIZACIÓN Y CARGA DE IMÁGENES --- */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
                            Avatar
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {user.avatar_url && (
                                <img 
                                    src={`${user.avatar_url}?t=${user._lastRefreshed}`} 
                                    alt="Actual" 
                                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #E5E7EB' }} 
                                />
                            )}
                            <FileInput 
                                id="avatar-input" 
                                label="" 
                                file={avatar} 
                                setFile={setAvatar} 
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '35px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
                            Banner
                        </label>
                        {user.banner_url && (
                            <img 
                                src={`${user.banner_url}?t=${user._lastRefreshed}`} 
                                alt="Banner" 
                                style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px', border: '1px solid #E5E7EB' }} 
                            />
                        )}
                        <FileInput 
                            id="banner-input" 
                            label="" 
                            file={banner} 
                            setFile={setBanner} 
                        />
                    </div>

                    {/* ACCIONES */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </PrimaryButton>
                        
                        <button 
                            type="button" 
                            onClick={() => navigate('/profile')}
                            style={{
                                width: '100%',
                                backgroundColor: 'transparent',
                                color: '#6B7280',
                                fontWeight: '600',
                                padding: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textDecoration: 'underline'
                            }}
                        >
                            Cancelar
                        </button>

                        <div style={{ borderTop: '1px solid #F3F4F6', marginTop: '10px', paddingTop: '15px' }}>
                            <button 
                                type="button" 
                                onClick={handleDelete}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#FEF2F2',
                                    color: '#B91C1C',
                                    fontWeight: '600',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #FCA5A5',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                Borrar mi cuenta definitivamente
                            </button>
                        </div>
                    </div>
                    
                </form>
            </div>
        </main>
    );
}