# Plan.md

# Plan Maestro de Implementación
## Marketplace Logístico TOS — Puertos Aduaneros

---

## 1. Resumen ejecutivo del plan

Este documento define el plan técnico y de ejecución completo para desarrollar el **Marketplace Logístico TOS para Puertos Aduaneros** usando **React.js** (frontend), **Nest.js** (backend) y **MySQL** (base de datos), en la plataforma **Antigravity**.

El plan establece fases, sprints, módulos, entregables, dependencias y criterios de avance para guiar el desarrollo de forma ordenada, modular y controlada.

---

## 2. Objetivo del plan

Convertir la visión del producto y el alcance MVP en un plan de desarrollo ejecutable, dividido en fases, sprints y módulos, con tareas claras para frontend, backend y base de datos, respetando las reglas de arquitectura, seguridad, auditoría y control de alcance definidas para el proyecto.

---

## 3. Stack tecnológico

| Capa | Tecnología | Rol |
|---|---|---|
| Frontend | React.js | Interfaz de usuario, rutas, componentes, formularios, dashboards |
| Backend | Nest.js | API REST, lógica de negocio, seguridad, auditoría, reportes |
| Base de datos | MySQL | Persistencia relacional, catálogos, transacciones, auditoría |
| Autenticación | JWT + RBAC | Control de acceso por perfil y permiso |
| Documentación API | Swagger / OpenAPI | Documentación de endpoints |
| Control de versiones | Git | Ramas por módulo y feature |

---

## 4. Estructura de carpetas del proyecto

```
/logistics-marketplace
  /frontend-react
    /src
      /app
      /assets
      /components
      /features
      /hooks
      /layouts
      /lib
      /pages
      /routes
      /services
      /store
      /types
      /utils
  /backend-nest
    /src
      /auth
      /users
      /roles
      /permissions
      /stores
      /services
      /search
      /quotations
      /orders
      /documents
      /payments
      /commissions
      /reports
      /audit
      /catalogs
      /common
      /config
      /database
  /database-mysql
    /migrations
    /seeds
    /schema
  /docs
  /scripts
  /tests
  README.md
```

---

## 5. Actores del ecosistema

| Código | Actor | Tipo | Participación MVP |
|---|---|---|---|
| ACT-CLI-001 | Cliente | Demandante | Completa |
| ACT-IMP-002 | Importador | Demandante | Parcial |
| ACT-EXP-003 | Exportador | Demandante | Parcial |
| ACT-ADU-004 | Agente aduanal | Proveedor logístico | Completa |
| ACT-TRA-005 | Transportista | Proveedor logístico | Completa como servicio |
| ACT-ALM-006 | Almacén fiscal | Proveedor logístico | Parcial |
| ACT-TER-007 | Terminal portuaria | Proveedor logístico / TOS | Parcial |
| ACT-NAV-008 | Naviera | Proveedor logístico | Referencial |
| ACT-REG-009 | Aduana | Regulador | Referencial |
| ACT-AUP-010 | Autoridad portuaria | Regulador | Referencial |
| ACT-INS-011 | Inspector | Proveedor logístico | Completa como servicio |
| ACT-SEG-012 | Aseguradora | Proveedor financiero | Parcial |
| ACT-BAN-013 | Banco | Proveedor financiero | Parcial |
| ACT-SUP-014 | Superadministrador | Administrador | Completa |

---

## 6. Módulos del MVP

| Nº | Módulo | Prioridad | Estado inicial |
|---:|---|---|---|
| 1 | Usuarios | Alta | Incluido MVP |
| 2 | Autenticación | Alta | Incluido MVP |
| 3 | Roles | Alta | Incluido MVP |
| 4 | Permisos (RBAC) | Alta | Incluido MVP |
| 5 | Catálogos maestros | Alta | Incluido MVP |
| 6 | Tiendas logísticas | Alta | Incluido MVP |
| 7 | Servicios logísticos | Alta | Incluido MVP |
| 8 | Buscador marketplace | Alta | Incluido MVP |
| 9 | Perfil público de tienda | Alta | Incluido MVP |
| 10 | Cotizaciones | Alta | Incluido MVP |
| 11 | Órdenes | Alta | Incluido MVP |
| 12 | Documentos | Alta | Incluido MVP |
| 13 | Pagos referenciales | Media | Incluido MVP |
| 14 | Comisiones | Media | Incluido MVP |
| 15 | Reportes básicos | Media | Incluido MVP |
| 16 | Auditoría | Alta | Incluido MVP |
| 17 | Reviews y ratings | Media | Parcial MVP |
| 18 | TOS básico | Media | Parcial MVP |
| 19 | Transporte | Media | Como servicio/categoría |
| 20 | Almacenamiento | Media | Como servicio/categoría |
| 21 | Inspecciones | Media | Como servicio/categoría |
| 22 | Soporte técnico | Baja | Fase posterior |

