import React from 'react';
import { Truck, User, MapPin, Clock, ArrowRight } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS } from '../../config/statusConstants';

export default function TripCard({ trip, onAction }) {
  const getProgress = (status) => {
    const map = { 'CREATED': 10, 'ASSIGNED': 35, 'IN_TRANSIT': 70, 'DELIVERED': 100 };
    return map[status] || 0;
  };

  return (
    <div className="trip-card-modern">
      {/* Visual Progress Top Bar */}
      <div className="progress-container" style={{ borderRadius: 0, height: '4px' }}>
        <div className="progress-bar" style={{ width: `${getProgress(trip.status)}%` }}></div>
      </div>

      <div className="trip-card-header">
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-info" style={{ fontSize: '10px' }}>{trip.tripCode}</span>
            <span className={`badge ${STATUS_COLORS[trip.status] || 'badge-muted'}`} style={{ fontSize: '10px' }}>
              {STATUS_LABELS[trip.status] || trip.status}
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Orden #{trip.order?.orderCode || 'N/A'}</h4>
        </div>
        <div style={{ padding: '8px', background: 'var(--color-bg)', borderRadius: '12px', color: 'var(--color-primary)' }}>
          <Truck size={20} />
        </div>
      </div>

      <div className="trip-card-body">
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Origen</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{trip.originName}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{trip.originAddress || 'Terminal Portuaria'}</p>
            </div>
          </div>

          <div className="timeline-item" style={{ paddingBottom: 0 }}>
            <div className="timeline-dot" style={{ borderColor: trip.status === 'DELIVERED' ? 'var(--color-success)' : 'var(--color-border)' }}></div>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Destino</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{trip.destinationName}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{trip.destinationAddress || 'Almacén de Destino'}</p>
            </div>
          </div>
        </div>

        {trip.status !== 'DELIVERED' && onAction && (
          <button 
            onClick={() => onAction(trip)}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px', borderRadius: '12px' }}
          >
            Siguiente Paso <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="trip-card-footer">
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }} title={`Chofer: ${trip.driver?.firstName}`}>
            {trip.driver?.firstName?.charAt(0) || <User size={14} />}
          </div>
          <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px', background: 'var(--color-accent)' }} title={`Vehículo: ${trip.vehicle?.plateNumber}`}>
            <Truck size={14} />
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Actualizado</p>
          <p style={{ fontSize: '11px', fontWeight: 600 }}>{new Date(trip.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    </div>
  );
}
