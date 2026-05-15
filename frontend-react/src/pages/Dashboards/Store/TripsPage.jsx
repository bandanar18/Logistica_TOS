import React, { useState, useEffect } from 'react';
import { Truck, Search, Filter, RefreshCw, Layers } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';
import TripCard from '../../../components/Transport/TripCard';

export default function TripsPage() {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/transport/trips`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setTrips(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [token]);

  const handleUpdateStatus = async (trip) => {
    // Logic for status transition modal
    const nextStatus = trip.status === 'CREATED' ? 'ASSIGNED' : 
                     trip.status === 'ASSIGNED' ? 'IN_TRANSIT' : 'DELIVERED';
    
    if (window.confirm(`¿Cambiar estado a ${nextStatus}?`)) {
        try {
            const res = await fetch(`${API_BASE_URL}/transport/trips/${trip.id}/status`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: nextStatus })
            });
            if (res.ok) fetchTrips();
        } catch (err) {
            console.error(err);
        }
    }
  };

  return (
    <DashboardLayout title="Gestión de Viajes">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
            Logística de Transporte <span className="animate-bounce-subtle">🚛</span>
          </h2>
          <p className="text-muted" style={{ fontWeight: 500 }}>Control y seguimiento de unidades en tiempo real.</p>
        </div>
        <button onClick={fetchTrips} className="btn btn-ghost" style={{ background: 'white', border: '1px solid var(--color-border)' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> <span style={{ marginLeft: '8px' }}>Sincronizar</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid-4" style={{ marginBottom: '40px' }}>
        <div className="stat-card-modern">
          <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>En Ruta</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '4px' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)' }}>{trips.filter(t => t.status === 'IN_TRANSIT').length}</h3>
            <div style={{ padding: '8px', background: 'var(--color-info-light)', color: 'var(--color-info)', borderRadius: '10px' }}>
              <Truck size={20} />
            </div>
          </div>
        </div>
        <div className="stat-card-modern">
          <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Entregados</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '4px' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-success)' }}>{trips.filter(t => t.status === 'DELIVERED').length}</h3>
            <div style={{ padding: '8px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '10px' }}>
              <RefreshCw size={20} />
            </div>
          </div>
        </div>
        <div className="stat-card-modern">
          <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Unidades</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '4px' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent-dark)' }}>{[...new Set(trips.map(t => t.vehicle?.id))].filter(Boolean).length}</h3>
            <div style={{ padding: '8px', background: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: '10px' }}>
              <Layers size={20} />
            </div>
          </div>
        </div>
        <div className="stat-card-modern">
          <p style={{ fontSize: '10px', fontWeight: 900, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '4px' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>{trips.length}</h3>
            <div style={{ padding: '8px', background: 'var(--color-bg)', color: 'var(--color-text-secondary)', borderRadius: '10px' }}>
              <Filter size={20} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Buscar por placa, orden o código de viaje..." 
            className="form-input"
            style={{ paddingLeft: '48px', height: '48px', background: 'white' }}
          />
        </div>
        <button className="btn btn-secondary" style={{ height: '48px', padding: '0 24px' }}>
          <Filter size={18} /> <span style={{ marginLeft: '8px' }}>Filtros Avanzados</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px' }}>
            <div className="spinner" style={{ margin: '0 auto', width: '40px', height: '40px' }}></div>
            <p style={{ marginTop: '16px', color: 'var(--color-text-secondary)', fontWeight: 500 }}>Sincronizando flota...</p>
        </div>
      ) : trips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: 'white', borderRadius: '24px', border: '2px dashed var(--color-border)' }}>
            <Truck size={64} style={{ color: 'var(--color-border)', marginBottom: '16px' }} />
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', fontWeight: 600 }}>No hay viajes programados</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Los nuevos servicios aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="grid-3">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onAction={handleUpdateStatus} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
