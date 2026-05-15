import { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import '../Client/ClientDashboard.css';

import API_BASE_URL from '../../../config/api';

export default function StoreServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    categoryId: '',
    billingUnit: 'Viaje',
    basePrice: '',
    description: '',
    status: 'draft'
  });

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/store`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setServices(Array.isArray(json) ? json : (json.data || []));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCatalogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/catalogs/SERVICE_CATEGORIES`);
      if (res.ok) {
        const json = await res.json();
        const items = json.data?.items || json.items || [];
        setCategories(items);
        if (items.length > 0 && !editingId) {
          setForm(prev => ({ ...prev, categoryId: items[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchServices(), fetchCatalogs()]).finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `${API_BASE_URL}/services/${editingId}` : `${API_BASE_URL}/services`;
      
      const payload = {
        name: form.name,
        code: form.code,
        description: form.description,
        basePrice: parseFloat(form.basePrice),
        billingUnit: form.billingUnit,
        category: { id: form.categoryId },
        status: form.status
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchServices();
        handleCloseModal();
      } else {
        const json = await res.json();
        alert(json.message || 'Error al guardar servicio');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red');
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      code: service.code,
      categoryId: service.category?.id || categories[0]?.id || '',
      billingUnit: service.billingUnit,
      basePrice: service.basePrice,
      description: service.description,
      status: service.status
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setForm({ name: '', code: '', categoryId: categories[0]?.id || '', billingUnit: 'Viaje', basePrice: '', description: '', status: 'draft' });
  };

  return (
    <DashboardLayout title="Mis Servicios">
      <div className="dash-welcome">
        <div>
          <h2>Catálogo de Servicios</h2>
          <p className="text-muted text-sm mt-1">Administra los servicios que ofreces en el marketplace.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Añadir Servicio
        </button>
      </div>

      <div className="dash-section" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="text" className="form-input" placeholder="Buscar servicio..." style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 6, paddingBottom: 6 }} />
          </div>
          <button className="btn btn-ghost btn-sm">
            <Filter size={14} /> Filtros
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Servicio</th>
                <th style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categoría</th>
                <th style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio Base</th>
                <th style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unidad</th>
                <th style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estado</th>
                <th style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: 'var(--space-4) var(--space-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{service.name}</p>
                        <p className="text-xs text-muted">{service.code}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4) var(--space-5)', fontSize: '0.875rem' }}>{service.category?.name || '-'}</td>
                  <td style={{ padding: 'var(--space-4) var(--space-5)', fontSize: '0.875rem', fontWeight: 600 }}>USD {service.basePrice}</td>
                  <td style={{ padding: 'var(--space-4) var(--space-5)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Por {service.billingUnit}</td>
                  <td style={{ padding: 'var(--space-4) var(--space-5)' }}>
                    <button 
                      onClick={() => handleUpdateStatus(service.id, service.status === 'published' ? 'paused' : 'published')}
                      className={`badge ${service.status === 'published' ? 'badge-aprobado' : 'badge-warning'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {service.status === 'published' ? 'Publicado' : service.status === 'paused' ? 'Pausado' : 'Borrador'}
                    </button>
                  </td>
                  <td style={{ padding: 'var(--space-4) var(--space-5)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(service)} title="Editar">
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(service.id)} style={{ color: 'var(--color-danger)' }} title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{editingId ? 'Editar Servicio' : 'Añadir Nuevo Servicio'}</h3>
              <button className="modal-close-btn" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-4">
                <label className="form-label">Nombre del servicio</label>
                <input type="text" className="form-input" placeholder="Ej: Transporte de carga pesada" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Código</label>
                <input type="text" className="form-input" placeholder="Ej: TRP-001" value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
              </div>
              <div className="grid-2 mb-4">
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Unidad de cobro</label>
                  <select className="form-select" value={form.billingUnit} onChange={e => setForm({...form, billingUnit: e.target.value})}>
                    <option value="Viaje">Viaje</option>
                    <option value="Contenedor">Contenedor</option>
                    <option value="Hora">Hora</option>
                    <option value="Día">Día</option>
                  </select>
                </div>
              </div>
              <div className="grid-2 mb-4">
                <div className="form-group">
                  <label className="form-label">Precio base referencial (USD)</label>
                  <input type="number" className="form-input" placeholder="0.00" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="paused">Pausado</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Descripción del servicio</label>
                <textarea className="form-textarea" rows="3" placeholder="Detalles de lo que incluye el servicio..." value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>Guardar Servicio</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
