import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Anchor, Eye, EyeOff, LogIn } from 'lucide-react';
import './AuthPages.css';

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = async (role) => {
    setError('');
    try {
      await demoLogin(role);
      if (role === 'admin') navigate('/admin');
      else if (role === 'store') navigate('/dashboard/store');
      else navigate('/dashboard/client');
    } catch (err) {
      setError('No se pudo iniciar sesión demo. Verifica que el backend esté corriendo y ejecuta npm run seed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'store') navigate('/dashboard/store');
      else navigate('/dashboard/client');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-brand-icon"><Anchor size={22} /></div>
            <span>TOS Market</span>
          </div>
          <h1 className="auth-hero-title">
            La plataforma logística<br />que el puerto necesitaba
          </h1>
          <p className="auth-hero-desc">
            Gestiona cotizaciones, órdenes, documentos y pagos en un solo lugar.
          </p>
          <div className="auth-features">
            {['Más de 87 proveedores verificados', '1,847 órdenes procesadas', 'Auditoría completa de operaciones', 'Soporte en tiempo real'].map(f => (
              <div key={f} className="auth-feature">
                <div className="auth-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Iniciar sesión</h2>
              <p className="text-muted text-sm">Accede a tu cuenta del marketplace</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div className="badge badge-rechazado" style={{ display: 'block', textAlign: 'center', marginBottom: 'var(--space-4)' }}>{error}</div>}
              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <div className="password-field">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="auth-remember">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>
                <a href="#" className="auth-forgot">¿Olvidaste tu contraseña?</a>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <LogIn size={18} />
                Iniciar sesión
              </button>
            </form>

            {/* Demo Access */}
            <div className="auth-demo">
              <p className="auth-demo-label">Acceso de demostración:</p>
              <div className="auth-demo-btns">
                <button type="button" className="demo-btn client" onClick={() => handleDemoLogin('client')}>
                  👤 Cliente
                </button>
                <button type="button" className="demo-btn store" onClick={() => handleDemoLogin('store')}>
                  🏪 Tienda
                </button>
                <button type="button" className="demo-btn admin" onClick={() => handleDemoLogin('admin')}>
                  ⚙️ Admin
                </button>
              </div>
            </div>

            <p className="auth-signup">
              ¿No tienes cuenta?{' '}
              <Link to="/register">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
