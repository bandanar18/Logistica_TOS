import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Anchor, UserCheck } from 'lucide-react';
import './AuthPages.css';

const PROFILES = [
  { key: 'client', icon: '👤', name: 'Cliente', desc: 'Importador, exportador o empresa que solicita servicios' },
  { key: 'store', icon: '🏪', name: 'Proveedor Logístico', desc: 'Agente aduanal, transportista, almacén u otro' },
  { key: 'admin', icon: '⚙️', name: 'Operador Interno', desc: 'Personal interno del marketplace' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState('client');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError('');
    try {
      const [firstName, ...lastNameParts] = form.name.split(' ');
      const user = await register({
        firstName,
        lastName: lastNameParts.join(' ') || '',
        email: form.email,
        password: form.password,
        role: selectedProfile
      });
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
            Únete al ecosistema<br />logístico portuario
          </h1>
          <p className="auth-hero-desc">
            Regístrate como cliente para solicitar servicios, o como proveedor para publicar y gestionar tus operaciones.
          </p>
          <div className="auth-features">
            {[
              'Registro gratuito y sin comisiones iniciales',
              'Panel personalizado por tipo de actor',
              'Auditoría completa de todas las operaciones',
              'Soporte y onboarding incluido',
            ].map(f => (
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
              <h2>Crear cuenta</h2>
              <p className="text-sm text-muted">Paso {step} de 2</p>
            </div>

            {step === 1 ? (
              <>
                <p className="text-sm text-muted mb-4">Selecciona tu tipo de perfil:</p>
                <div className="auth-profile-grid">
                  {PROFILES.map(p => (
                    <div
                      key={p.key}
                      className={`profile-option ${selectedProfile === p.key ? 'selected' : ''}`}
                      onClick={() => setSelectedProfile(p.key)}
                    >
                      <div className="profile-option-icon">{p.icon}</div>
                      <p className="profile-option-name">{p.name}</p>
                      <p className="profile-option-desc">{p.desc}</p>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary btn-lg mt-6" style={{ width: '100%' }} onClick={() => setStep(2)}>
                  Continuar
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="badge badge-rechazado" style={{ display: 'block', textAlign: 'center', marginBottom: 'var(--space-4)' }}>{error}</div>}
                <div className="form-group">
                  <label className="form-label">Nombre completo</label>
                  <input type="text" className="form-input" placeholder="Juan García" required
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Empresa u organización</label>
                  <input type="text" className="form-input" placeholder="Mi Empresa C.A." required
                    value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Correo electrónico</label>
                  <input type="email" className="form-input" placeholder="juan@empresa.com" required
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Contraseña</label>
                  <input type="password" className="form-input" placeholder="Mínimo 8 caracteres" required
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar Contraseña</label>
                  <input type="password" className="form-input" placeholder="Confirma tu contraseña" required
                    value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />
                </div>
                <div className="flex gap-3">
                  <button type="button" className="btn btn-ghost btn-lg" style={{ flex: 1 }} onClick={() => setStep(1)}>
                    Atrás
                  </button>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2 }}>
                    <UserCheck size={18} />
                    Crear cuenta
                  </button>
                </div>
              </form>
            )}

            <p className="auth-signup mt-4">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
