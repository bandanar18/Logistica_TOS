# Design.md

# Sistema de Diseño y Arquitectura Visual
## Marketplace Logístico TOS — Puertos Aduaneros

---

## 1. Identidad visual del producto

El Marketplace Logístico TOS tiene una identidad propia inspirada en el sector logístico-portuario. No copia ni replica ninguna marca, logotipo, paleta exacta ni sistema visual de plataformas existentes como Yelp, Flexport, Freightos u otras.

### 1.1 Principios de diseño

1. Claridad operativa: la interfaz debe comunicar el estado de cada operación de forma inmediata.
2. Jerarquía funcional: la búsqueda y la acción principal deben dominar la pantalla.
3. Confianza institucional: el diseño debe transmitir seriedad, precisión y profesionalismo.
4. Responsividad total: funciona en desktop y mobile sin pérdida de funcionalidad crítica.
5. Accesibilidad básica: contraste suficiente, labels visibles, estados de error comprensibles.
6. Identidad propia del sector: paleta que evoca industria, mar, logística, precisión.

---

## 2. Paleta de colores

### 2.1 Colores primarios

| Token | Hex | Uso |
|---|---|---|
| `--color-primary` | `#1A3C5E` | Color principal de marca, cabeceras, botones CTA primarios |
| `--color-primary-light` | `#2A5F8F` | Hover de botones primarios, acentos |
| `--color-primary-dark` | `#0D2035` | Textos sobre fondo blanco en secciones de marca |

### 2.2 Colores de acento

| Token | Hex | Uso |
|---|---|---|
| `--color-accent` | `#F4A826` | Badges activos, CTAs secundarios, ratings, highlights |
| `--color-accent-light` | `#F7C46A` | Hover en acentos, bordes de selección |

### 2.3 Colores semánticos

| Token | Hex | Uso |
|---|---|---|
| `--color-success` | `#2E7D32` | Estado aprobado, completado, cerrado |
| `--color-success-light` | `#E8F5E9` | Fondo de badge de éxito |
| `--color-warning` | `#E65100` | Estado pendiente, en revisión, vencido |
| `--color-warning-light` | `#FFF3E0` | Fondo de badge de advertencia |
| `--color-danger` | `#C62828` | Estado rechazado, cancelado, error |
| `--color-danger-light` | `#FFEBEE` | Fondo de badge de error |
| `--color-info` | `#0277BD` | Estado en proceso, en ejecución |
| `--color-info-light` | `#E1F5FE` | Fondo de badge de información |

### 2.4 Colores neutros

| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#F5F6FA` | Fondo general de la aplicación |
| `--color-surface` | `#FFFFFF` | Tarjetas, modales, paneles |
| `--color-border` | `#DDE1EA` | Bordes de cards, inputs, separadores |
| `--color-text-primary` | `#1C2A3A` | Textos principales |
| `--color-text-secondary` | `#5A6A7A` | Textos secundarios, subtítulos |
| `--color-text-muted` | `#9AA5B1` | Placeholders, textos desactivados |

---

## 3. Tipografía

| Elemento | Familia | Peso | Tamaño |
|---|---|---|---|
| Display / Hero | Inter | 700 | 2.5rem – 3rem |
| Título de sección | Inter | 600 | 1.5rem – 2rem |
| Subtítulo | Inter | 600 | 1.125rem – 1.25rem |
| Texto de cuerpo | Inter | 400 | 1rem |
| Texto pequeño / label | Inter | 400 | 0.875rem |
| Texto extra pequeño | Inter | 400 | 0.75rem |
| Badge | Inter | 600 | 0.75rem |
| Botón | Inter | 600 | 0.875rem – 1rem |

La fuente principal es **Inter** (Google Fonts). Fallback: `system-ui, -apple-system, sans-serif`.

---

## 4. Espaciado y layout

### 4.1 Sistema de espaciado (base 4px)

| Token | Valor | Uso |
|---|---|---|
| `--space-1` | 4px | Espaciado mínimo |
| `--space-2` | 8px | Padding de badges e íconos |
| `--space-3` | 12px | Padding interno de inputs |
| `--space-4` | 16px | Padding estándar de tarjetas |
| `--space-6` | 24px | Separación entre secciones |
| `--space-8` | 32px | Margen de bloques |
| `--space-12` | 48px | Espaciado de secciones mayores |
| `--space-16` | 64px | Hero y secciones de landing |

### 4.2 Grid y contenedor

