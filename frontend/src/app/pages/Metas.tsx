import React, { useState, useEffect } from 'react';

interface MetaAhorro {
    id: number;
    nombre: string;
    montoObjetivo: number;
    montoActual: number;
    montoRestante: number;
    porcentajeAvance: number;
    estado: string;
    fechaLimite: string;
}

export default function Metas() {
    const [metas, setMetas] = useState<MetaAhorro[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        nombre: '',
        montoObjetivo: '',
        montoActual: '0',
        fechaLimite: ''
    });

    const API_URL = "https://personal-finance-manager3.onrender.com/api/metas";

    useEffect(() => {
        obtenerMetas();
    }, []);

    const obtenerMetas = async () => {
        try {
            const res = await fetch(API_URL);
            if (res.ok) {
                const data = await res.json();
                setMetas(data);
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const bodyData = {
            nombre: formData.nombre,
            montoObjetivo: parseFloat(formData.montoObjetivo),
            montoActual: parseFloat(formData.montoActual || '0'),
            fechaLimite: formData.fechaLimite
        };

        try {
            let res;
            if (isEditing && selectedId) {
                res = await fetch(`${API_URL}/${selectedId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyData)
                });
            } else {
                res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyData)
                });
            }
            if (res.ok) {
                obtenerMetas();
                closeModal();
            }
        } catch (error) {
            console.error("Error al guardar la meta:", error);
        }
    };

    const handleEliminar = async (id: number) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta meta de ahorro?")) {
            try {
                const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (res.ok) obtenerMetas();
            } catch (error) {
                console.error("Error al eliminar la meta:", error);
            }
        }
    };

    const openEditModal = (meta: MetaAhorro) => {
        setIsEditing(true);
        setSelectedId(meta.id);
        setFormData({
            nombre: meta.nombre,
            montoObjetivo: meta.montoObjetivo.toString(),
            montoActual: meta.montoActual.toString(),
            fechaLimite: meta.fechaLimite
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setSelectedId(null);
    };

    return (
        <div style={{ padding: '20px 40px', backgroundColor: '#F4F6FA', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            {/* Encabezado de la página */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.5rem', color: '#6B7280', cursor: 'pointer' }}>←</span>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>Registrar Ahorro</h1>
                    <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: '4px 0 0 0' }}>Metas de Ahorro / Monitorea y gestiona tus objetivos financieros</p>
                </div>
            </div>

            {/* Contenedor principal de tarjetas */}
            <section style={{ background: '#FFFFFF', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>🎯 Metas de Ahorro</h2>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '4px', margin: 0 }}>Gestiona tus objetivos financieros a corto y largo plazo</p>
                    </div>
                    <button 
                        style={{ backgroundColor: '#4F46E5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
                        onClick={() => { setIsEditing(false); setFormData({ nombre: '', montoObjetivo: '', montoActual: '0', fechaLimite: '' }); setIsModalOpen(true); }}
                    >
                        + Nueva Meta
                    </button>
                </div>

                {/* Grid con las metas mapeadas del backend */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                    {metas.map((meta) => {
                        const esCompletada = meta.estado === "COMPLETADA" || meta.porcentajeAvance >= 100;
                        return (
                            <div key={meta.id} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: esCompletada ? '5px solid #10B981' : '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1F2937', margin: 0 }}>{meta.nombre}</h3>
                                    <div>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }} onClick={() => openEditModal(meta)}>✏️</button>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleEliminar(meta.id)}>🗑️</button>
                                    </div>
                                </div>
                                <span style={{ alignSelf: 'flex-start', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: esCompletada ? '#D1FAE5' : '#E0E7FF', color: esCompletada ? '#065F46' : '#4338CA' }}>
                                    {esCompletada ? 'Completada' : 'En progreso'}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ backgroundColor: '#E2E8F0', height: '8px', borderRadius: '4px', flex: 1, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(meta.porcentajeAvance, 100)}%`, backgroundColor: esCompletada ? '#10B981' : '#4F46E5' }}></div>
                                    </div>
                                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{Math.round(meta.porcentajeAvance)}%</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{ fontSize: '1.35rem', fontWeight: '700' }}>${meta.montoActual.toLocaleString()}</span>
                                    <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>de ${meta.montoObjetivo.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6B7280', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                                    <span>{esCompletada ? '✅ ¡Meta alcanzada!' : `⏳ Faltan $${meta.montoRestante.toLocaleString()}`}</span>
                                    <span>Límite: {meta.fechaLimite}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Modal para Crear/Editar */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '24px', width: '100%', maxWidth: '460px' }}>
                        <h3 style={{ fontWeight: '700', marginBottom: '20px', marginTop: 0 }}>{isEditing ? 'Modificar Meta' : 'Detalles de la Meta'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Nombre de la meta *</label>
                                <input type="text" style={{ padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0' }} value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Monto Objetivo *</label>
                                <input type="number" style={{ padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0' }} value={formData.montoObjetivo} onChange={(e) => setFormData({...formData, montoObjetivo: e.target.value})} required />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Monto Actual</label>
                                <input type="number" style={{ padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0' }} value={formData.montoActual} onChange={(e) => setFormData({...formData, montoActual: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Fecha Límite *</label>
                                <input type="date" style={{ padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0' }} value={formData.fechaLimite} onChange={(e) => setFormData({...formData, fechaLimite: e.target.value})} required />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button type="button" style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'none', cursor: 'pointer' }} onClick={closeModal}>Cancelar</button>
                                <button type="submit" style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#4F46E5', color: 'white', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
