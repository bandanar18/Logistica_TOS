import React, { useState, useEffect } from 'react';
import { 
  Package, Search, MapPin, Layers, RefreshCw, 
  ArrowUpRight, Box, Archive, Filter, Plus, 
  ChevronRight, MoreVertical, Download
} from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import './InventoryPage.css';

export default function InventoryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Catalog states
  const [warehouses, setWarehouses] = useState([]);
  const [units, setUnits] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/storage/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setItems(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalogs = async () => {
    try {
      const [resW, resU] = await Promise.all([
        fetch(`${API_BASE_URL}/storage/warehouses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/catalogs/UNIT_MEASURES`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (resW.ok) setWarehouses((await resW.json()).data || []);
      if (resU.ok) setUnits((await resU.json()).data?.items || []);
    } catch (err) {
      console.error('Error fetching catalogs:', err);
    }
  };

  const fetchLocations = async (warehouseId) => {
    if (!warehouseId) return;
    setLoadingLocations(true);
    try {
      const res = await fetch(`${API_BASE_URL}/storage/warehouses/${warehouseId}/locations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setLocations((await res.json()).data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCatalogs();
  }, [token]);

  const filteredItems = items.filter(item => 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuantity = items.reduce((acc, item) => acc + Number(item.quantity), 0);
  const uniqueWarehouses = [...new Set(items.map(item => item.warehouse?.id))].filter(Boolean).length;

  // Handlers
  const handleReceiveSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      sku: formData.get('sku'),
      description: formData.get('description'),
      quantity: Number(formData.get('quantity')),
      unit: { id: Number(formData.get('unitId')) },
      warehouse: { id: Number(formData.get('warehouseId')) },
      location: { id: Number(formData.get('locationId')) }
    };

    try {
      const res = await fetch(`${API_BASE_URL}/storage/receipts`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setShowReceiveModal(false);
        fetchData();
      } else {
        alert('Error al recibir carga');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const locationId = Number(formData.get('locationId'));

    try {
      const res = await fetch(`${API_BASE_URL}/storage/items/${selectedItem.id}/move`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ toLocationId: locationId })
      });
      if (res.ok) {
        setShowMoveModal(false);
        fetchData();
      } else {
        alert('Error al mover mercancía');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Inventario y Almacenamiento">
      <div className="inventory-container">
        
        {/* Header Section */}
        <div className="inventory-header animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-end">
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', color: 'var(--color-primary-dark)' }}>
                Gestión de Custodia <span className="animate-bounce-subtle">📦</span>
              </h2>
              <p className="text-muted" style={{ fontWeight: 500, fontSize: '1.1rem' }}>
                Monitoreo en tiempo real de mercancía y ubicaciones físicas en puerto.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-ghost" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
                <Download size={16} /> Exportar
              </button>
              <button className="btn btn-primary" onClick={() => setShowReceiveModal(true)}>
                <Plus size={16} /> Recibir Carga
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="inventory-stats animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="inventory-stat-card">
            <div className="inventory-stat-icon" style={{ background: 'var(--color-info-light)', color: 'var(--color-info)' }}>
              <Archive size={28} />
            </div>
            <div className="inventory-stat-info">
              <span className="inventory-stat-label">Total SKUs</span>
              <span className="inventory-stat-value">{items.length}</span>
            </div>
            <ArrowUpRight size={20} style={{ position: 'absolute', top: 20, right: 20, color: 'var(--color-text-muted)' }} />
          </div>

          <div className="inventory-stat-card">
            <div className="inventory-stat-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
              <Box size={28} />
            </div>
            <div className="inventory-stat-info">
              <span className="inventory-stat-label">Stock Total</span>
              <span className="inventory-stat-value">{totalQuantity.toLocaleString()}</span>
            </div>
          </div>

          <div className="inventory-stat-card">
            <div className="inventory-stat-icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
              <MapPin size={28} />
            </div>
            <div className="inventory-stat-info">
              <span className="inventory-stat-label">Almacenes</span>
              <span className="inventory-stat-value">{uniqueWarehouses}</span>
            </div>
          </div>

          <div className="inventory-stat-card">
            <div className="inventory-stat-icon" style={{ background: 'rgba(var(--color-primary-rgb), 0.1)', color: 'var(--color-primary)' }}>
              <RefreshCw size={28} />
            </div>
            <div className="inventory-stat-info">
              <span className="inventory-stat-label">Capacidad</span>
              <span className="inventory-stat-value">84%</span>
            </div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="inventory-actions-bar animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="inventory-search-wrapper">
            <Search className="inventory-search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por SKU, descripción o número de orden..." 
              className="form-input inventory-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" style={{ height: '48px', padding: '0 24px' }}>
            <Filter size={18} /> <span style={{ marginLeft: '8px' }}>Filtros</span>
          </button>
          <button onClick={fetchData} className="btn btn-ghost" style={{ width: '48px', height: '48px', padding: 0, borderRadius: '12px', background: 'var(--color-bg)' }}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Table Section */}
        <div className="inventory-table-container animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>SKU / Producto</th>
                <th>Almacén / Depósito</th>
                <th>Ubicación</th>
                <th>Cantidad</th>
                <th>Orden Ref.</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '64px' }}>
                    <div className="spinner" style={{ margin: '0 auto', width: '32px', height: '32px' }}></div>
                    <p className="mt-4 text-muted font-semibold">Consultando inventario físico...</p>
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '64px' }}>
                    <Package size={48} style={{ color: 'var(--color-border)', marginBottom: '16px' }} />
                    <p className="text-lg font-bold text-muted">No se encontraron registros</p>
                    <p className="text-sm text-muted">Prueba con otros términos de búsqueda.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="item-sku-cell">
                        <span className="item-sku-title">{item.sku}</span>
                        <span className="item-sku-subtitle">{item.description}</span>
                      </div>
                    </td>
                    <td>
                      <div className="warehouse-info">
                        <div className="status-dot active"></div>
                        <span>{item.warehouse?.warehouseName || 'Almacén Central'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="location-badge">
                        <Layers size={12} />
                        {item.location?.locationCode || 'ZONA-RECEPCION'}
                      </div>
                    </td>
                    <td>
                      <div className="quantity-badge">
                        {item.quantity}
                        <span className="unit-tag">{item.unit?.name || 'UN'}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        {item.order?.orderCode || 'STOCK-INI'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-ghost btn-sm" style={{ padding: '6px' }}>
                          <MoreVertical size={16} />
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          style={{ borderRadius: '8px', padding: '6px 12px' }}
                          onClick={() => {
                            setSelectedItem(item);
                            setLocations([]);
                            setShowMoveModal(true);
                            if (item.warehouse?.id) fetchLocations(item.warehouse.id);
                          }}
                        >
                          Mover <ChevronRight size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Table Footer */}
          <div style={{ padding: '16px 24px', background: 'var(--color-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="text-xs text-muted font-bold uppercase letter-spacing-1">
              Mostrando {filteredItems.length} de {items.length} productos registrados
            </p>
            <div className="flex gap-2">
              <button className="btn btn-ghost btn-sm" disabled>Anterior</button>
              <button className="btn btn-primary btn-sm" style={{ width: '32px', padding: 0 }}>1</button>
              <button className="btn btn-ghost btn-sm" disabled>Siguiente</button>
            </div>
          </div>
        </div>

      </div>

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Recibir Mercancía</h3>
              <button className="btn btn-ghost" onClick={() => setShowReceiveModal(false)}>×</button>
            </div>
            <form onSubmit={handleReceiveSubmit} className="modal-body">
              <div className="inventory-form-grid">
                <div className="form-group">
                  <label className="form-label">SKU / Código</label>
                  <input name="sku" className="form-input" placeholder="Ej: CARGO-001" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Unidad</label>
                  <select name="unitId" className="form-select" required>
                    <option value="">Seleccionar...</option>
                    {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group mt-4">
                <label className="form-label">Descripción</label>
                <input name="description" className="form-input" placeholder="Descripción de la mercancía" required />
              </div>
              <div className="inventory-form-grid mt-4">
                <div className="form-group">
                  <label className="form-label">Cantidad</label>
                  <input name="quantity" type="number" step="0.01" className="form-input" placeholder="0.00" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Almacén</label>
                  <select 
                    name="warehouseId" 
                    className="form-select" 
                    required
                    onChange={(e) => fetchLocations(e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.warehouseName}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group mt-4">
                <label className="form-label">Ubicación Física</label>
                <select name="locationId" className="form-select" required disabled={loadingLocations}>
                  <option value="">{loadingLocations ? 'Cargando...' : 'Seleccionar ubicación...'}</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.locationCode} ({l.zone})</option>)}
                </select>
              </div>
              <div className="inventory-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowReceiveModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Registrar Ingreso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Move Modal */}
      {showMoveModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Mover Mercancía</h3>
              <button className="btn btn-ghost" onClick={() => setShowMoveModal(false)}>×</button>
            </div>
            <form onSubmit={handleMoveSubmit} className="modal-body">
              <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <p className="text-xs text-muted font-bold uppercase">Item Seleccionado</p>
                <p className="font-bold">{selectedItem.sku} - {selectedItem.description}</p>
                <p className="text-sm text-muted">Ubicación actual: {selectedItem.location?.locationCode || 'N/A'}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Seleccionar Nuevo Almacén (Opcional)</label>
                <select 
                  className="form-select" 
                  defaultValue={selectedItem.warehouse?.id}
                  onChange={(e) => fetchLocations(e.target.value)}
                >
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.warehouseName}</option>)}
                </select>
              </div>

              <div className="form-group mt-4">
                <label className="form-label">Nueva Ubicación Destino</label>
                <select name="locationId" className="form-select" required disabled={loadingLocations}>
                  <option value="">{loadingLocations ? 'Cargando...' : 'Seleccionar nueva ubicación...'}</option>
                  {locations.filter(l => l.id !== selectedItem.location?.id).map(l => (
                    <option key={l.id} value={l.id}>{l.locationCode} ({l.zone})</option>
                  ))}
                </select>
              </div>

              <div className="inventory-modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowMoveModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Confirmar Movimiento</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