- Contenedor máximo: `1280px`.
- Grid principal: 12 columnas.
- Sidebar de filtros: 280px fijo en desktop / colapsable en mobile.
- Layout de tarjetas de resultados: 3 columnas en desktop, 2 en tablet, 1 en mobile.
- Padding lateral de página: `--space-6` en desktop, `--space-4` en mobile.

### 4.3 Breakpoints

| Nombre | Ancho |
|---|---|
| Mobile | < 640px |
| Tablet | 640px – 1024px |
| Desktop | > 1024px |

---

## 5. Componentes del sistema de diseño

### 5.1 Botones

| Variante | Uso | Color base |
|---|---|---|
| `btn-primary` | Acción principal (Solicitar cotización, Aprobar) | `--color-primary` |
| `btn-secondary` | Acción secundaria (Ver perfil, Filtrar) | Borde `--color-primary`, fondo transparente |
| `btn-accent` | CTA de destaque (Publicar servicio) | `--color-accent` |
| `btn-danger` | Acciones destructivas (Cancelar, Rechazar) | `--color-danger` |
| `btn-ghost` | Acciones de bajo impacto visual | Fondo transparente, texto `--color-text-secondary` |
| `btn-icon` | Solo ícono | Cuadrado o circular |

Estados de botón: `default`, `hover`, `active`, `disabled`, `loading`.

Bordes redondeados: `8px` en botones estándar, `24px` en pills/badges.

---

### 5.2 Badges de estado

Los estados operativos, financieros y de entidad se muestran como badges de color.

| Estado | Color badge | Color fondo |
|---|---|---|
| Solicitado | `--color-info` | `--color-info-light` |
| En revisión | `--color-warning` | `--color-warning-light` |
| Aprobado | `--color-success` | `--color-success-light` |
| Rechazado | `--color-danger` | `--color-danger-light` |
| En ejecución | `--color-info` | `--color-info-light` |
| Cerrado | `--color-text-secondary` | `--color-border` |
| Cancelado | `--color-danger` | `--color-danger-light` |
| Pendiente pago | `--color-warning` | `--color-warning-light` |
| Publicado | `--color-success` | `--color-success-light` |

---

### 5.3 Cards

#### ServiceResultCard / StoreResultCard

Estructura:
```
┌──────────────────────────────────────────────┐
│  [Imagen/Logo]   Nombre de Tienda             │
│                  Categoría · Puerto           │
│                  ★★★★☆ (4.2) · 128 órdenes   │
│  Descripción breve del servicio…              │
│  Tarifa referencial: USD 450 / contenedor     │
│  [Badge: Publicado]    [Solicitar cotización] │
└──────────────────────────────────────────────┘
```

Propiedades:
- Borde: `1px solid --color-border`.
- Fondo: `--color-surface`.
- Sombra: `0 2px 8px rgba(0,0,0,0.06)`.
- Hover: sombra aumentada a `0 4px 16px rgba(0,0,0,0.12)`.
- Radio: `12px`.
- Padding: `--space-4`.

---

### 5.4 Inputs y formularios

- Input estándar: fondo blanco, borde `--color-border`, radio `8px`, padding `12px 16px`.
- Focus: borde cambia a `--color-primary`, sombra sutil de foco.
- Error: borde `--color-danger`, mensaje de error en rojo debajo del campo.
- Label: siempre visible encima del input, peso `600`, tamaño `0.875rem`.
- Placeholder: color `--color-text-muted`.
- Textarea: mismas reglas que input, altura mínima `120px`.

---

### 5.5 Tablas administrativas (AdminDataTable)

- Cabecera: fondo `--color-bg`, texto `--color-text-secondary`, peso `600`.
- Filas alternas: fila par con fondo `#FAFBFC`.
- Hover de fila: fondo `#EFF1F7`.
- Acciones por fila: íconos o botones ghost a la derecha.
- Paginación: al pie, centrada, con controles anterior/siguiente.
- Responsive: en mobile, la tabla se convierte en lista de cards.

---

### 5.6 Modales

- Overlay: fondo `rgba(0,0,0,0.5)`.
- Contenedor: fondo blanco, radio `16px`, sombra fuerte.
- Ancho máximo: `600px` en desktop, `100%` en mobile.
- Cabecera del modal: título + botón de cierre.
- Footer del modal: botones de acción alineados a la derecha.
- Cierre: botón X visible, click en overlay, tecla Escape.

