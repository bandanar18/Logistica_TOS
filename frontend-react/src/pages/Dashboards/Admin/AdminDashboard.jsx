import {
  Users, Store, Package, FileText, ClipboardList, CreditCard,
  Percent, TrendingUp, ShieldCheck, AlertTriangle, CheckCircle,
  BarChart2, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout/DashboardLayout';
import { STATUS_COLORS, STATUS_LABELS } from '../../../config/statusConstants';
import API_BASE_URL from '../../../config/api';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_REPORTS_SUMMARY, MOCK_STORES, MOCK_AUDIT_LOGS } from '../../../data/mockData';
import '../Client/ClientDashboard.css';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [pRes, aRes, sRes] = await Promise.all([
        fetch(`${API_BASE_URL}/payments`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/audit`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/reports/summary`, { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      if (pRes.ok) {
        const json = await pRes.json();
        setPayments(json.filter(p => p.status === 'SUBMITTED' || p.status === 'IN_REVIEW') || []);
      }
      if (aRes.ok) setAuditLogs(await aRes.json());
      if (sRes.ok) setSummary(await sRes.json());

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleConfirmPayment = async (id) => {
    if (window.confirm('¿Confirmar recibo de pago?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/payments/${id}/confirm`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchData();
      } catch (err) {
          console.error(err);
      }
    }
  };

  return (
    <DashboardLayout title="Dashboard Global">
      <div className="dash-welcome">
        <div>
          <h2>Panel de Administración ⚙️</h2>
          <p className="text-muted text-sm mt-1">Visión global del Marketplace Logístico TOS.</p>
        </div>
        <Link to="/admin/reports" className="btn btn-primary">
          <BarChart2 size={16} /> Ver reportes
        </Link>
      </div>

      {/* Global Stats */}
      <div className="admin-stats-grid">
        {[
          { icon: <Users size={22} />, label: 'Clientes registrados', value: MOCK_REPORTS_SUMMARY.totalClients, change: '+23 este mes', up: true, color: 'var(--color-primary)' },
          { icon: <Store size={22} />, label: 'Tiendas activas', value: MOCK_REPORTS_SUMMARY.activeStores, change: `${MOCK_REPORTS_SUMMARY.totalStores} total`, up: true, color: 'var(--color-info)' },
          { icon: <ClipboardList size={22} />, label: 'Órdenes totales', value: MOCK_REPORTS_SUMMARY.totalOrders.toLocaleString(), change: `${MOCK_REPORTS_SUMMARY.activeOrders} activas`, up: true, color: 'var(--color-success)' },
          { icon: <CreditCard size={22} />, label: 'Ingresos (USD)', value: `$${(MOCK_REPORTS_SUMMARY.totalRevenue/1000).toFixed(0)}K`, change: '+18% vs mes anterior', up: true, color: 'var(--color-accent)' },
          { icon: <Percent size={22} />, label: 'Comisiones', value: `$${(MOCK_REPORTS_SUMMARY.totalCommissions/1000).toFixed(0)}K`, change: '10% promedio', up: true, color: 'var(--color-warning)' },
          { icon: <TrendingUp size={22} />, label: 'Calificación prom.', value: `${MOCK_REPORTS_SUMMARY.avgRating}/5`, change: '+0.1 este mes', up: true, color: '#7B1FA2' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            <div style={{ flex: 1 }}>
              <p className="stat-card-label">{s.label}</p>
              <p className="stat-card-value" style={{ fontSize: '1.375rem' }}>{s.value}</p>
            </div>
            <div className={`stat-trend ${s.up ? 'up' : 'down'}`}>
              {s.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span className="text-xs">{s.change.split(' ')[0]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid-2">
        {/* Payments to Review (Doc 24) */}
        <div className="dash-section">
          <div className="section-header">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>Pagos por validar</h3>
            <Link to="/admin/payments" className="btn btn-ghost btn-sm">Ver todos</Link>
          </div>
          <div className="dash-table">
            {payments.length === 0 ? <p className="p-4 text-sm text-muted">No hay pagos pendientes de revisión.</p> :
              payments.map((p, i) => (
              <div key={i} className="dash-table-row">
                <div>
                  <p className="font-semibold text-sm">{p.paymentCode}</p>
                  <p className="text-xs text-muted">Order: {p.order?.orderCode} · USD {p.amount}</p>
                  <a href={p.receiptUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline">Ver Comprobante</a>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleConfirmPayment(p.id)} className="btn btn-sm btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    Confirmar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Audit */}
        <div className="dash-section">
          <div className="section-header">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>Auditoría reciente</h3>
            <Link to="/admin/audit" className="btn btn-ghost btn-sm">Ver todo</Link>
          </div>
          <div className="dash-table">
            {MOCK_AUDIT_LOGS.slice(0, 5).map(log => (
              <div key={log.id} className="dash-table-row">
                <div>
                  <p className="font-semibold text-sm">{log.action}</p>
                  <p className="text-xs text-muted">{log.user} · {log.module}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${log.result === 'Éxito' ? 'badge-success' : 'badge-danger'}`}>
                    {log.result}
                  </span>
                  <p className="text-xs text-muted mt-1">{log.date.split(' ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Stores */}
      <div className="dash-section">
        <div className="section-header">
          <h3 className="section-title" style={{ fontSize: '1rem' }}>Top tiendas por órdenes</h3>
          <Link to="/admin/stores" className="btn btn-ghost btn-sm">Ver todas</Link>
        </div>
        <div className="admin-stores-grid">
          {MOCK_STORES.slice(0,3).map((store, i) => (
            <div key={store.id} className="admin-store-card">
              <div className="flex items-center gap-3">
                <div className="store-avatar-sm" style={{ background: store.color }}>
                  {store.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{store.name}</p>
                  <p className="text-xs text-muted">{store.category} · {store.port}</p>
                </div>
              </div>
              <div className="admin-store-stats">
                <div>
                  <p className="text-xs text-muted">Órdenes</p>
                  <p className="font-bold">{store.orderCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Rating</p>
                  <p className="font-bold">⭐ {store.rating}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Éxito</p>
                  <p className="font-bold">{store.successRate}%</p>
                </div>
                <span className={`badge ${store.verified ? 'badge-aprobado' : 'badge-info'}`}>
                  {store.verified ? 'Verificada' : 'Activa'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
