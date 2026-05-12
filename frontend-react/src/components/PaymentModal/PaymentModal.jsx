import { useState } from 'react';
import { X, CreditCard, Upload, Send, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './PaymentModal.css';

export default function PaymentModal({ order, isOpen, onClose }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    amount: order?.finalPrice || '',
    paymentMethod: 'bank_transfer',
    reference: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          order: { id: order.id }
        })
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 3000);
      } else {
        alert('Error al registrar el pago');
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
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-success" />
            <h3 className="font-bold">Registrar Pago</h3>
          </div>
          <button onClick={onClose} className="modal-close"><X size={20} /></button>
        </div>

        {success ? (
          <div className="modal-body text-center py-8">
            <div className="success-icon mb-4" style={{ fontSize: '3rem' }}>💸</div>
            <h4 className="text-lg font-bold text-success">¡Pago registrado!</h4>
            <p className="text-muted mt-2">Hemos recibido tu reporte de pago. Un administrador lo validará pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="order-info-box mb-4">
                <p className="text-xs text-muted uppercase font-bold">Orden a pagar</p>
                <p className="font-bold">ORD-{order?.id.toString().padStart(4, '0')}</p>
                <p className="text-sm text-primary font-bold">Monto: ${order?.finalPrice}</p>
              </div>

              <div className="form-group">
                <label className="form-label">Método de Pago</label>
                <select 
                  className="form-select"
                  value={form.paymentMethod}
                  onChange={e => setForm({...form, paymentMethod: e.target.value})}
                >
                  <option value="bank_transfer">Transferencia Bancaria</option>
                  <option value="zelle">Zelle / Pago Móvil</option>
                  <option value="cash">Efectivo (Entrega en oficina)</option>
                </select>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Número de Referencia</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej: 12345678"
                  value={form.reference}
                  onChange={e => setForm({...form, reference: e.target.value})}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Comprobante (Imagen/PDF)</label>
                <div className="file-upload-zone" style={{ padding: '20px' }}>
                  <Upload size={20} className="text-muted" />
                  <p className="text-xs text-muted">Haz clic para subir comprobante</p>
                </div>
              </div>

              <div className="info-box mt-4">
                <Info size={16} />
                <p className="text-xs">Los pagos confirmados después de las 4 PM serán procesados el siguiente día hábil.</p>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Procesando...' : <><Send size={16} /> Reportar Pago</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
