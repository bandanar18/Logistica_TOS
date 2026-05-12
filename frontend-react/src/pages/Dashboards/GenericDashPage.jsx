import { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import './Client/ClientDashboard.css';

const STATUS_MAP = {
  // Common
  pending: { label: 'Pendiente', badge: 'badge-warning' },
  confirmed: { label: 'Confirmado', badge: 'badge-success' },
  rejected: { label: 'Rechazado', badge: 'badge-danger' },
  // Quotations
  responded: { label: 'Respondida', badge: 'badge-info' },
  approved: { label: 'Aprobada', badge: 'badge-success' },
  order_created: { label: 'En Orden', badge: 'badge-muted' },
  // Orders
  in_progress: { label: 'En Proceso', badge: 'badge-info' },
  completed: { label: 'Completada', badge: 'badge-success' },
  cancelled: { label: 'Cancelada', badge: 'badge-danger' },
  // TOS / Storage
  available: { label: 'Disponible', badge: 'badge-success' },
  blocked: { label: 'Bloqueado', badge: 'badge-danger' },
  departed: { label: 'Despachado', badge: 'badge-muted' },
  full: { label: 'Lleno', badge: 'badge-warning' },
  empty: { label: 'Vacío', badge: 'badge-muted' },
  // Transport / Inspections
  scheduled: { label: 'Programado', badge: 'badge-info' },
  in_transit: { label: 'En Tránsito', badge: 'badge-warning' },
  with_observations: { label: 'Con Observaciones', badge: 'badge-warning' },
};

const MODULE_CONFIG = {
  quotations: {
    title: 'Cotizaciones',
    endpoint: 'quotations',
    cols: ['ID', 'Servicio', 'Tienda/Cliente', 'Estado', 'Monto', 'Fecha'],
    mapRow: (q, role) => [
      `COT-${q.id.toString().padStart(4, '0')}`,
      q.service?.name,
      role === 'client' ? q.store?.legalName : q.client?.name,
      q.status,
      q.price ? `USD ${q.price}` : '—',
      new Date(q.createdAt).toLocaleDateString()
    ],
  },
  orders: {
    title: 'Órdenes',
    endpoint: 'orders',
    cols: ['ID', 'Servicio', 'Tienda/Cliente', 'Estado', 'Monto', 'Fecha'],
    mapRow: (o, role) => [
      `ORD-${o.id.toString().padStart(4, '0')}`,
      o.service?.name,
      role === 'client' ? o.store?.legalName : o.client?.name,
      o.status,
      o.finalPrice ? `USD ${o.finalPrice}` : '—',
      new Date(o.createdAt).toLocaleDateString()
    ],
  },
  payments: {
    title: 'Pagos',
    endpoint: 'payments',
    cols: ['ID', 'Orden', 'Método', 'Estado', 'Monto', 'Fecha'],
    mapRow: (p) => [
      `PAY-${p.id.toString().padStart(4, '0')}`,
      `ORD-${p.order?.id?.toString().padStart(4, '0')}`,
      p.paymentMethod,
      p.status,
      `USD ${p.amount}`,
      new Date(p.createdAt).toLocaleDateString()
    ],
  },
  documents: {
    title: 'Documentos',
    endpoint: 'documents',
    cols: ['ID', 'Orden', 'Tipo', 'Nombre', 'Estado', 'Fecha'],
    mapRow: (d) => [
      `DOC-${d.id.toString().padStart(4, '0')}`,
      d.order ? `ORD-${d.order.id.toString().padStart(4, '0')}` : '—',
      d.type,
      d.name,
      d.status,
      new Date(d.createdAt).toLocaleDateString()
    ],
  },
  audit: {
    title: 'Auditoría',
    endpoint: 'audit',
    cols: ['Acción', 'Módulo', 'Usuario', 'Detalles', 'Fecha'],
    mapRow: (l) => [
      l.action,
      l.module,
      l.user?.name || 'Sistema',
      JSON.stringify(l.details),
      new Date(l.createdAt).toLocaleString()
    ],
  },
  users: {
    title: 'Usuarios',
    endpoint: 'users',
    cols: ['Nombre', 'Email', 'Rol', 'Estado', 'Registro'],
    mapRow: (u) => [
      u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
      u.email,
      u.role?.name || '—',
      u.isActive ? 'Activo' : 'Inactivo',
      new Date(u.createdAt).toLocaleDateString()
    ],
  },
  stores: {
    title: 'Tiendas',
    endpoint: 'stores',
    cols: ['Nombre', 'RIF', 'Puerto', 'Estado', 'Registro'],
    mapRow: (s) => [
      s.legalName,
      s.taxId,
      s.basePort || '—',
      s.status,
      new Date(s.createdAt).toLocaleDateString()
    ],
  },
  services: {
    title: 'Servicios',
    endpoint: 'services',
    cols: ['Nombre', 'Categoría', 'Precio Base', 'Estado'],
    mapRow: (s) => [
      s.name,
      s.category?.name || '—',
      `USD ${s.basePrice}`,
      s.status
    ],
  },
  catalogs: {
    title: 'Catálogos Maestros',
    endpoint: 'catalogs',
    cols: ['Código', 'Nombre', 'Descripción', 'Items'],
    mapRow: (c) => [c.code, c.name, c.description || '—', c.items?.length || 0],
  },
  commissions: {
    title: 'Comisiones',
    endpoint: 'commissions',
    cols: ['ID', 'Orden', 'Tienda', 'Tasa', 'Monto', 'Estado'],
    mapRow: (c) => [
      `COM-${c.id.toString().padStart(4, '0')}`,
      c.order ? `ORD-${c.order.id.toString().padStart(4, '0')}` : '—',
      c.store?.legalName || '—',
      `${c.rate}%`,
      `USD ${c.amount}`,
      c.status,
    ],
  },
  reports: {
    title: 'Reportes',
    endpoint: 'reports',
    cols: ['Usuarios', 'Tiendas', 'Cotizaciones', 'Órdenes', 'Pagos', 'Ingresos confirmados'],
    mapRow: (r) => [r.users, r.stores, r.quotations, r.orders, r.payments, `USD ${r.confirmedRevenue}`],
  },
  tos: {
    title: 'Gestión de Contenedores (TOS)',
    endpoint: 'tos/containers',
    cols: ['Número', 'Tipo', 'Carga', 'Patio', 'Ubicación', 'Estado'],
    mapRow: (c) => [
      c.containerNumber,
      c.type,
      c.loadStatus,
      c.yard?.name || '—',
      c.locationInYard || '—',
      c.status
    ],
  },
  storage: {
    title: 'Inventario (Almacén)',
    endpoint: 'storage/items',
    cols: ['SKU', 'Descripción', 'Cant.', 'Unidad', 'Almacén', 'Ubicación'],
    mapRow: (i) => [
      i.sku,
      i.description,
      i.quantity,
      i.unit,
      i.warehouse?.name || '—',
      i.location ? `${i.location.aisle}-${i.location.shelf}-${i.location.level}` : '—'
    ],
  },
  transport: {
    title: 'Seguimiento de Transporte (Viajes)',
    endpoint: 'transport/trips',
    cols: ['ID', 'Origen', 'Destino', 'Vehículo', 'Conductor', 'Estado'],
    mapRow: (t) => [
      `TRP-${t.id}`,
      t.origin,
      t.destination,
      t.vehicle?.plate || '—',
      t.driver?.fullName || '—',
      t.status
    ],
  },
  inspections: {
    title: 'Inspecciones y Control de Calidad',
    endpoint: 'inspections',
    cols: ['ID', 'Tipo', 'Orden', 'Inspector', 'Fecha Prog.', 'Estado'],
    mapRow: (ins) => [
      `INS-${ins.id}`,
      ins.inspectionType,
      ins.order ? `ORD-${ins.order.id}` : '—',
      ins.inspector?.name || '—',
      ins.scheduledAt ? new Date(ins.scheduledAt).toLocaleDateString() : '—',
      ins.status
    ],
  },
  reviews: {
    title: 'Reseñas y Reputación',
    endpoint: 'reviews',
    cols: ['Cliente', 'Calificación', 'Comentario', 'Orden', 'Fecha'],
    mapRow: (r) => [
      r.user?.name || 'Anónimo',
      '⭐'.repeat(r.rating),
      r.comment,
      r.order ? `ORD-${r.order.id}` : '—',
      new Date(r.createdAt).toLocaleDateString()
    ],
  },
};

export default function GenericDashPage({ title, role, module }) {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const config = MODULE_CONFIG[module] || { title, cols: ['En construcción'], mapRow: () => ['—'] };

  const request = async (path, options = {}) => {
    const res = await fetch(`http://localhost:3000/${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json().catch(() => null);
  };

  const refresh = async () => {
    if (!config.endpoint) return;
    setLoading(true);
    try {
      setData(await request(config.endpoint));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [module, token, config.endpoint]);

  const rows = data.map(item => config.mapRow(item, role));

  const runAction = async (label, item) => {
    try {
      if (module === 'quotations' && label === 'Responder') {
        const price = prompt('Monto de la cotización en USD');
        if (!price) return;
        const responseNotes = prompt('Notas para el cliente') || '';
        await request(`quotations/${item.id}/respond`, { method: 'PATCH', body: JSON.stringify({ price, responseNotes }) });
      }
      if (module === 'quotations' && label === 'Aprobar') {
        await request(`quotations/${item.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'approved' }) });
        await request(`quotations/${item.id}/convert-to-order`, { method: 'POST' });
      }
      if (module === 'quotations' && label === 'Rechazar') {
        await request(`quotations/${item.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'rejected' }) });
      }
      if (module === 'orders') {
        const status = label === 'Iniciar' ? 'in_progress' : label === 'Completar' ? 'completed' : 'cancelled';
        await request(`orders/${item.id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      }
      if (module === 'payments' && label === 'Confirmar') {
        await request(`payments/${item.id}/confirm`, { method: 'PATCH' });
      }
      if (module === 'documents' && label === 'Validar') {
        await request(`documents/${item.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'approved' }) });
      }
      if (module === 'users') {
        await request(`users/${item.id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive: !item.isActive }) });
      }
      await refresh();
    } catch (err) {
      console.error(err);
      alert('No se pudo ejecutar la acción. Revisa permisos y estado del registro.');
    }
  };

  const getActions = (item) => {
    if (module === 'quotations' && role === 'store' && item.status === 'pending') return ['Responder'];
    if (module === 'quotations' && role === 'client' && item.status === 'responded') return ['Aprobar', 'Rechazar'];
    if (module === 'orders' && role === 'store' && item.status === 'pending') return ['Iniciar', 'Cancelar'];
    if (module === 'orders' && role === 'store' && item.status === 'in_progress') return ['Completar'];
    if (module === 'payments' && role === 'admin' && item.status === 'pending') return ['Confirmar'];
    if (module === 'documents' && role === 'admin' && item.status === 'pending') return ['Validar'];
    if (module === 'users' && role === 'admin') return [item.isActive ? 'Desactivar' : 'Activar'];
    return [];
  };

  const createDocument = async () => {
    const orderId = prompt('ID de la orden');
    const type = prompt('Tipo de documento (BL, factura, permiso, comprobante)');
    const name = prompt('Nombre del documento');
    const url = prompt('URL del archivo');
    if (!orderId || !type || !name || !url) return;
    await request('documents', { method: 'POST', body: JSON.stringify({ orderId, type, name, url }) });
    await refresh();
  };

  return (
    <DashboardLayout title={config.title || title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Header */}
        <div className="dash-welcome">
          <div>
            <h2>{config.title || title}</h2>
            <p className="text-muted text-sm mt-1">Gestiona y consulta la información de este módulo.</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>Exportar</button>
            {module === 'documents' && <button className="btn btn-primary btn-sm" onClick={createDocument}>+ Cargar documento</button>}
          </div>
        </div>

        {/* Table */}
        <div className="dash-section" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  {config.cols.map(col => (
                    <th key={col} style={{
                      padding: 'var(--space-3) var(--space-5)',
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap',
                    }}>
                      {col}
                    </th>
                  ))}
                  <th style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={config.cols.length + 1} style={{ padding: 'var(--space-5)' }}>Cargando...</td></tr>
                )}
                {!loading && rows.length === 0 && (
                  <tr><td colSpan={config.cols.length + 1} style={{ padding: 'var(--space-5)' }}>No hay registros.</td></tr>
                )}
                {!loading && rows.map((row, ri) => (
                  <tr key={ri} style={{
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {row.map((cell, ci) => (
                      <td key={ci} style={{
                        padding: 'var(--space-4) var(--space-5)',
                        fontSize: '0.875rem',
                        color: ci === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        fontWeight: ci === 0 ? 600 : 400,
                        maxWidth: ci === 3 && module === 'audit' ? '200px' : 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {STATUS_MAP[cell] ? (
                          <span className={`badge ${STATUS_MAP[cell].badge}`}>{STATUS_MAP[cell].label}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                    <td style={{ padding: 'var(--space-4) var(--space-5)', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Ver</button>
                        {getActions(data[ri]).map(action => (
                          <button key={action} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => runAction(action, data[ri])}>{action}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-4) var(--space-5)',
            borderTop: '1px solid var(--color-border)',
          }}>
            <p className="text-sm text-muted">{rows.length} registro{rows.length !== 1 ? 's' : ''}</p>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="btn btn-ghost btn-sm" disabled>← Anterior</button>
              <button className="btn btn-primary btn-sm">1</button>
              <button className="btn btn-ghost btn-sm" disabled>Siguiente →</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
