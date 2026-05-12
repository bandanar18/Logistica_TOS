import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star, CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import ServiceResultCard from '../../components/ServiceResultCard/ServiceResultCard';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPort, setSelectedPort] = useState('');
  const [categories, setCategories] = useState([]);
  const [ports, setPorts] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCat, resPorts, resServices] = await Promise.all([
          fetch('http://localhost:3000/catalogs/SERVICE_CATEGORIES'),
          fetch('http://localhost:3000/catalogs/PORTS'),
          fetch('http://localhost:3000/services/search')
        ]);

        if (resCat.ok) setCategories((await resCat.json()).items || []);
        if (resPorts.ok) setPorts((await resPorts.json()).items || []);
        if (resServices.ok) setFeaturedServices((await resServices.json()).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('cat', selectedCategory);
    if (selectedPort) params.set('port', selectedPort);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <AppLayout>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={14} />
            Marketplace Logístico Portuario
          </div>
          <h1 className="hero-title">
            Encuentra el servicio<br />
            <span className="hero-title-accent">logístico que necesitas</span>
          </h1>
          <p className="hero-subtitle">
            Conectamos clientes con los mejores proveedores logísticos en puertos aduaneros.
            Cotiza, contrata y monitorea en una sola plataforma.
          </p>

          {/* Search Bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-fields">
              <div className="hero-search-field">
                <label>Servicio</label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="hero-select"
                >
                  <option value="">Todos los servicios</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.code}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="hero-search-divider" />
              <div className="hero-search-field">
                <label>Puerto</label>
                <select
                  value={selectedPort}
                  onChange={e => setSelectedPort(e.target.value)}
                  className="hero-select"
                >
                  <option value="">Todos los puertos</option>
                  {ports.map(p => (
                    <option key={p.id} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="hero-search-divider" />
              <div className="hero-search-field hero-search-text">
                <label>Buscar</label>
                <input
                  type="text"
                  placeholder="Agente aduanal, transporte, inspección..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="hero-input"
                />
              </div>
            </div>
            <button type="submit" className="hero-search-btn">
              <Search size={20} />
              <span>Buscar</span>
            </button>
          </form>

          {/* Quick Tags */}
          <div className="hero-tags">
            <span className="hero-tags-label">Popular:</span>
            {['Despacho aduanero', 'Transporte terrestre', 'Inspección de carga', 'Almacenamiento fiscal'].map(tag => (
              <button
                key={tag}
                className="hero-tag"
                onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="hero-stats">
          <div className="container">
            <div className="hero-stats-grid">
               <div className="hero-stat">
                <span className="hero-stat-number">24/7</span>
                <span className="hero-stat-label">Soporte Operativo</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">100%</span>
                <span className="hero-stat-label">Trazabilidad Real</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">3+</span>
                <span className="hero-stat-label">Puertos Nacionales</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-number">Top</span>
                <span className="hero-stat-label">Proveedores Verificados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Servicios por categoría</h2>
              <p className="text-muted text-sm mt-2">Explora los servicios disponibles en el ecosistema logístico portuario</p>
            </div>
            <button className="btn btn-ghost" onClick={() => navigate('/search')}>
              Ver todos <ArrowRight size={16} />
            </button>
          </div>

          <div className="categories-grid">
            {categories.map(cat => (
              <button
                key={cat.id}
                className="category-card"
                onClick={() => navigate(`/search?cat=${encodeURIComponent(cat.code)}`)}
              >
                <div className="category-icon"><TrendingUp size={24} /></div>
                <div className="category-info">
                  <p className="category-name">{cat.name}</p>
                  <p className="category-count">Ver proveedores</p>
                </div>
                <ArrowRight size={16} className="category-arrow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROVIDERS ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Proveedores destacados</h2>
              <p className="text-muted text-sm mt-2">Los mejores calificados por nuestros clientes</p>
            </div>
            <button className="btn btn-ghost" onClick={() => navigate('/search')}>
              Ver todos <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-3">
            {featuredServices.length > 0 ? featuredServices.map(service => (
              <ServiceResultCard key={service.id} service={service} />
            )) : (
              <p className="text-muted">No hay servicios destacados disponibles en este momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="section-title">¿Cómo funciona?</h2>
            <p className="text-muted mt-2">Proceso simple y transparente en 4 pasos</p>
          </div>
          <div className="how-it-works-grid">
            {[
              { step: '01', icon: <Search size={28} />, title: 'Busca y filtra', desc: 'Encuentra proveedores logísticos por categoría, puerto, tarifa y calificación.' },
              { step: '02', icon: <Star size={28} />, title: 'Compara y elige', desc: 'Revisa perfiles, reviews, tarifas y tiempos de respuesta.' },
              { step: '03', icon: <CheckCircle size={28} />, title: 'Cotiza y aprueba', desc: 'Solicita cotización, recibe respuesta y aprueba en pocos clics.' },
              { step: '04', icon: <TrendingUp size={28} />, title: 'Monitorea en tiempo real', desc: 'Sigue el estado de tu operación, documentos y pagos desde tu panel.' },
            ].map((item, i) => (
              <div key={i} className="how-step">
                <div className="how-step-number">{item.step}</div>
                <div className="how-step-icon">{item.icon}</div>
                <h3 className="how-step-title">{item.title}</h3>
                <p className="how-step-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="value-props-grid">
            <div className="value-prop-text">
              <h2 className="section-title">La plataforma que el sector<br />logístico necesitaba</h2>
              <p className="text-muted mt-4" style={{ lineHeight: '1.7' }}>
                TOS Market centraliza la contratación, gestión, ejecución y auditoría de servicios
                logísticos en puertos aduaneros. Elimina la fragmentación, aumenta la trazabilidad
                y reduce los tiempos de gestión.
              </p>
              <div className="value-checks">
                {[
                  'Trazabilidad documental completa',
                  'Control RBAC por perfil de usuario',
                  'Auditoría de todos los eventos críticos',
                  'Diseño responsive para desktop y mobile',
                ].map((item, i) => (
                  <div key={i} className="value-check">
                    <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-lg mt-6" onClick={() => navigate('/register')}>
                Comenzar ahora <ArrowRight size={18} />
              </button>
            </div>
            <div className="value-prop-visual">
              <div className="value-prop-card">
                <div className="flex items-center gap-3 mb-4">
                  <Shield size={24} style={{ color: 'var(--color-primary)' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Panel Superadministrador</h4>
                </div>
                {[
                  { label: 'Tiendas activas', value: '72', change: '+12%' },
                  { label: 'Órdenes este mes', value: '234', change: '+8%' },
                  { label: 'Ingresos (USD)', value: '$98,453', change: '+23%' },
                  { label: 'Calificación promedio', value: '4.6/5', change: '+0.2' },
                ].map((m, i) => (
                  <div key={i} className="value-metric">
                    <span className="value-metric-label">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="value-metric-value">{m.value}</span>
                      <span className="badge badge-success">{m.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">¿Eres un proveedor logístico?</h2>
            <p className="cta-subtitle">
              Registra tu empresa, publica tus servicios y accede a cientos de clientes activos en el ecosistema portuario.
            </p>
            <div className="cta-actions">
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/register')}>
                Registrar mi empresa
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/search')}
                style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.3)' }}>
                Ver cómo funciona
              </button>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
