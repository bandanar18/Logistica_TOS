import { useState, useEffect } from 'react';
import { Save, MapPin, Building, Palette, Upload, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import '../Client/ClientDashboard.css';

export default function StoreProfileSettings() {
  const { token } = useAuth();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    legalName: '',
    description: '',
    basePort: '',
    brandColor: '#1A3C5E',
    taxId: ''
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/stores/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Store not found');
        return res.json();
      })
      .then(data => {
        setStore(data);
        setForm({
          legalName: data.legalName || '',
          description: data.description || '',
          basePort: data.basePort || '',
          brandColor: data.brandColor || '#1A3C5E',
          taxId: data.taxId || ''
        });
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/stores/me`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updated = await res.json();
        setStore(updated);
        alert('Perfil actualizado correctamente');
      }
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    }
  };

  if (loading) return <DashboardLayout title="Mi Perfil"><p>Cargando...</p></DashboardLayout>;

  return (
    <DashboardLayout title="Mi Perfil">
      <div className="dash-welcome" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h2>Configuración del Perfil</h2>
          <p className="text-muted text-sm mt-1">Gestiona la información pública de tu tienda en el marketplace.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          <Save size={16} /> Guardar cambios
        </button>
      </div>

      <div className="dash-grid-2">
        {/* Main Info */}
        <div className="dash-section">
          <h3 className="section-title" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={18} className="text-muted" /> Información General
          </h3>
          <form className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Nombre Legal de la Empresa</label>
              <input
                type="text"
                className="form-input"
                value={form.legalName}
                onChange={e => setForm({ ...form, legalName: e.target.value })}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Descripción Pública</label>
              <textarea
                className="form-textarea"
                rows="4"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <p className="text-xs text-muted">Esta descripción aparecerá en tu perfil público.</p>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Puerto Principal</label>
                <select 
                  className="form-select" 
                  value={form.basePort}
                  onChange={e => setForm({ ...form, basePort: e.target.value })}
                >
                  <option>Puerto La Guaira</option>
                  <option>Puerto Cabello</option>
                  <option>Puerto Maracaibo</option>
                  <option>Puerto de Guanta</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tiempo de respuesta</label>
                <input
                  type="text"
                  className="form-input"
                  value={form.responseTime}
                  onChange={e => setForm({ ...form, responseTime: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">RIF / Tax ID</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={form.taxId}
                  onChange={e => setForm({ ...form, taxId: e.target.value })}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Branding & Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="dash-section">
            <h3 className="section-title" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={18} className="text-muted" /> Identidad Visual
            </h3>
            
            <div className="mt-4" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
              <div className="store-avatar" style={{ background: form.brandColor, width: 80, height: 80, fontSize: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}>
                {form.legalName ? form.legalName.substring(0, 2).toUpperCase() : 'ST'}
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label mb-2">Color de la marca</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {['#1A3C5E', '#2A5F8F', '#2E7D32', '#E65100', '#0277BD', '#7B1FA2'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({ ...form, brandColor: color })}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: color,
                        border: form.brandColor === color ? '3px solid white' : 'none',
                        boxShadow: form.brandColor === color ? `0 0 0 2px ${color}` : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="form-label mb-2">Logo de la empresa</label>
              <div className="file-upload-zone" style={{ padding: 'var(--space-5)' }}>
                <Upload size={20} className="text-muted" />
                <p className="text-sm text-muted">Haz clic para subir un logo (JPG, PNG)</p>
              </div>
            </div>
          </div>

          <div className="dash-section" style={{ background: 'var(--color-bg)' }}>
            <h3 className="section-title" style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} className="text-success" /> Estado de Verificación
            </h3>
            <div className="mt-3">
              {store?.status === 'approved' ? (
                <div>
                  <span className="badge badge-success mb-2">Tienda Verificada</span>
                  <p className="text-sm text-muted">Tu documentación ha sido validada. Tienes acceso completo a todas las funcionalidades del marketplace y mayor visibilidad en las búsquedas.</p>
                </div>
              ) : (
                <div>
                  <span className="badge badge-warning mb-2">Pendiente de Verificación</span>
                  <p className="text-sm text-muted">Por favor, sube los documentos legales requeridos en la sección de Documentos para obtener el check de verificación.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