---

## 7. Servicios logísticos iniciales (seeds)

| Código | Servicio | Categoría | Unidad | Tarifa ref. |
|---|---|---|---|---|
| SERV-ADU-001 | Despacho aduanero de importación | Aduana | Contenedor | USD 450 |
| SERV-TRA-001 | Transporte terrestre puerto-almacén | Transporte | Viaje | USD 650 |
| SERV-PUE-001 | Gestión de tasas portuarias | Puerto | Contenedor | USD 180 |
| SERV-TER-001 | Movimiento interno de terminal | Terminal | Movimiento | USD 120 |
| SERV-ALM-001 | Almacenamiento fiscal temporal | Almacenamiento | Día | USD 35 |
| SERV-INS-001 | Inspección física de carga | Inspección | Inspección | USD 280 |
| SERV-SEG-001 | Seguro básico de carga | Seguros | Póliza | USD 220 |
| SERV-PAG-001 | Gestión de pagos y comprobantes | Pagos | Gestión | USD 65 |
| SERV-DOC-001 | Preparación documental logística | Documentación | Documento | USD 30 |
| SERV-TEC-001 | Tracking digital de operación | Tecnología | Operación | USD 95 |

---

## 8. Flujo principal del MVP

```
Cliente → Busca servicio → Filtra → Ve perfil de tienda
       → Solicita cotización → Carga documentos iniciales
       → Recibe respuesta de tienda → Aprueba cotización
       → Sistema genera orden → Cliente registra pago
       → Tienda ejecuta y carga evidencias → Orden cerrada
       → Cliente califica servicio → Sistema registra auditoría
```

---

## 9. Fases del proyecto

### Fase 0 — Preparación (Semana 0)

Objetivos: Configurar entorno, estructura y documentación base.

Tareas:
- Crear monorepo con estructura de carpetas.
- Inicializar proyecto React.js con Vite o CRA.
- Inicializar proyecto Nest.js con CLI.
- Configurar MySQL y conexión ORM (TypeORM).
- Configurar variables de entorno.
- Configurar ESLint, Prettier, Husky.
- Crear primer commit con estructura base.
- Configurar rama `develop` y rama `main`.
- Documentar README inicial.

Entregables: Repositorio configurado, estructura de carpetas, conexión a base de datos verificada.

---

### Fase 1 — Autenticación, Usuarios, Roles y Permisos (Sprints 1–2)

Módulos: `auth`, `users`, `roles`, `permissions`

Tareas backend:
- Crear tabla `users` con migración.
- Crear tabla `roles`.
- Crear tabla `permissions`.
- Crear tabla `role_permissions`.
- Crear tabla `user_roles`.
- Implementar endpoint `POST /auth/register`.
- Implementar endpoint `POST /auth/login`.
- Implementar endpoint `POST /auth/logout`.
- Implementar guard JWT.
- Implementar guard RBAC.
- Implementar CRUD básico de usuarios (superadmin).
- Implementar CRUD de roles.
- Implementar CRUD de permisos.
- Registrar auditoría de login, registro y cambios de rol.
- Crear seeds de roles y permisos iniciales.

Tareas frontend:
- Crear `AuthLayout`.
- Crear página `Login`.
- Crear página `Register`.
- Crear rutas protegidas por autenticación.
- Crear menú dinámico según perfil.
- Crear hook `useAuth`.
- Centralizar llamadas a API en `authService`.

Pruebas:
- Prueba unitaria de generación JWT.
- Prueba unitaria de guard RBAC.
- Prueba de integración login/logout.

---

### Fase 2 — Catálogos maestros (Sprint 3)

Módulo: `catalogs`

Tareas backend:
- Crear tabla `catalog_categories`.
- Crear tabla `catalog_items`.
- Implementar CRUD de catálogos.
- Implementar endpoints de consulta pública de catálogos activos.
- Crear seeds iniciales: categorías de servicios, tipos de tiendas, tipos de carga, tipos de contenedores, tipos de documentos, estados operativos, estados financieros, estados aduaneros, puertos, terminales, roles, permisos.

Tareas frontend:
- Crear componente `CatalogManager` en panel superadmin.
- Crear vistas de listado y edición de catálogos.

---

### Fase 3 — Tiendas Logísticas (Sprint 4)

Módulo: `stores`

