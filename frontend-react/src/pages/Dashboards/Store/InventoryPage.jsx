import React, { useState, useEffect } from 'react';
import { Package, Search, MapPin, Layers, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import API_BASE_URL from '../../../config/api';

export default function InventoryPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/storage/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setItems(json || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <DashboardLayout title="Control de Inventario">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Gestión de Almacén 📦</h2>
          <p className="text-muted text-sm">Monitoreo de carga y ubicaciones físicas.</p>
        </div>
        <button onClick={fetchData} className="btn btn-ghost btn-sm">
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="stat-card-icon bg-blue-50 text-blue-600"><Package size={20} /></div>
          <div>
            <p className="text-xs text-muted">Total SKUs</p>
            <p className="text-xl font-bold">{items.length}</p>
          </div>
        </div>
        {/* More stats could go here */}
      </div>

      <div className="dash-section overflow-hidden">
        <div className="section-header px-6 py-4 border-b border-gray-50">
          <h3 className="section-title text-sm font-bold">Mercancía en Custodia</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">SKU / Descripción</th>
                <th className="px-6 py-4 font-semibold">Almacén</th>
                <th className="px-6 py-4 font-semibold">Ubicación</th>
                <th className="px-6 py-4 font-semibold">Cantidad</th>
                <th className="px-6 py-4 font-semibold">Orden Ref.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted">Cargando inventario...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-muted">No hay mercancía registrada.</td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">{item.sku}</p>
                      <p className="text-xs text-gray-400">{item.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-primary" />
                        <span>{item.warehouse?.warehouseName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">
                        <Layers size={12} />
                        {item.location?.locationCode || 'Sin ubicación'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {item.quantity} {item.unit?.name || 'UN'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">{item.order?.orderCode || '-'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
