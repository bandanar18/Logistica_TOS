import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/Home/HomePage';
import SearchPage from './pages/Search/SearchPage';
import StoreProfilePage from './pages/StoreProfile/StoreProfilePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ClientDashboard from './pages/Dashboards/Client/ClientDashboard';
import StoreDashboard from './pages/Dashboards/Store/StoreDashboard';
import StoreProfileSettings from './pages/Dashboards/Store/StoreProfileSettings';
import StoreServicesPage from './pages/Dashboards/Store/StoreServicesPage';
import TripsPage from './pages/Dashboards/Store/TripsPage';
import InventoryPage from './pages/Dashboards/Store/InventoryPage';
import AdminDashboard from './pages/Dashboards/Admin/AdminDashboard';

// Generic dashboard pages (placeholder)
import GenericDashPage from './pages/Dashboards/GenericDashPage';

// Protected Route
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/stores/:id" element={<StoreProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Client Dashboard */}
      <Route path="/dashboard/client" element={
        <ProtectedRoute requiredRole="client"><ClientDashboard /></ProtectedRoute>
      } />
      <Route path="/dashboard/client/quotations" element={
        <ProtectedRoute requiredRole="client">
          <GenericDashPage title="Mis Cotizaciones" role="client" module="quotations" />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/client/orders" element={
        <ProtectedRoute requiredRole="client">
          <GenericDashPage title="Mis Órdenes" role="client" module="orders" />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/client/documents" element={
        <ProtectedRoute requiredRole="client">
          <GenericDashPage title="Mis Documentos" role="client" module="documents" />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/client/payments" element={
        <ProtectedRoute requiredRole="client">
          <GenericDashPage title="Mis Pagos" role="client" module="payments" />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/client/reviews" element={
        <ProtectedRoute requiredRole="client">
          <GenericDashPage title="Mis Reseñas" role="client" module="reviews" />
        </ProtectedRoute>
      } />

      {/* Store Dashboard */}
      <Route path="/dashboard/store" element={
        <ProtectedRoute requiredRole="store"><StoreDashboard /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/profile" element={
        <ProtectedRoute requiredRole="store"><StoreProfileSettings /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/services" element={
        <ProtectedRoute requiredRole="store"><StoreServicesPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/quotations" element={
        <ProtectedRoute requiredRole="store"><GenericDashPage title="Cotizaciones" role="store" module="quotations" /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/orders" element={
        <ProtectedRoute requiredRole="store"><GenericDashPage title="Órdenes" role="store" module="orders" /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/documents" element={
        <ProtectedRoute requiredRole="store"><GenericDashPage title="Documentos" role="store" module="documents" /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/payments" element={
        <ProtectedRoute requiredRole="store"><GenericDashPage title="Pagos y Comisiones" role="store" module="payments" /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/reviews" element={
        <ProtectedRoute requiredRole="store"><GenericDashPage title="Reviews" role="store" module="reviews" /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/tos" element={
        <ProtectedRoute requiredRole="store"><GenericDashPage title="TOS (Patios)" role="store" module="tos" /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/storage" element={
        <ProtectedRoute requiredRole="store"><InventoryPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/transport" element={
        <ProtectedRoute requiredRole="store"><TripsPage /></ProtectedRoute>
      } />
      <Route path="/dashboard/store/inspections" element={
        <ProtectedRoute requiredRole="store"><GenericDashPage title="Inspecciones" role="store" module="inspections" /></ProtectedRoute>
      } />

      {/* Admin Dashboard */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Usuarios" role="admin" module="users" />
        </ProtectedRoute>
      } />
      <Route path="/admin/stores" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Tiendas" role="admin" module="stores" />
        </ProtectedRoute>
      } />
      <Route path="/admin/services" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Servicios" role="admin" module="services" />
        </ProtectedRoute>
      } />
      <Route path="/admin/catalogs" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Catálogos Maestros" role="admin" module="catalogs" />
        </ProtectedRoute>
      } />
      <Route path="/admin/quotations" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Cotizaciones" role="admin" module="quotations" />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Órdenes" role="admin" module="orders" />
        </ProtectedRoute>
      } />
      <Route path="/admin/payments" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Pagos" role="admin" module="payments" />
        </ProtectedRoute>
      } />
      <Route path="/admin/documents" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Documentos" role="admin" module="documents" />
        </ProtectedRoute>
      } />
      <Route path="/admin/commissions" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Comisiones" role="admin" module="commissions" />
        </ProtectedRoute>
      } />
      <Route path="/admin/reviews" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Reviews" role="admin" module="reviews" />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Reportes" role="admin" module="reports" />
        </ProtectedRoute>
      } />
      <Route path="/admin/audit" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Auditoría" role="admin" module="audit" />
        </ProtectedRoute>
      } />
      <Route path="/admin/tos" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="TOS (Patios)" role="admin" module="tos" />
        </ProtectedRoute>
      } />
      <Route path="/admin/storage" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Almacenamiento" role="admin" module="storage" />
        </ProtectedRoute>
      } />
      <Route path="/admin/transport" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Transporte" role="admin" module="transport" />
        </ProtectedRoute>
      } />
      <Route path="/admin/inspections" element={
        <ProtectedRoute requiredRole="admin">
          <GenericDashPage title="Inspecciones" role="admin" module="inspections" />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
