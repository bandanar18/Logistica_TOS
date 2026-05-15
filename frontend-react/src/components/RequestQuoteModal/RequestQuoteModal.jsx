import { useState } from 'react';
import { X, Send, ClipboardList, Info, Calendar, Package, MapPin } from 'lucide-react';
import './RequestQuoteModal.css';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

export default function RequestQuoteModal({ service, isOpen, onClose }) {
  const { token, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    notes: '',
    estimatedDate: '',
    cargoType: '',
    quantity: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      alert('Debes iniciar sesión para solicitar una cotización');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/quotations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          service: { id: service.id },
          store: { id: service.store.id },
          notes: `${form.notes} | Carga: ${form.cargoType} | Cantidad: ${form.quantity} | Fecha Est: ${form.estimatedDate}`
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setForm({ notes: '', estimatedDate: '', cargoType: '', quantity: '' });
        }, 3000);
      } else {
        const message = res.status === 401
          ? 'Tu sesión expiró o no tiene token válido. Cierra sesión e inicia nuevamente.'
          : 'Error al enviar la solicitud';
        alert(message);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="text-primary" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Solicitar Cotización</h3>
          </div>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="modal-body text-center py-8">
            <div className="success-icon mb-4" style={{ fontSize: '3rem' }}>✅</div>
            <h4 className="text-lg font-bold text-success">¡Solicitud enviada!</h4>
            <p className="text-muted mt-2">La tienda recibirá tu solicitud y te responderá pronto. Puedes ver el estado en tu panel de cliente.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="service-summary-box mb-4">
                <p className="text-xs text-muted uppercase font-bold">Servicio seleccionado</p>
                <p className="font-bold text-primary">{service.name}</p>
                <p className="text-sm">Proveedor: {service.store.legalName} · <MapPin size={12} style={{ display: 'inline' }} /> {service.store.basePort}</p>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Tipo de Carga</label>
                  <div className="input-with-icon">
                    <Package size={16} className="input-icon" />
                    <select 
                      className="form-select" 
                      style={{ paddingLeft: '36px' }}
                      value={form.cargoType}
                      onChange={e => setForm({...form, cargoType: e.target.value})}
                      required
                    >
                      <option value="">Selecciona...</option>
                      <option value="Contenedor 20'">Contenedor 20'</option>
                      <option value="Contenedor 40'">Contenedor 40'</option>
                      <option value="Carga Suelta">Carga Suelta</option>
                      <option value="Granel">Granel</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha Estimada</label>
                  <div className="input-with-icon">
                    <Calendar size={16} className="input-icon" />
                    <input 
                      type="date" 
                      className="form-input" 
                      style={{ paddingLeft: '36px' }}
                      value={form.estimatedDate}
                      onChange={e => setForm({...form, estimatedDate: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Cantidad / Volumen</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej: 2 unidades, 500kg..."
                  value={form.quantity}
                  onChange={e => setForm({...form, quantity: e.target.value})}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Notas adicionales o requerimientos</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Explica brevemente tu necesidad técnica..."
                  value={form.notes}
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                  required
                ></textarea>
              </div>

              <div className="info-box mt-4">
                <Info size={16} className="text-info" />
                <p className="text-xs">
                  Al enviar esta solicitud, el proveedor recibirá tus datos de contacto para responder con una propuesta formal.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : <><Send size={16} /> Enviar Solicitud</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