Tareas backend:
- Crear tabla `stores`.
- Crear tabla `store_documents`.
- Implementar endpoints: registro de tienda, aprobación/rechazo, perfil público, listado.
- Registrar auditoría de cambios de estado de tienda.

Tareas frontend:
- Crear página de registro de tienda.
- Crear `StorePublicProfile`.
- Crear panel de gestión de tiendas en superadmin.
- Crear `StoreResultCard`.

---

### Fase 4 — Servicios Logísticos y Búsqueda (Sprint 5)

Módulos: `services`, `search`

Tareas backend:
- Crear tabla `services`.
- Implementar CRUD de servicios por tienda.
- Implementar flujo de aprobación de servicios.
- Implementar endpoint de búsqueda con filtros (categoría, puerto, terminal, precio, rating).
- Registrar auditoría de publicación y cambios de servicio.

Tareas frontend:
- Crear `HomeHeroSearch`.
- Crear `ServiceCategoryGrid`.
- Crear `SearchResultsPage`.
- Crear `FilterSidebar`.
- Crear `ServiceResultCard`.
- Crear panel de servicios en dashboard de tienda.
- Crear panel de aprobación de servicios en superadmin.

---

### Fase 5 — Cotizaciones (Sprint 6–7)

Módulo: `quotations`

Tareas backend:
- Crear tabla `quotations`.
- Crear tabla `quotation_items`.
- Crear tabla `quotation_documents`.
- Implementar flujo completo: solicitud → revisión → respuesta → aprobación/rechazo → conversión a orden.
- Registrar auditoría de todos los cambios de estado de cotización.

Tareas frontend:
- Crear `RequestQuoteModal`.
- Crear `QuotationForm`.
- Crear página Mis cotizaciones (cliente).
- Crear página Solicitudes de cotización (tienda).
- Crear detalle de cotización.

---

### Fase 6 — Órdenes (Sprint 8)

Módulo: `orders`

Tareas backend:
- Crear tabla `orders`.
- Crear tabla `order_items`.
- Crear tabla `order_status_history`.
- Implementar creación automática desde cotización aprobada.
- Implementar actualización de estado de orden.
- Registrar auditoría de cambios de estado de orden.

Tareas frontend:
- Crear `OrderTimeline`.
- Crear página Mis órdenes (cliente).
- Crear página Órdenes asignadas (tienda).
- Crear detalle de orden.

---

### Fase 7 — Documentos (Sprint 9)

Módulo: `documents`

Tareas backend:
- Crear tabla `documents`.
- Crear tabla `document_types`.
- Implementar carga, validación y descarga de documentos.
- Asociar documentos a cotizaciones, órdenes, tiendas y usuarios.
- Registrar auditoría de carga y validación documental.

Tareas frontend:
- Crear `DocumentUploader`.
- Crear vistas de documentos por cotización, orden y tienda.
- Implementar estados de carga y error en uploader.

---

### Fase 8 — Pagos y Comisiones (Sprint 10)

Módulos: `payments`, `commissions`

Tareas backend:
- Crear tabla `payments`.
- Crear tabla `commissions`.
- Crear tabla `commission_rules`.
- Implementar registro referencial de pago.
- Implementar cálculo automático de comisión del marketplace.
- Registrar auditoría de pagos y comisiones.

Tareas frontend:
- Crear `PaymentSummaryCard`.
- Crear páginas de pagos en cliente, tienda y superadmin.
- Crear vista de comisiones en superadmin.

---

### Fase 9 — Reviews, Reportes y Auditoría (Sprint 11–12)

Módulos: `reviews`, `reports`, `audit`

Tareas backend:
- Crear tabla `reviews`.
- Implementar creación de review al cerrar orden.
- Crear endpoints de reportes por perfil.
- Crear endpoint de consulta de auditoría.

Tareas frontend:
- Crear `AuditTimeline`.
- Crear `ReportExportButton`.
- Crear `AdminDataTable` con filtros.
- Crear panel de reportes en superadmin.
- Crear panel de auditoría en superadmin.

---

### Fase 10 — TOS Básico (Sprint 13)

Módulo: `tos` (parcial)

Tareas backend:
- Crear tabla `containers` (referencial).
- Crear tabla `yard_positions` (referencial).
- Crear tabla `gate_events` (referencial).
- Implementar endpoints básicos de consulta TOS.

Tareas frontend:
- Crear vista básica de patio/contenedores para operador interno.

---

### Fase 11 — Integración, QA y Demo (Sprints 14–15)

Tareas:
- Integración end-to-end de todos los flujos del MVP.
- Pruebas de integración por perfil (cliente, tienda, superadmin).
- Pruebas de permisos y rutas protegidas.
- Verificación de auditoría en eventos críticos.
- Creación de seeds de datos demo.
- Build de producción.
- Despliegue en ambiente demo.
- Documentación técnica final.

