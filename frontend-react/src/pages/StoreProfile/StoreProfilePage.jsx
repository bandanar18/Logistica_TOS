import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Star, MapPin, CheckCircle, Clock, Package, ArrowLeft,
  Phone, Mail, Globe, TrendingUp, FileText, Shield
} from 'lucide-react';
import AppLayout from '../../layouts/AppLayout/AppLayout';
import RequestQuoteModal from '../../components/RequestQuoteModal/RequestQuoteModal';
import { StarRating } from '../../components/StoreResultCard/StoreResultCard';
import './StoreProfilePage.css';

const MOCK_REVIEWS = [
  { id: 1, author: 'Carlos M.', rating: 5, date: '2026-04-20', text: 'Excelente servicio, muy rápidos y profesionales. El despacho se realizó sin inconvenientes.', service: 'Despacho aduanero' },
  { id: 2, author: 'María G.', rating: 4, date: '2026-04-15', text: 'Buen servicio, la comunicación fue fluida. Recomendado para operaciones de importación.', service: 'Gestión documental' },
  { id: 3, author: 'Pedro R.', rating: 5, date: '2026-04-10', text: 'Muy profesionales, cumplieron los tiempos acordados. Sin duda los volvería a contratar.', service: 'Despacho aduanero' },
];

export default function StoreProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        const storeRes = await fetch(`http://localhost:3000/stores/public/${id}`);
        if (storeRes.ok) {
          setStore(await storeRes.json());
        }

        const servicesRes = await fetch(`http://localhost:3000/services/search?storeId=${id}`);
        if (servicesRes.ok) {
          setServices(await servicesRes.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreData();
  }, [id]);

  const handleOpenQuote = (service) => {
    setSelectedService(service);
    setQuoteModalOpen(true);
  };

  if (loading) return <AppLayout><div className="container py-20 text-center"><h3>Cargando perfil...</h3></div></AppLayout>;
  if (!store) return <AppLayout><div className="container py-20 text-center"><h3>Tienda no encontrada</h3><button className="btn btn-primary mt-4" onClick={() => navigate('/search')}>Volver a la búsqueda</button></div></AppLayout>;

  return (
    <AppLayout>
      <div className="store-profile">
        {/* Back */}
        <div className="container">
          <button className="store-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Volver a resultados
          </button>
        </div>

        {/* Header */}
        <div className="store-profile-header">
          <div className="container">
            <div className="store-profile-header-content">
              <div className="store-profile-logo" style={{ background: store.brandColor || 'var(--color-primary)' }}>
                {store.legalName.substring(0, 2).toUpperCase()}
              </div>
              <div className="store-profile-info">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="store-profile-name">{store.legalName}</h1>
                  {store.status === 'approved' && (
                    <div className="verified-badge">
                      <CheckCircle size={14} />
                      Verificado
                    </div>
                  )}
                  <span className="badge badge-success">Proveedor Logístico</span>
                </div>
                <div className="store-profile-meta">
                  <span><MapPin size={14} /> {store.basePort}</span>
                  <span><Clock size={14} /> Responde rápido</span>
                  <span><TrendingUp size={14} /> 98% tasa de éxito</span>
                  <span>Miembro desde 2024</span>
                </div>
                <div className="flex items-center gap-4">
                  <StarRating rating={Number(store.averageRating)} size={16} />
                  <span className="text-sm text-muted">({store.reviewCount} reseñas · {store.reviewCount * 12} órdenes)</span>
                </div>
              </div>
              <div className="store-profile-cta">
                <button className="btn btn-primary btn-lg" onClick={() => handleOpenQuote(services[0])}>
                  <FileText size={18} />
                  Solicitar cotización
                </button>
                <button className="btn btn-secondary">
                  <Phone size={16} /> Contactar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container">
          <div className="store-profile-content">
            {/* Main */}
            <main className="store-profile-main">
              {/* Tabs */}
              <div className="store-tabs">
                {['services', 'reviews', 'info'].map(tab => (
                  <button
                    key={tab}
                    className={`store-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'services' && 'Servicios'}
                    {tab === 'reviews' && `Reseñas (${store.reviewCount})`}
                    {tab === 'info' && 'Información'}
                  </button>
                ))}
              </div>

              {activeTab === 'services' && (
                <div className="store-services">
                  <h3 className="tab-section-title">Servicios disponibles</h3>
                  <div className="services-list">
                    {services.length === 0 ? (
                      <p className="text-muted">No hay servicios publicados actualmente.</p>
                    ) : services.map((service, i) => (
                      <div key={i} className="service-item">
                        <div className="service-item-icon">
                          <Package size={20} />
                        </div>
                        <div className="service-item-info">
                          <h4>{service.name}</h4>
                          <p className="text-sm text-muted">{service.description || 'Servicio especializado en logística portuaria.'}</p>
                          <p className="font-bold text-primary mt-1">Desde USD {service.basePrice} / {service.billingUnit}</p>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenQuote(service)}>
                          Cotizar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="store-reviews">
                  <div className="reviews-summary">
                    <div className="reviews-rating-big">
                      <span className="rating-number">{Number(store.averageRating).toFixed(1)}</span>
                      <StarRating rating={Number(store.averageRating)} size={20} />
                      <span className="text-sm text-muted">{store.reviewCount} reseñas</span>
                    </div>
                  </div>
                  <div className="reviews-list">
                    {MOCK_REVIEWS.map(review => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>
                            {review.author.split(' ').map(w => w[0]).join('')}
                          </div>
                          <div>
                            <p className="review-author">{review.author}</p>
                            <div className="flex items-center gap-2">
                              <StarRating rating={review.rating} size={12} />
                              <span className="text-xs text-muted">{review.date}</span>
                            </div>
                          </div>
                          <span className="badge badge-muted ml-auto">{review.service}</span>
                        </div>
                        <p className="review-text">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'info' && (
                <div className="store-info">
                  <h3 className="tab-section-title">Sobre la empresa</h3>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: 'var(--space-6)' }}>
                    {store.description || 'Esta empresa no ha proporcionado una descripción detallada todavía.'}
                  </p>
                  <div className="info-grid">
                    <div className="info-item">
                      <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
                      <div>
                        <p className="info-label">Ubicación Base</p>
                        <p className="info-value">{store.basePort}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <Shield size={16} style={{ color: 'var(--color-success)' }} />
                      <div>
                        <p className="info-label">Estado</p>
                        <p className="info-value">Tienda {store.status === 'approved' ? 'verificada' : 'en proceso'}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <Clock size={16} style={{ color: 'var(--color-info)' }} />
                      <div>
                        <p className="info-label">RIF</p>
                        <p className="info-value">{store.taxId}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <TrendingUp size={16} style={{ color: 'var(--color-accent)' }} />
                      <div>
                        <p className="info-label">Calificación Promedio</p>
                        <p className="info-value">{Number(store.averageRating).toFixed(1)} / 5.0</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="store-profile-sidebar">
              <div className="card store-sidebar-cta">
                <h3>¿Listo para contratar?</h3>
                <p className="text-sm text-muted mt-2 mb-4">Solicita una cotización y recibe respuesta pronto.</p>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleOpenQuote(services[0])} disabled={services.length === 0}>
                  Solicitar cotización
                </button>
              </div>

              <div className="card store-sidebar-stats">
                <h4 className="font-semibold mb-4">Estadísticas</h4>
                {[
                  { label: 'Calificación', value: `${Number(store.averageRating).toFixed(1)}/5 ⭐` },
                  { label: 'Reseñas', value: store.reviewCount },
                  { label: 'Tasa de éxito', value: `98%` },
                  { label: 'RIF', value: store.taxId },
                ].map(stat => (
                  <div key={stat.label} className="sidebar-stat">
                    <span className="text-sm text-muted">{stat.label}</span>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {quoteModalOpen && selectedService && (
        <RequestQuoteModal 
          service={selectedService} 
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)} 
        />
      )}
    </AppLayout>
  );
}
