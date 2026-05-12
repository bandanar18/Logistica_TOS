import { useNavigate } from 'react-router-dom';
import { Star, MapPin, CheckCircle, Clock, Package, ArrowRight } from 'lucide-react';
import './StoreResultCard.css';

function StarRating({ rating, size = 14 }) {
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

export default function StoreResultCard({ store }) {
  const navigate = useNavigate();

  return (
    <div className="store-card card-hover card" onClick={() => navigate(`/stores/${store.id}`)}>
      <div className="store-card-header">
        <div className="store-avatar" style={{ background: store.color }}>
          {store.initials}
        </div>
        <div className="store-card-info">
          <div className="flex items-center gap-2">
            <h3 className="store-card-name">{store.name}</h3>
            {store.verified && (
              <CheckCircle size={16} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted mt-1">
            <MapPin size={13} />
            <span>{store.port}</span>
          </div>
        </div>
        <span className="badge badge-success" style={{ flexShrink: 0 }}>
          {store.category}
        </span>
      </div>

      <p className="store-card-desc">{store.description}</p>

      <div className="store-card-services">
        {store.services.slice(0, 3).map(s => (
          <span key={s} className="service-tag">
            <Package size={11} />
            {s}
          </span>
        ))}
      </div>

      <div className="store-card-meta">
        <StarRating rating={store.rating} />
        <div className="store-card-stats">
          <span className="store-stat">
            <Clock size={12} />
            {store.responseTime}
          </span>
          <span className="store-stat">
            {store.orderCount.toLocaleString()} órdenes
          </span>
        </div>
      </div>

      <div className="store-card-footer">
        <div>
          <p className="store-success">
            <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>{store.successRate}%</span>
            <span className="text-sm text-muted ml-1">tasa de éxito</span>
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/stores/${store.id}`); }}>
          Ver perfil <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

export { StarRating };
