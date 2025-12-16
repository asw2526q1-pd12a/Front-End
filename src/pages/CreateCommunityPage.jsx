// src/pages/CreateCommunityPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from '../services/api';
import { TextInput } from '../components/ui/TextInput';
import { FileInput } from '../components/ui/FileInput';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ErrorAlert } from '../components/ui/ErrorAlert';

export default function CreateCommunityPage() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const formData = new FormData();
        formData.append('community[name]', name);
        formData.append('community[title]', title);
        if (avatar) formData.append('community[avatar]', avatar);
        if (banner) formData.append('community[banner]', banner);

        try {
            const response = await createCommunity(formData);
            navigate(`/c/${response.data.name}`);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors(["Ocurrió un error inesperado."]);
            }
        }
    };

    return (
        <main style={{ 
            minHeight: '50vh', 
            backgroundColor: '#314373',
            display: 'flex',             // Activar Flexbox
            justifyContent: 'center',    // Centrar horizontalmente
            alignItems: 'center',        // Centrar verticalmente
            padding: '40px'              // Un poco de margen para pantallas pequeñas
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '550px',       // Ligeramente más estrecho para un look más compacto
                backgroundColor: '#ffffff', 
                borderRadius: '16px',    // Bordes un poco más redondeados
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // Sombra más suave
                padding: '40px',
                border: '1px solid #E5E7EB'
            }}>
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
                        Crear una comunidad
                    </h2>
                    <p style={{ color: '#4B5563', fontSize: '15px', margin: 0 }}>
                        Configura tu nuevo espacio.
                    </p>
                </div>

                <ErrorAlert errors={errors} />

                <form onSubmit={handleSubmit}>
                    <TextInput 
                        label="Identificador"
                        placeholder="ej. programacion_avanzada"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        helperText="Sin espacios. Solo letras, números y guiones bajos."
                    />

                    <TextInput 
                        label="Título de la Comunidad"
                        placeholder="El nombre visible (ej. Programación Avanzada)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <div style={{ marginBottom: '20px' }}>
                        <FileInput id="avatar-upload" label="Avatar (Opcional)" file={avatar} setFile={setAvatar} />
                    </div>
                    
                    <div style={{ marginBottom: '30px' }}>
                        <FileInput id="banner-upload" label="Banner (Opcional)" file={banner} setFile={setBanner} />
                    </div>

                    <PrimaryButton type="submit">
                        Crear Comunidad
                    </PrimaryButton>
                </form>
            </div>
        </main>
    );
}