---

## 10. Roadmap por sprints

| Sprint | Semanas | Módulos | Entregables clave |
|---:|---|---|---|
| Sprint 0 | 1 | Setup | Entorno configurado, estructura lista |
| Sprint 1 | 2–3 | Auth, Usuarios | Login, registro, JWT, roles, permisos |
| Sprint 2 | 4 | Catálogos | Seeds completos, panel de catálogos |
| Sprint 3 | 5–6 | Tiendas | Registro, aprobación, perfil público |
| Sprint 4 | 7–8 | Servicios, Búsqueda | Publicación, buscador con filtros |
| Sprint 5 | 9–10 | Cotizaciones | Flujo completo de cotización |
| Sprint 6 | 11 | Órdenes | Creación y gestión de órdenes |
| Sprint 7 | 12 | Documentos | Carga, validación, asociación |
| Sprint 8 | 13 | Pagos, Comisiones | Registro referencial y cálculo |
| Sprint 9 | 14 | Reviews, Reportes, Auditoría | Panel completo superadmin |
| Sprint 10 | 15 | TOS básico | Vista referencial de patio |
| Sprint 11 | 16–17 | Integración y QA | Pruebas end-to-end, datos demo |
| Sprint 12 | 18 | Deploy demo | Build y ambiente demo funcional |

---

## 11. Tablas MySQL mínimas del MVP

| Nº | Tabla | Módulo |
|---:|---|---|
| 1 | `users` | Usuarios |
| 2 | `profiles` | Usuarios |
| 3 | `roles` | Roles |
| 4 | `permissions` | Permisos |
| 5 | `role_permissions` | Roles/Permisos |
| 6 | `user_roles` | Usuarios/Roles |
| 7 | `catalog_categories` | Catálogos |
| 8 | `catalog_items` | Catálogos |
| 9 | `stores` | Tiendas |
| 10 | `store_documents` | Tiendas/Documentos |
| 11 | `services` | Servicios |
| 12 | `service_categories` | Servicios |
| 13 | `quotations` | Cotizaciones |
| 14 | `quotation_items` | Cotizaciones |
| 15 | `quotation_documents` | Cotizaciones |
| 16 | `orders` | Órdenes |
| 17 | `order_items` | Órdenes |
| 18 | `order_status_history` | Órdenes |
| 19 | `documents` | Documentos |
| 20 | `document_types` | Documentos |
| 21 | `payments` | Pagos |
| 22 | `commission_rules` | Comisiones |
| 23 | `commissions` | Comisiones |
| 24 | `reviews` | Reviews |
| 25 | `audit_logs` | Auditoría |
| 26 | `ports` | Catálogos |
| 27 | `terminals` | Catálogos |
| 28 | `ecosystem_actors` | Catálogos |
| 29 | `containers` | TOS |
| 30 | `gate_events` | TOS |

---

## 12. Endpoints mínimos del MVP (Nest.js)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Usuarios
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Roles y Permisos
- `GET /roles`
- `POST /roles`
- `GET /permissions`
- `POST /permissions`
- `POST /roles/:id/permissions`

### Catálogos
- `GET /catalogs`
- `GET /catalogs/:category`
- `POST /catalogs`
- `PATCH /catalogs/:id`

### Tiendas
- `POST /stores`
- `GET /stores`
- `GET /stores/:id`
- `PATCH /stores/:id`
- `POST /stores/:id/approve`
- `POST /stores/:id/reject`

### Servicios
- `POST /services`
- `GET /services`
- `GET /services/:id`
- `PATCH /services/:id`
- `POST /services/:id/publish`
- `GET /search/services`

### Cotizaciones
- `POST /quotations`
- `GET /quotations`
- `GET /quotations/:id`
- `POST /quotations/:id/respond`
- `POST /quotations/:id/approve`
- `POST /quotations/:id/reject`
- `POST /quotations/:id/convert`

### Órdenes
- `POST /orders`
- `GET /orders`
- `GET /orders/:id`
- `PATCH /orders/:id/status`

### Documentos
- `POST /documents/upload`
- `GET /documents`
- `GET /documents/:id`
- `DELETE /documents/:id`

### Pagos
- `POST /payments`
- `GET /payments`
- `GET /payments/:id`
- `PATCH /payments/:id/status`

### Comisiones
- `GET /commissions`
- `POST /commission-rules`
- `GET /commission-rules`

### Reviews
- `POST /reviews`
- `GET /reviews/store/:storeId`

