import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Menu, X, Anchor, LogOut, User, LayoutDashboard, Bell,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'store') return '/dashboard/store';
    return '/dashboard/client';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <Anchor size={20} />
          </div>
          <div className="navbar-logo-text">
            <span className="navbar-logo-name">TOS Market</span>
            <span className="navbar-logo-sub">Logística Portuaria</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>
            Servicios
          </Link>
          <Link to="/search?cat=Aduana" className="nav-link">Aduana</Link>
          <Link to="/search?cat=Transporte" className="nav-link">Transporte</Link>
          <Link to="/search?cat=Inspección" className="nav-link">Inspección</Link>
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {user ? (
            <>
              <Link to={getDashboardPath()} className="btn btn-ghost btn-sm">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button className="navbar-notif-btn">
                <Bell size={18} />
                <span className="notif-dot" />
              </button>
              <div className="navbar-user-menu">
                <button
                  className="navbar-user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="avatar" style={{ background: user.role === 'admin' ? '#C62828' : user.role === 'store' ? '#2E7D32' : '#1A3C5E' }}>
                    {user.avatar || (user.firstName ? user.firstName.charAt(0) : 'U')}
                  </div>
                  <span className="navbar-user-name">{(user.name || user.firstName || 'Usuario').split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <p className="font-semibold">{user.name || `${user.firstName} ${user.lastName}`}</p>
                      <p className="text-sm text-muted">{user.email}</p>
                    </div>
                    <div className="user-dropdown-divider" />
                    <Link to={getDashboardPath()} className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={15} /> Mi Panel
                    </Link>
                    <Link to="/profile" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={15} /> Mi Perfil
                    </Link>
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={15} /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button className="navbar-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/search" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Servicios</Link>
          <Link to="/search?cat=Aduana" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Aduana</Link>
          <Link to="/search?cat=Transporte" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Transporte</Link>
          <Link to="/search?cat=Inspección" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Inspección</Link>
          {!user && (
            <div className="mobile-nav-actions">
              <Link to="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Iniciar sesión</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Registrarse</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
