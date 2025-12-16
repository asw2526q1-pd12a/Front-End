// src/components/ui/FileInput.jsx
import React from 'react';

export const FileInput = ({ label, file, setFile, id, accept = "image/png,image/jpeg,image/gif" }) => (
  <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <span style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#1F2937' }}>
      {label}
    </span>
    <label
      htmlFor={id}
      style={{
        width: '100%',
        border: file ? '2px solid #4F46E5' : '2px dashed #9CA3AF',
        borderRadius: '10px',
        // --- CORRECCIÓN DE TAMAÑO ---
        height: '80px',              // Reducido de 110px a 80px
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor: file ? '#EEF2FF' : '#F9FAFB',
        transition: 'all 0.2s',
        color: file ? '#4F46E5' : '#4B5563',
        fontSize: '13px',            // Fuente ligeramente más pequeña
        textAlign: 'center',
      }}
      onMouseOver={(e) => !file && (e.currentTarget.style.backgroundColor = '#F3F4F6')}
      onMouseOut={(e) => !file && (e.currentTarget.style.backgroundColor = '#F9FAFB')}
    >
      {file ? (
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
             <span style={{fontWeight: 'bold'}}>Seleccionado:</span> {file.name}
        </div>
      ) : (
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {/* Icono simple con CSS para ahorrar espacio */}
            <div style={{ width: '24px', height: '24px', border: '2px solid currentColor', borderRadius: '4px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '12px', height: '2px', backgroundColor: 'currentColor', transform: 'translate(-50%, -50%)' }}></div>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: '2px', height: '12px', backgroundColor: 'currentColor', transform: 'translate(-50%, -50%)' }}></div>
            </div>
            <span>Clic para subir imagen <span style={{fontSize: '11px', opacity: 0.8}}>(JPG, PNG)</span></span>
        </div>
      )}
    </label>
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={(e) => setFile(e.target.files[0])}
      style={{ display: 'none' }}
    />
  </div>
);