---

### 5.7 Timeline de orden y auditoría

Estructura vertical:
```
● Estado 1 — Fecha y hora
│   Descripción del evento. Usuario: nombre.
│
● Estado 2 — Fecha y hora
│   Descripción del evento.
│
● Estado actual (activo)
```

- Punto activo: color `--color-primary`.
- Puntos anteriores: color `--color-success`.
- Línea de conexión: color `--color-border`.

---

### 5.8 Buscador principal (HomeHeroSearch)

Estructura:
```
┌──────────────────────────────────────────────────┐
│   Marketplace Logístico Portuario                 │
│   Encuentra el servicio logístico que necesitas   │
│                                                    │
│  [Categoría ▼] [Puerto ▼] [Buscar]               │
└──────────────────────────────────────────────────┘
```

- Fondo de la sección hero: color primario oscuro o imagen de puerto con overlay.
- El buscador es una barra blanca flotante con sombra.
- Botón de búsqueda: color `--color-accent`.
- En mobile: campos apilados verticalmente.

---

### 5.9 Perfil público de tienda (StorePublicProfile)

Secciones:
1. Header con logo, nombre, badge de estado, rating promedio.
2. Descripción de la tienda y tipos de servicios.
3. Portafolio de servicios (cards).
4. Reviews de clientes.
5. Información de contacto y ubicación (puerto/terminal).
6. Botón principal: "Solicitar cotización".

---

## 6. Pantallas del MVP

### 6.1 Pantallas públicas

| Pantalla | Ruta | Descripción |
|---|---|---|
| Home | `/` | Buscador, categorías, tiendas destacadas |
| Resultados | `/search` | Listado filtrable de servicios/tiendas |
| Perfil de tienda | `/stores/:id` | Perfil público con servicios y reviews |
| Detalle de servicio | `/services/:id` | Ficha del servicio con solicitud de cotización |
| Login | `/login` | Formulario de acceso |
| Registro | `/register` | Formulario de registro con selección de perfil |

### 6.2 Pantallas del cliente

| Pantalla | Ruta | Descripción |
|---|---|---|
| Dashboard | `/dashboard/client` | Resumen de cotizaciones, órdenes y pagos |
| Mis cotizaciones | `/dashboard/client/quotations` | Listado de cotizaciones con estados |
| Detalle de cotización | `/dashboard/client/quotations/:id` | Detalle, documentos, aprobación |
| Mis órdenes | `/dashboard/client/orders` | Listado de órdenes activas y cerradas |
| Detalle de orden | `/dashboard/client/orders/:id` | Timeline, documentos, evidencias |
| Mis documentos | `/dashboard/client/documents` | Gestión documental |
| Mis pagos | `/dashboard/client/payments` | Historial de pagos y comprobantes |

### 6.3 Pantallas de tienda logística

| Pantalla | Ruta | Descripción |
|---|---|---|
| Dashboard | `/dashboard/store` | Resumen de solicitudes, órdenes y comisiones |
| Mi perfil | `/dashboard/store/profile` | Edición de perfil público |
| Mis servicios | `/dashboard/store/services` | CRUD de servicios publicados |
| Cotizaciones recibidas | `/dashboard/store/quotations` | Solicitudes por responder |
| Órdenes asignadas | `/dashboard/store/orders` | Gestión de órdenes activas |
| Documentos | `/dashboard/store/documents` | Carga de evidencias y documentos |
| Pagos y comisiones | `/dashboard/store/payments` | Liquidaciones y comisiones marketplace |

### 6.4 Pantallas del superadministrador

| Pantalla | Ruta | Descripción |
|---|---|---|
| Dashboard global | `/admin` | Métricas generales del marketplace |
| Usuarios | `/admin/users` | Gestión de usuarios y roles |
| Tiendas | `/admin/stores` | Aprobación, rechazo y gestión |
| Servicios | `/admin/services` | Aprobación y administración |
| Catálogos | `/admin/catalogs` | Gestión de catálogos maestros |
| Cotizaciones | `/admin/quotations` | Visión global de cotizaciones |
| Órdenes | `/admin/orders` | Visión global de órdenes |
| Pagos | `/admin/payments` | Revisión de pagos registrados |
| Comisiones | `/admin/commissions` | Reglas y liquidaciones |
| Reportes | `/admin/reports` | Reportes operativos y financieros |
| Auditoría | `/admin/audit` | Log de eventos críticos |

---

