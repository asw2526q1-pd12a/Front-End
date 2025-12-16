// src/pages/CreateCommunityPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from '../services/api';

export default function CreateCommunityPage() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    
    // Estado para los campos
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        // Usamos FormData para enviar archivos [cite: 5]
        const formData = new FormData();
        formData.append('community[name]', name);
        formData.append('community[title]', title);
        if (avatar) formData.append('community[avatar]', avatar);
        if (banner) formData.append('community[banner]', banner);

        try {
            const response = await createCommunity(formData);
            // Redirigir a la comunidad creada usando el name devuelto
            navigate(`/c/${response.data.name}`);
        } catch (error) {
            // Manejo de errores de validación de Rails [cite: 29]
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors(["Ocurrió un error inesperado."]);
            }
        }
    };

    return (
        <main className="main-layout">
            <div className="feed-column">
                <div className="post-form-container" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', color: 'black' }}>
                    <h2 className="form-title">Crear una Nueva Comunidad</h2>

                    {errors.length > 0 && (
                        <div style={{ color: 'red', marginBottom: '15px', textAlign: 'left' }}>
                            <h4>{errors.length} error(es) impidió guardar:</h4>
                            <ul>
                                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{textAlign: 'left'}}>
                        {/* CAMPO 1: Nombre [cite: 31] */}
                        <div className="form-field" style={{marginBottom: '15px'}}>
                            <label style={{fontWeight: 'bold'}}>Identificador (sin espacios): </label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="nombre_comunidad" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{display: 'block', width: '100%', padding: '8px', marginTop: '5px'}}
                            />
                            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Solo letras, números y guiones bajos.</p>
                        </div>

                        {/* CAMPO 2: Título [cite: 32] */}
                        <div className="form-field" style={{marginBottom: '15px'}}>
                            <label style={{fontWeight: 'bold'}}>Título: </label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="El título visible de tu comunidad"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{display: 'block', width: '100%', padding: '8px', marginTop: '5px'}}
                            />
                        </div>

                        {/* CAMPO 3: Avatar [cite: 33] */}
                        <div className="form-field" style={{marginBottom: '15px'}}>
                            <label style={{fontWeight: 'bold'}}>Avatar: </label>
                            <input 
                                type="file" 
                                accept="image/png,image/jpeg,image/gif"
                                onChange={(e) => setAvatar(e.target.files[0])}
                                style={{display: 'block', marginTop: '5px'}}
                            />
                        </div>

                        {/* CAMPO 4: Banner [cite: 34] */}
                        <div className="form-field" style={{marginBottom: '15px'}}>
                            <label style={{fontWeight: 'bold'}}>Banner: </label>
                            <input 
                                type="file" 
                                accept="image/png,image/jpeg,image/gif"
                                onChange={(e) => setBanner(e.target.files[0])}
                                style={{display: 'block', marginTop: '5px'}}
                            />
                        </div>

                        <div className="form-actions" style={{ marginTop: '20px' }}>
                            <button type="submit" className="nav-button create-post-button" style={{backgroundColor: '#1a1a1a', color: 'white', padding: '10px 20px'}}>
                                Crear Comunidad
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}