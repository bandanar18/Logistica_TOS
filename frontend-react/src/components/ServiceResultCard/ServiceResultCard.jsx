import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Heart } from 'lucide-react';
import './ServiceResultCard.css';

export default function ServiceResultCard({ service }) {
  const navigate = useNavigate();
  const store = service.store;

  // Placeholder image for logistics service
  const imageUrl = `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600`;

  return (
    <div className="service-card" onClick={() => navigate(`/stores/${store.id}`)}>
      <div className="service-card-image-wrap">
        <img src={imageUrl} alt={service.name} className="service-card-image" />
        <button className="wishlist-btn" onClick={(e) => e.stopPropagation()}>
          <Heart size={24} color="white" strokeWidth={1.5} />
        </button>
        {store.status === 'approved' && (
          <div className="guest-favorite-badge">
            <ShieldCheck size={14} />
            <span>Verificado</span>
          </div>
        )}
      </div>

      <div className="service-card-content">
        <div className="service-card-top">
          <h3 className="service-card-title">{store.basePort || 'Puerto Local'}</h3>
          <div className="service-card-rating">
            <Star size={12} fill="var(--color-carbon)" />
            <span>{(Number(store.averageRating) || 5.0).toFixed(1)}</span>
          </div>
        </div>
        
        <p className="service-card-subtitle">{service.name}</p>
        <p className="service-card-subtitle">{store.legalName}</p>
        
        <div className="service-card-price-row">
          <span className="service-card-price">${service.basePrice}</span>
          <span className="service-card-unit"> {service.billingUnit}</span>
        </div>
      </div>
    </div>
  );
}