### Reportes
- `GET /reports/quotations`
- `GET /reports/orders`
- `GET /reports/payments`
- `GET /reports/commissions`

### Auditoría
- `GET /audit`
- `GET /audit/:entityType/:entityId`

---

## 13. Componentes React mínimos del MVP

| Componente | Descripción |
|---|---|
| `AppLayout` | Layout raíz de la aplicación |
| `AuthLayout` | Layout para login y registro |
| `DashboardLayout` | Layout para paneles privados |
| `HomeHeroSearch` | Buscador principal del home |
| `ServiceCategoryGrid` | Grilla de categorías |
| `SearchResultsPage` | Página de resultados con filtros |
| `FilterSidebar` | Panel lateral de filtros |
| `ServiceResultCard` | Tarjeta de resultado de servicio |
| `StoreResultCard` | Tarjeta de tienda en resultados |
| `StorePublicProfile` | Perfil público de tienda |
| `RequestQuoteModal` | Modal de solicitud de cotización |
| `QuotationForm` | Formulario de respuesta de cotización |
| `OrderTimeline` | Timeline de estado de orden |
| `DocumentUploader` | Cargador de documentos |
| `PaymentSummaryCard` | Resumen de pago |
| `AuditTimeline` | Timeline de eventos de auditoría |
| `AdminDataTable` | Tabla administrativa con filtros |
| `RolePermissionMatrix` | Matriz de roles y permisos |
| `CatalogManager` | Gestión de catálogos |
| `ReportExportButton` | Exportación de reportes |

---

## 14. Dependencias del proyecto

### Funcionales
- Visión del producto definida (01_PRODUCT_VISION.md).
- Alcance MVP definido (02_MVP_SCOPE.md).
- Actores y perfiles definidos (04_ECOSYSTEM_ACTORS_MATRIX.md).
- Catálogos maestros iniciales definidos.
- Reglas de comisión definidas.

### Técnicas
- Node.js >= 18.
- React.js >= 18.
- Nest.js >= 10.
- MySQL >= 8.
- TypeORM configurado.
- Variables de entorno definidas.
- JWT configurado.

---

## 15. Criterios de aceptación del MVP

El MVP se considera exitoso cuando:

1. Un usuario puede registrarse e iniciar sesión.
2. El sistema diferencia perfiles por rol.
3. Una tienda puede registrarse y ser aprobada por superadmin.
4. Una tienda puede publicar servicios.
5. Un cliente puede buscar y filtrar servicios.
6. Un cliente puede ver el perfil público de una tienda.
7. Un cliente puede solicitar cotización.
8. Una tienda puede responder cotización.
9. Un cliente puede aprobar cotización.
10. El sistema crea automáticamente una orden desde cotización aprobada.
11. Se pueden cargar documentos asociados a la operación.
12. Se puede registrar un pago referencial.
13. El sistema calcula comisión automáticamente.
14. El sistema registra auditoría de eventos críticos.
15. El superadministrador puede consultar reportes básicos.
16. Las rutas privadas están protegidas.
17. Los endpoints críticos requieren JWT y RBAC.
18. La interfaz funciona en desktop y mobile.

---

## 16. Fuera del alcance del MVP

Los siguientes elementos quedan diferidos para fases posteriores:

- Integración bancaria real.
- Pasarela de pagos automática.
- Facturación fiscal.
- Integración con aduana o navieras.
- GPS en tiempo real.
- OCR documental.
- Inteligencia artificial de recomendación.
- TOS avanzado con mapa gráfico de patio.
- App móvil nativa.
- EDI portuario.
- Blockchain.
- Integración directa con Odoo.

---

## 17. Riesgos principales

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Alcance expandido sin control | Alto | Mantener lista de exclusiones activa |
| Permisos mal configurados | Alto | Probar RBAC por perfil desde Sprint 1 |
| Catálogos incompletos | Medio | Crear seeds revisables desde el inicio |
| Errores en cálculo de comisiones | Alto | Pruebas unitarias de cálculo financiero |
| Diseño poco usable | Medio | Validar flujo tipo marketplace en Sprint 4 |
| Falta de auditoría | Alto | Implementar audit log desde Sprint 1 |
| Datos sin trazabilidad documental | Alto | Asociar documentos a todas las entidades |
| Antigravity modifica sin control | Alto | Aplicar Rules.md en todo momento |

---

## 18. Estado del documento

| Campo | Estado |
|---|---|
| Documento creado | Sí |
| Pendiente de revisión funcional | Sí |
| Pendiente de revisión técnica | Sí |
| Listo para usar en Antigravity | Sí, como borrador maestro inicial |

---

# Fin del documento
