import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu, X, Anchor, LogOut, User, LayoutDashboard,
  ChevronDown, Globe
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
            <Anchor size={30} strokeWidth={2.5} />
          </div>
          <div className="navbar-logo-text">
            <span className="navbar-logo-name">Puerto</span>
          </div>
        </Link>

        {/* Desktop Nav Links (Centered) */}
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
          {!user && (
            <Link to="/dashboard/store" className="btn btn-ghost">
              Hazte tienda
            </Link>
          )}
          
          <button className="btn btn-ghost p-2 rounded-full">
            <Globe size={18} />
          </button>

          <div className="navbar-user-menu">
            <button
              className="navbar-user-btn"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <Menu size={16} />
              <div className="avatar" style={{ 
                background: 'var(--color-slate)', 
                width: '32px', 
                height: '32px',
                fontSize: '12px'
              }}>
                {user ? (user.firstName ? user.firstName.charAt(0) : 'U') : <User size={16} />}
              </div>
            </button>
            
            {userMenuOpen && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <div className="user-dropdown-header">
                      <p className="font-bold">{user.name || `${user.firstName} ${user.lastName}`}</p>
                      <p className="text-sm text-muted">{user.email}</p>
                    </div>
                    <div className="user-dropdown-divider" />
                    <Link to={getDashboardPath()} className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={16} /> Mi Panel
                    </Link>
                    <Link to="/profile" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={16} /> Mi Perfil
                    </Link>
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={16} /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="user-dropdown-item font-bold" onClick={() => setUserMenuOpen(false)}>Regístrate</Link>
                    <Link to="/login" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>Inicia sesión</Link>
                    <div className="user-dropdown-divider" />
                    <Link to="/dashboard/store" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>Hazte tienda</Link>
                    <Link to="/help" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>Centro de ayuda</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="navbar-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

