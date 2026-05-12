import Navbar from '../../components/Navbar/Navbar';
import './AppLayout.css';

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <p className="footer-brand-name">TOS Market</p>
              <p className="footer-brand-desc">Marketplace Logístico para Puertos Aduaneros</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <p className="footer-col-title">Servicios</p>
                <a href="#">Aduana</a>
                <a href="#">Transporte</a>
                <a href="#">Inspección</a>
                <a href="#">Almacenamiento</a>
              </div>
              <div className="footer-col">
                <p className="footer-col-title">Plataforma</p>
                <a href="#">Cómo funciona</a>
                <a href="#">Para tiendas</a>
                <a href="#">Para clientes</a>
                <a href="#">Soporte</a>
              </div>
              <div className="footer-col">
                <p className="footer-col-title">Legal</p>
                <a href="#">Términos de uso</a>
                <a href="#">Privacidad</a>
                <a href="#">Comisiones</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 TOS Market. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
