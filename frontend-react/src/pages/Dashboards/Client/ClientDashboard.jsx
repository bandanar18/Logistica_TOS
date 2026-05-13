import {
  FileText, ClipboardList, CreditCard, CheckCircle, Clock,
  TrendingUp, Package, Plus, ArrowRight, AlertTriangle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../layouts/DashboardLayout/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import PaymentModal from '../../../components/PaymentModal/PaymentModal';
import './ClientDashboard.css';

import { STATUS_COLORS, STATUS_LABELS } from '../../../config/statusConstants';

function StatCard({ icon, label, value, change, color }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: `${color}15`, color }}>
        {icon}
      </div>
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
        {change && <p className="stat-card-change">{change}</p>}
      </div>
    </div>
  );
}

import API_BASE_URL from '../../../config/api';

export default function ClientDashboard() {
  const { user, token } = useAuth();
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePay = (order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resQ, resO] = await Promise.all([
          fetch(`${API_BASE_URL}/quotations`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/orders`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (resQ.ok) {
          const json = await resQ.json();
          setQuotations(json.data || []);
        }
        if (resO.ok) {
          const json = await resO.json();
          setOrders(json.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const pendingQuotations = quotations.filter(q => q.status === 'RESPONDED').length;
  const activeOrders = orders.filter(o => o.operationalStatus !== 'CLOSED' && o.operationalStatus !== 'CANCELLED').length;

  return (
    <DashboardLayout title="Mi Dashboard">
      {/* Welcome */}
      <div className="dash-welcome">
        <div>
          <h2>¡Bienvenido, {user?.firstName || 'Usuario'}! 👋</h2>
          <p className="text-muted text-sm mt-1">Aquí tienes un resumen de tus operaciones logísticas.</p>
        </div>
        <Link to="/search" className="btn btn-primary">
          <Plus size={16} /> Nueva cotización
        </Link>
      </div>

      {/* Alert */}
      {pendingQuotations > 0 && (
        <div className="dash-alert">
          <AlertTriangle size={18} />
          <p>Tienes <strong>{pendingQuotations} cotización(es)</strong> respondida(s) esperando tu aprobación.</p>
          <Link to="/dashboard/client/quotations" className="btn btn-accent btn-sm">
            Ver cotizaciones <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={<FileText size={22} />} label="Cotizaciones" value={quotations.length} color="var(--color-primary)" />
        <StatCard icon={<ClipboardList size={22} />} label="Órdenes activas" value={activeOrders} color="var(--color-info)" />
        <StatCard icon={<CheckCircle size={22} />} label="Completadas" value={orders.filter(o=>o.operationalStatus==='CLOSED').length} color="var(--color-accent)" />
      </div>

      <div className="dash-grid-2">
        {/* Recent Quotations */}
        <div className="dash-section">
          <div className="section-header">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>Mis cotizaciones recientes</h3>
            <Link to="/dashboard/client/quotations" className="btn btn-ghost btn-sm">Ver todas</Link>
          </div>
          <div className="dash-table">
            {quotations.length === 0 ? <p className="p-4 text-sm text-muted">No hay cotizaciones recientes.</p> :
              quotations.slice(0, 4).map(q => (
              <div key={q.id} className="dash-table-row">
                <div>
                  <p className="font-semibold text-sm">{q.quotationCode || `COT-${String(q.id).padStart(4, '0')}`}</p>
                  <p className="text-xs text-muted">{q.service?.name}</p>
                  <p className="text-xs text-muted">{q.store?.legalName}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${STATUS_COLORS[q.status] || 'badge-muted'}`}>{STATUS_LABELS[q.status]}</span>
                  {q.totalAmount && <p className="text-xs text-muted mt-1">USD {q.totalAmount}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Orders */}
        <div className="dash-section">
          <div className="section-header">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>Órdenes activas</h3>
            <Link to="/dashboard/client/orders" className="btn btn-ghost btn-sm">Ver todas</Link>
          </div>
          <div className="dash-table">
            {orders.length === 0 ? <p className="p-4 text-sm text-muted">No hay órdenes activas.</p> :
              orders.map(order => (
              <div key={order.id} className="dash-table-row">
                <div>
                  <p className="font-semibold text-sm">{order.orderCode || `ORD-${String(order.id).padStart(4, '0')}`}</p>
                  <p className="text-xs text-muted">{order.service?.name}</p>
                  <p className="text-xs text-muted">{order.store?.legalName}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${STATUS_COLORS[order.operationalStatus] || 'badge-muted'}`}>
                    {STATUS_LABELS[order.operationalStatus]}
                  </span>
                  <p className="text-xs text-muted mt-1">USD {order.totalAmount}</p>
                  {order.financialStatus === 'UNPAID' && (
                    <button className="btn btn-primary btn-xs mt-2" onClick={() => handlePay(order)}>
                      Reportar Pago
                    </button>
                  )}
                  {order.financialStatus === 'SUBMITTED' && (
                    <span className="badge badge-warning block mt-2 text-xs">Pago en revisión</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dash-section mt-6">
        <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: 'var(--space-4)' }}>Acciones rápidas</h3>
        <div className="quick-actions">
          {[
            { icon: <Package size={20} />, label: 'Buscar servicios', path: '/search', color: 'var(--color-primary)' },
            { icon: <FileText size={20} />, label: 'Ver cotizaciones', path: '/dashboard/client/quotations', color: 'var(--color-info)' },
            { icon: <ClipboardList size={20} />, label: 'Mis órdenes', path: '/dashboard/client/orders', color: 'var(--color-success)' },
            { icon: <CreditCard size={20} />, label: 'Mis pagos', path: '/dashboard/client/payments', color: 'var(--color-accent)' },
          ].map(action => (
            <Link key={action.path} to={action.path} className="quick-action">
              <div className="quick-action-icon" style={{ background: `${action.color}15`, color: action.color }}>
                {action.icon}
              </div>
              <span className="text-sm font-semibold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <PaymentModal 
          order={selectedOrder} 
          isOpen={isPaymentModalOpen} 
          onClose={() => setIsPaymentModalOpen(false)} 
        />
      )}
    </DashboardLayout>
  );
}
