# Guía de Seeds y Usuarios Demo - Marketplace Logístico TOS

La base de datos se inicializa automáticamente con datos de prueba (seeds) para facilitar la navegación por todos los perfiles del sistema.

## Credenciales de Acceso (Password común: `password123`)

| Perfil | Email | Propósito |
|---|---|---|
| **Superadministrador** | `admin@admin.com` | Gestión global, aprobaciones y KPIs ejecutivos. |
| **Tienda Logística** | `store@store.com` | Publicar servicios, responder cotizaciones y ver comisiones. |
| **Cliente Final** | `client@client.com` | Buscar servicios, solicitar cotizaciones y realizar pagos. |
| **Auditor** | `auditor@auditor.com` | Visualización de logs de auditoría y reportes de trazabilidad. |
| **Transportista** | `carrier@carrier.com` | Gestión de viajes, estados de transporte y PODs. |
| **Almacén Fiscal** | `warehouse@warehouse.com` | Control de inventario, ubicaciones y despachos. |
| **Inspector** | `inspector@inspector.com` | Ejecución de checklists y carga de evidencias. |

## Cómo cargar los datos

Los datos se cargan automáticamente al iniciar el backend si la base de datos está vacía (usando el decorador de sincronización y lógica de inicialización en el servicio principal).

Si desea forzar una recarga limpia:
1. Detenga el backend.
2. Elimine la base de datos `logistica_tos` en MySQL.
3. Cree una base de datos vacía: `CREATE DATABASE logistica_tos;`.
4. Inicie el backend: `npm run start:dev`.

## Datos Incluidos
- **Catálogos**: Puertos, categorías de servicios, tipos de carga, estados operativos.
- **Tiendas**: 3 tiendas preconfiguradas (una pendiente de aprobación).
- **Servicios**: Directorio inicial de transporte, almacenamiento e inspección.
- **Reglas de Comisión**: 5% global para el marketplace.
- **Auditoría**: Registros iniciales de creación de perfiles.
