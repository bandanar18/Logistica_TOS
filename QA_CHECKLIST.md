# Checklist de QA Operativo - Marketplace Logístico TOS

Este checklist resume las pruebas críticas que deben pasar antes de considerar una funcionalidad como "Aceptada" para el MVP.

## 1. Seguridad y Acceso
- [ ] Login exitoso con todos los perfiles (Admin, Cliente, Tienda, etc.).
- [ ] Bloqueo de acceso a rutas privadas sin token (401).
- [ ] Bloqueo de acceso a módulos administrativos para perfiles no autorizados (403).
- [ ] Validación de Scopes: Un cliente no puede ver órdenes de otro cliente.
- [ ] Validación de Scopes: Una tienda no puede ver comisiones de otra tienda.

## 2. Flujo Comercial (E2E)
- [ ] Búsqueda de servicios: Los resultados muestran solo servicios publicados.
- [ ] Solicitud de cotización: Se crea correctamente y notifica a la tienda.
- [ ] Respuesta de tienda: La tienda puede ajustar precios y términos.
- [ ] Aprobación de cliente: La cotización aprobada genera automáticamente una Orden.
- [ ] Registro de pago: El cliente puede subir comprobantes PDF/Imagen.
- [ ] Confirmación de pago: Solo el Admin/Financiero puede confirmar el pago.

## 3. Finanzas y Auditoría
- [ ] Cálculo de comisión: El 5% (o regla configurada) se calcula correctamente en el backend.
- [ ] Neto proveedor: El monto a pagar a la tienda es correcto (Total - Comisión).
- [ ] Audit Trail: Cada cambio de estado de orden/pago genera un log con el diferencial (old/new value).
- [ ] Audit Trail: Exportaciones de reportes quedan registradas con el motivo y usuario.

## 4. Operaciones Logísticas
- [ ] TOS: Registro de contenedores y validación de bloqueos (holds) antes del despacho.
- [ ] Transporte: Creación de viajes y carga de POD (Proof of Delivery).
- [ ] Almacenamiento: Registro de entradas/salidas y control de inventario por ubicación.
- [ ] Inspecciones: Completado de checklists y carga de evidencias fotográficas.

## 5. Reportes y UX
- [ ] Dashboards: Los KPIs (Total Ventas, Comisiones, Órdenes) se actualizan en tiempo real.
- [ ] Diseño Responsive: La interfaz es utilizable en Desktop y Mobile.
- [ ] Swagger: Todos los endpoints nuevos están documentados y probables desde la UI de Swagger.
- [ ] Errores: El sistema muestra mensajes claros ante fallos (400, 404, 500).

---
*Referencia: 35_QA_MASTER_TEST_PLAN.md*
