import { useState, useEffect } from 'react';
import { FileText, ClipboardList, CreditCard, Package, TrendingUp, Star, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import '../Client/ClientDashboard.css';

const STATUS_COLORS = {
  pending: 'badge-warning',
  responded: 'badge-info',
  approved: 'badge-success',
  rejected: 'badge-danger',
  order_created: 'badge-muted',
  in_progress: 'badge-info',
  completed: 'badge-success',
  cancelled: 'badge-danger',
};

const STATUS_LABELS = {
  pending: 'Pendiente',
  responded: 'Respondida',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  order_created: 'En Orden',
  in_progress: 'En Proceso',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

export default function StoreDashboard() {
  const { user, token } = useAuth();
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resQ, resO] = await Promise.all([
          fetch('http://localhost:3000/quotations', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('http://localhost:3000/orders', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (resQ.ok) setQuotations(await resQ.json());
        if (resO.ok) setOrders(await resO.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return (
    <DashboardLayout title="Panel de Tienda">
      <div className="dash-welcome">
        <div>
          <h2>Panel Logístico 🏪</h2>
          <p className="text-muted text-sm mt-1">Gestiona tus servicios, cotizaciones y órdenes.</p>
        </div>
        <Link to="/dashboard/store/services" className="btn btn-primary">
          <Plus size={16} /> Nuevo servicio
        </Link>
      </div>

      <div className="stats-grid">
        {[
          { icon: <FileText size={22} />, label: 'Solicitudes', value: quotations.length, change: `${quotations.filter(q=>q.status==='pending').length} sin responder`, color: 'var(--color-warning)' },
          { icon: <ClipboardList size={22} />, label: 'Órdenes activas', value: orders.filter(o=>o.status==='in_progress').length, change: 'En ejecución', color: 'var(--color-info)' },
          { icon: <CreditCard size={22} />, label: 'Ingresos este mes', value: '$0', change: 'USD', color: 'var(--color-success)' },
          { icon: <Star size={22} />, label: 'Calificación', value: '5.0/5', change: 'Nueva tienda', color: 'var(--color-accent)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            <div>
              <p className="stat-card-label">{s.label}</p>
              <p className="stat-card-value">{s.value}</p>
              <p className="stat-card-change">{s.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid-2">
        <div className="dash-section">
          <div className="section-header">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>Cotizaciones pendientes</h3>
            <Link to="/dashboard/store/quotations" className="btn btn-ghost btn-sm">Ver todas</Link>
          </div>
          <div className="dash-table">
            {quotations.length === 0 ? <p className="p-4 text-sm text-muted">No hay solicitudes pendientes.</p> :
              quotations.slice(0, 4).map(q => (
              <div key={q.id} className="dash-table-row">
                <div>
                  <p className="font-semibold text-sm">COT-{q.id.toString().padStart(4, '0')}</p>
                  <p className="text-xs text-muted">{q.client?.name}</p>
                  <p className="text-xs text-muted">{q.service?.name}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${STATUS_COLORS[q.status] || 'badge-muted'}`}>{STATUS_LABELS[q.status]}</span>
                  <p className="text-xs text-muted mt-1">{new Date(q.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-section">
          <div className="section-header">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>Mis servicios publicados</h3>
            <Link to="/dashboard/store/services" className="btn btn-ghost btn-sm">Gestionar</Link>
          </div>
          <div className="dash-table">
            {[
              { name: 'Despacho aduanero de importación', status: 'Publicado', orders: 234 },
              { name: 'Gestión de tasas portuarias', status: 'Publicado', orders: 89 },
              { name: 'Revisión documental', status: 'Publicado', orders: 156 },
              { name: 'Gestión de levante', status: 'Pausado', orders: 45 },
            ].map((s, i) => (
              <div key={i} className="dash-table-row">
                <div>
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-muted">{s.orders} órdenes</p>
                </div>
                <span className={`badge ${s.status === 'Publicado' ? 'badge-aprobado' : 'badge-warning'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
