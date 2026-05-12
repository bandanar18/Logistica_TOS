import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Clock, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import RequestQuoteModal from '../RequestQuoteModal/RequestQuoteModal';
import './ServiceResultCard.css';

function StarRating({ rating = 5.0, size = 14 }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? 'var(--color-accent)' : 'none'}
          strokeWidth={i <= Math.round(rating) ? 0 : 1.5}
          style={{ color: i <= Math.round(rating) ? 'var(--color-accent)' : 'var(--color-border)' }}
        />
      ))}
      <span className="stars-value">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ServiceResultCard({ service }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const store = service.store;

  const handleQuoteClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div className="service-card card-hover card" onClick={() => navigate(`/stores/${store.id}`)}>
      <div className="service-card-header">
        <div className="store-badge-wrap">
           <div className="store-avatar" style={{ background: store.brandColor || 'var(--color-primary)' }}>
            {store.legalName ? store.legalName.substring(0, 2).toUpperCase() : 'ST'}
          </div>
          {store.status === 'approved' && (
             <div className="verified-badge" title="Tienda Verificada">
               <ShieldCheck size={14} fill="white" />
             </div>
          )}
        </div>
        <div className="service-card-info">
          <h3 className="service-name">{service.name}</h3>
          <p className="store-name-link" onClick={(e) => { e.stopPropagation(); navigate(`/stores/${store.id}`); }}>
            {store.legalName}
          </p>
        </div>
        <div className="service-price-tag">
          <span className="price-label">Desde</span>
          <span className="price-value">${service.basePrice}</span>
          <span className="price-unit">/{service.billingUnit}</span>
        </div>
      </div>

      <div className="service-card-body">
        <p className="service-desc">{service.description || 'Sin descripción disponible.'}</p>
        
        <div className="service-tags">
          <span className="tag">
            <Package size={13} /> {service.category?.name || 'Logística'}
          </span>
          <span className="tag">
            <MapPin size={13} /> {store.basePort || 'Multipuerto'}
          </span>
        </div>
      </div>

      <div className="service-card-footer">
        <StarRating rating={Number(store.averageRating) || 5.0} />
        <div className="service-meta">
          <span className="meta-item"><Clock size={12} /> r: 2h</span>
          <button className="btn btn-primary btn-sm" onClick={handleQuoteClick}>
            Cotizar <ArrowRight size={14} />
          </button>
        </div>
      </div>
      
      <RequestQuoteModal 
        service={service} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
