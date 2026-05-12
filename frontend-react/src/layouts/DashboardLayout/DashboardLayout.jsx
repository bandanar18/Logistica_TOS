import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, ClipboardList, Folder, CreditCard,
  Percent, Users, Store, ShieldCheck, BarChart2, Settings,
  LogOut, Menu, X, Anchor, Bell, ChevronRight, Package, Star,
  Search, Warehouse, Truck, Shield
} from 'lucide-react';
import './DashboardLayout.css';

const CLIENT_MENU = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/client' },
  { label: 'Buscar Servicios', icon: Search, path: '/search' },
  { label: 'Mis Cotizaciones', icon: FileText, path: '/dashboard/client/quotations' },
  { label: 'Mis Órdenes', icon: ClipboardList, path: '/dashboard/client/orders' },
  { label: 'Mis Documentos', icon: Folder, path: '/dashboard/client/documents' },
  { label: 'Mis Pagos', icon: CreditCard, path: '/dashboard/client/payments' },
  { label: 'Mis Reseñas', icon: Star, path: '/dashboard/client/reviews' },
];

const STORE_MENU = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/store' },
  { label: 'Mi Perfil', icon: Store, path: '/dashboard/store/profile' },
  { label: 'Mis Servicios', icon: Package, path: '/dashboard/store/services' },
  { label: 'Cotizaciones', icon: FileText, path: '/dashboard/store/quotations' },
  { label: 'Órdenes', icon: ClipboardList, path: '/dashboard/store/orders' },
  { label: 'Documentos', icon: Folder, path: '/dashboard/store/documents' },
  { label: 'Pagos y Comisiones', icon: CreditCard, path: '/dashboard/store/payments' },
  { label: 'TOS (Patios)', icon: Anchor, path: '/dashboard/store/tos' },
  { label: 'Almacenamiento', icon: Warehouse, path: '/dashboard/store/storage' },
  { label: 'Transporte', icon: Truck, path: '/dashboard/store/transport' },
  { label: 'Inspecciones', icon: Shield, path: '/dashboard/store/inspections' },
  { label: 'Reviews', icon: Star, path: '/dashboard/store/reviews' },
];

const ADMIN_MENU = [
  { label: 'Dashboard Global', icon: LayoutDashboard, path: '/admin' },
  { label: 'Usuarios', icon: Users, path: '/admin/users' },
  { label: 'Tiendas', icon: Store, path: '/admin/stores' },
  { label: 'Servicios', icon: Package, path: '/admin/services' },
  { label: 'Catálogos', icon: Settings, path: '/admin/catalogs' },
  { label: 'Cotizaciones', icon: FileText, path: '/admin/quotations' },
  { label: 'Órdenes', icon: ClipboardList, path: '/admin/orders' },
  { label: 'Pagos', icon: CreditCard, path: '/admin/payments' },
  { label: 'Documentos', icon: Folder, path: '/admin/documents' },
  { label: 'TOS (Patios)', icon: Anchor, path: '/admin/tos' },
  { label: 'Almacenamiento', icon: Warehouse, path: '/admin/storage' },
  { label: 'Transporte', icon: Truck, path: '/admin/transport' },
  { label: 'Inspecciones', icon: Shield, path: '/admin/inspections' },
  { label: 'Comisiones', icon: Percent, path: '/admin/commissions' },
  { label: 'Reviews', icon: Star, path: '/admin/reviews' },
  { label: 'Reportes', icon: BarChart2, path: '/admin/reports' },
  { label: 'Auditoría', icon: ShieldCheck, path: '/admin/audit' },
];

export default function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getMenu = () => {
    if (!user) return [];
    if (user.role === 'admin') return ADMIN_MENU;
    if (user.role === 'store') return STORE_MENU;
    return CLIENT_MENU;
  };

  const getRoleLabel = () => {
    if (!user) return '';
    if (user.role === 'admin') return 'Superadministrador';
    if (user.role === 'store') return 'Tienda Logística';
    return 'Cliente';
  };

  const getRoleColor = () => {
    if (!user) return '#1A3C5E';
    if (user.role === 'admin') return '#C62828';
    if (user.role === 'store') return '#2E7D32';
    return '#1A3C5E';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menu = getMenu();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Anchor size={16} />
            </div>
            <span>TOS Market</span>
          </Link>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="avatar avatar-lg" style={{ background: getRoleColor() }}>
            {user?.avatar}
          </div>
          <div>
            <p className="sidebar-user-name">{user?.name}</p>
            <span className="badge" style={{ background: `${getRoleColor()}20`, color: getRoleColor(), fontSize: '0.7rem' }}>
              {getRoleLabel()}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="sidebar-nav-arrow" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <Link to="/" className="sidebar-nav-item">
            <Anchor size={16} />
            <span>Ir al Marketplace</span>
          </Link>
          <button className="sidebar-nav-item danger" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <button className="dashboard-menu-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="dashboard-header-title">
            {title && <h1>{title}</h1>}
          </div>
          <div className="dashboard-header-right">
            <button className="navbar-notif-btn" style={{ color: 'var(--color-text-secondary)' }}>
              <Bell size={18} />
              <span className="notif-dot" />
            </button>
            <div className="avatar" style={{ background: getRoleColor() }}>
              {user?.avatar}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}