## 7. Layouts del sistema

### 7.1 AppLayout

Estructura:
```
┌──────── Navbar ──────────────────────────────────┐
│                                                    │
│                Contenido de página                 │
│                                                    │
└──────── Footer ──────────────────────────────────┘
```

- Navbar: logo izquierda, menú de navegación, botones de sesión a la derecha.
- En mobile: navbar colapsable con menú hamburguesa.

### 7.2 DashboardLayout

Estructura:
```
┌──Sidebar──┬──────────── Contenido ──────────────┐
│           │  [Header de sección]                  │
│  Menú     │                                       │
│  lateral  │  Contenido principal del módulo       │
│  según    │                                       │
│  perfil   │                                       │
└───────────┴───────────────────────────────────────┘
```

- Sidebar: 240px fijo en desktop, colapsable en tablet, drawer en mobile.
- Menú del sidebar: ítems según rol del usuario autenticado.
- Header de sección: título del módulo + breadcrumb + acciones rápidas.

---

## 8. Iconografía

Usar librería **Lucide React** (o similar open source).

Íconos sugeridos por módulo:

| Módulo | Ícono sugerido |
|---|---|
| Servicios | `Package` |
| Búsqueda | `Search` |
| Cotizaciones | `FileText` |
| Órdenes | `ClipboardList` |
| Documentos | `Folder` |
| Pagos | `CreditCard` |
| Comisiones | `Percent` |
| Usuarios | `Users` |
| Tiendas | `Store` |
| Auditoría | `ShieldCheck` |
| Reportes | `BarChart2` |
| Configuración | `Settings` |
| Notificaciones | `Bell` |
| Rating | `Star` |
| Estado activo | `CheckCircle` |
| Estado error | `XCircle` |
| Estado advertencia | `AlertTriangle` |

---

## 9. Estados de interfaz

Todo componente que realiza una operación asíncrona debe manejar los siguientes estados:

| Estado | Representación visual |
|---|---|
| Cargando | Spinner centrado o skeleton loader |
| Vacío | Ilustración + texto descriptivo + CTA opcional |
| Error | Mensaje de error claro + botón de reintentar |
| Éxito | Notificación toast o badge de confirmación |
| Sin permisos | Mensaje claro de acceso denegado |

---

## 10. Notificaciones y toasts

- Posición: esquina superior derecha.
- Duración: 4 segundos por defecto.
- Tipos: `success`, `error`, `warning`, `info`.
- El usuario puede cerrarlas manualmente.
- Máximo 3 toasts apilados simultáneamente.

---

## 11. Diseño de formularios principales

### Solicitud de cotización (RequestQuoteModal)

Campos:
- Servicio solicitado (selector, obligatorio).
- Descripción de la necesidad (textarea).
- Puerto/Terminal de origen (selector de catálogo).
- Fecha estimada de operación (date picker).
- Tipo y cantidad de carga (selector + número).
- Documentos iniciales adjuntos (file uploader).
- Notas adicionales (textarea opcional).

### Respuesta de cotización (QuotationForm - tienda)

Campos:
- Tarifa propuesta (número, moneda).
- Detalle de la tarifa (desglose de ítems).
- Tiempo estimado de ejecución.
- Condiciones y observaciones (textarea).
- Documentos de soporte adjuntos.
- Vigencia de la cotización (fecha).

---

## 12. Reglas de diseño visual obligatorias

1. No copiar colores exactos, logotipos ni sistemas visuales de Yelp, Flexport, Freightos u otras marcas.
2. Usar la paleta definida en este documento.
3. Mantener consistencia de radios, sombras y espaciados definidos.
4. Todo badge de estado debe usar los colores semánticos definidos.
5. Los estados de carga, error y vacío son obligatorios en todos los componentes asíncronos.
6. El diseño debe ser responsive en todas las pantallas críticas.
7. Los formularios siempre deben mostrar validación en tiempo real.
8. Los botones destructivos (cancelar, rechazar, eliminar) deben ser de color `--color-danger` y pedir confirmación.
9. No exponer mensajes de error técnicos al usuario final.
10. El buscador principal debe ser el elemento visual dominante del home.

---

## 13. Estado del documento

| Campo | Estado |
|---|---|
| Documento creado | Sí |
| Pendiente de revisión funcional | Sí |
| Pendiente de revisión técnica | Sí |
| Listo para usar en Antigravity | Sí, como borrador maestro inicial |

---

# Fin del documento
