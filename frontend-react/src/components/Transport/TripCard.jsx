import React from 'react';
import { Truck, User, MapPin, Clock, ArrowRight } from 'lucide-react';
import { STATUS_COLORS, STATUS_LABELS } from '../../config/statusConstants';

export default function TripCard({ trip, onAction }) {
  return (
    <div className="trip-card bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold text-primary mb-1 block">{trip.tripCode}</span>
          <h4 className="font-bold text-gray-800">Orden {trip.order?.orderCode}</h4>
        </div>
        <span className={`badge ${STATUS_COLORS[trip.status] || 'badge-muted'}`}>
          {STATUS_LABELS[trip.status] || trip.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <MapPin size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Origen</p>
            <p className="font-semibold">{trip.originName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="p-2 bg-green-50 text-green-600 rounded-lg">
            <ArrowRight size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Destino</p>
            <p className="font-semibold">{trip.destinationName}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-xs">
          <Truck size={14} className="text-gray-400" />
          <span className="text-gray-600">{trip.vehicle?.plateNumber || 'Pendiente'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <User size={14} className="text-gray-400" />
          <span className="text-gray-600">{trip.driver?.firstName} {trip.driver?.lastName || ''}</span>
        </div>
      </div>

      {trip.status !== 'DELIVERED' && onAction && (
        <button 
          onClick={() => onAction(trip)}
          className="btn btn-primary w-full mt-4 text-xs py-2"
        >
          Actualizar Estado
        </button>
      )}
    </div>
  );
}
