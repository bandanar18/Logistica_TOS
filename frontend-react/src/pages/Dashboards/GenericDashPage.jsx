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
      u.name,
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/${config.endpoint}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (config.endpoint) fetchData();
  }, [module, token, config.endpoint]);

  const rows = data.map(item => config.mapRow(item, role));

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
            <button className="btn btn-ghost btn-sm">Exportar CSV</button>
            <button className="btn btn-primary btn-sm">+ Nuevo</button>
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
                {rows.map((row, ri) => (
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
                        <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Editar</button>
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
