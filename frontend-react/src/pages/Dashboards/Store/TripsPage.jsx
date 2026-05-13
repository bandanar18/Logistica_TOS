import React, { useState, useEffect } from 'react';
import { Truck, Search, Filter, RefreshCw } from 'lucide-react';
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
        setTrips(json || []);
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Logística de Transporte 🚛</h2>
          <p className="text-muted text-sm">Control y seguimiento de unidades en ruta.</p>
        </div>
        <button onClick={fetchTrips} className="btn btn-ghost btn-sm">
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por placa, orden o código..." 
            className="input w-full pl-10"
          />
        </div>
        <button className="btn btn-ghost">
          <Filter size={18} /> Filtros
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
            <RefreshCw className="animate-spin text-primary" size={32} />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Truck size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No hay viajes programados por ahora.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onAction={handleUpdateStatus} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
