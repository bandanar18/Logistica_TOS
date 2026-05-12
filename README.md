# Logistica TOS Marketplace

Marketplace logistico MVP con backend NestJS, frontend React/Vite y MySQL. Permite probar el ciclo completo: registro/login, busqueda de servicios, solicitud y respuesta de cotizaciones, aprobacion, creacion de orden, pago, documentos, ejecucion, review, auditoria, reportes y comisiones.

## Requisitos

- Node.js 20 o superior recomendado.
- npm.
- Docker Desktop para levantar MySQL facilmente.
- Puerto `3000` libre para backend.
- Puerto `5173` libre para frontend Vite.
- Puerto `3306` libre para MySQL.

## Estructura

- `backend-nest`: API NestJS, TypeORM y MySQL.
- `frontend-react`: aplicacion React/Vite.
- `docker-compose.yml`: MySQL 8 para desarrollo local.

## Configuracion

El backend puede correr con valores por defecto, pero se recomienda crear un `.env` local desde el ejemplo:

```bash
cd backend-nest
copy .env.example .env
```

Variables disponibles:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=logistica_tos
JWT_SECRET=change_me_for_local_development
```

## Instalacion

Desde la raiz del proyecto:

```bash
cd backend-nest
npm install
```

```bash
cd ../frontend-react
npm install
```

## Base De Datos

Levantar MySQL desde la raiz del proyecto:

```bash
docker compose up -d
```

El contenedor crea la base `logistica_tos` con usuario `root` y password `root`.

## Datos Demo

Con MySQL corriendo, ejecutar el seed:

```bash
cd backend-nest
npm run seed
```

El seed es idempotente: se puede ejecutar varias veces sin duplicar los datos demo principales.

### Usuarios De Prueba

Todos usan la misma contrasena:

```text
password123
```

| Rol | Email | Uso |
| --- | --- | --- |
| Admin | `admin@tos.com` | Administrar usuarios, pagos, reportes, comisiones y auditoria. |
| Cliente | `client@tos.com` | Buscar servicios, solicitar cotizaciones, aprobar, pagar, cargar documentos y reseñar. |
| Tienda | `store@tos.com` | Responder cotizaciones, gestionar ordenes, ver documentos, TOS, almacen, transporte e inspecciones. |
| Inspector | `inspector@tos.com` | Usuario demo para inspecciones. |

## Ejecutar El Proyecto

Terminal 1, backend:

```bash
cd backend-nest
npm run start:dev
```

El backend queda en:

```text
http://localhost:3000
```

Terminal 2, frontend:

```bash
cd frontend-react
npm run dev
```

El frontend queda normalmente en:

```text
http://localhost:5173
```

## Verificacion Rapida

Backend:

```bash
cd backend-nest
npm run build
npm test
```

Frontend:

```bash
cd frontend-react
npm run build
```

## Flujo Completo Del MVP

### 1. Login Como Cliente

Entrar al frontend y hacer login con:

```text
client@tos.com / password123
```

Tambien se puede usar el login demo si la UI lo muestra.

### 2. Buscar Servicios

Ir a `Buscar Servicios` o `/search`.

Se deben ver servicios demo publicados:

- Despacho Aduanero Importacion.
- Transporte Puerto a Almacen.
- Almacenamiento Fiscal por 7 dias.
- Inspeccion fisica de contenedor.

Se puede filtrar por categoria, puerto y rating minimo.

### 3. Solicitar Cotizacion

Desde una tarjeta de servicio, presionar `Cotizar`.

Completar:

- Tipo de carga.
- Fecha estimada.
- Cantidad o volumen.
- Notas.

Esto crea una cotizacion en estado `pending` para la tienda.

### 4. Responder Cotizacion Como Tienda

Cerrar sesion e iniciar con:

```text
store@tos.com / password123
```

Ir a:

```text
/dashboard/store/quotations
```

Acciones esperadas:

- Ver cotizaciones pendientes.
- Presionar `Responder`.
- Ingresar monto y notas.

La cotizacion pasa a `responded`.

### 5. Aprobar Cotizacion Como Cliente

Volver a iniciar como cliente:

```text
client@tos.com / password123
```

Ir a:

```text
/dashboard/client/quotations
```

Acciones esperadas:

- Ver cotizaciones respondidas.
- Presionar `Aprobar`.

El sistema aprueba la cotizacion y crea una orden automaticamente.

### 6. Registrar Pago

Como cliente, ir a:

```text
/dashboard/client
```

En ordenes pendientes, presionar `Reportar Pago`.

Completar:

- Metodo.
- Referencia.
- URL del comprobante.

El pago queda en `pending` para validacion admin.

### 7. Confirmar O Rechazar Pago Como Admin

Entrar como admin:

```text
admin@tos.com / password123
```

Ir a:

```text
/admin/payments
```

Acciones esperadas:

- `Confirmar`: valida el pago.
- `Rechazar`: abre modal para motivo de rechazo.

### 8. Ejecutar Orden Como Tienda

Entrar como tienda:

```text
store@tos.com / password123
```

Ir a:

```text
/dashboard/store/orders
```

Acciones esperadas:

- Si la orden tiene pago confirmado completo, `Iniciar` cambia a `in_progress`.
- Luego `Completar` cambia a `completed`.

Si no existe pago confirmado completo, el backend bloquea el inicio de la orden.

### 9. Cargar Documentos

Como cliente o tienda, ir a:

```text
/dashboard/client/documents
```

o

```text
/dashboard/store/documents
```

Presionar `+ Cargar documento` y completar:

- ID de orden.
- Tipo.
- Nombre.
- URL del archivo.

Nota: en este MVP los documentos se guardan por URL. No hay upload binario real todavia.

### 10. Validar Documentos Como Admin

Entrar como admin e ir a:

```text
/admin/documents
```

Si la ruta no esta en el menu, se puede navegar directamente si esta registrada. Los documentos tambien son visibles desde los dashboards cliente/tienda.

### 11. Crear Review Como Cliente

Como cliente, ir a:

```text
/dashboard/client/orders
```

En una orden `completed`, presionar `Reseñar`.

Reglas:

- Solo el cliente dueno de la orden puede crear review.
- Solo ordenes completadas pueden recibir review.
- No se permite duplicar review para la misma orden.

El rating de la tienda se refleja en busqueda y perfil publico.

### 12. Auditoria

Como admin, ir a:

```text
/admin/audit
```

Se registran eventos como:

- Creacion de cotizacion.
- Respuesta de cotizacion.
- Cambio de estado.
- Creacion de orden.
- Registro/confirmacion/rechazo de pagos.
- Carga de documentos.
- Creacion de reviews.

Tambien existe endpoint por entidad:

```text
GET /audit/:type/:id
```

Ejemplo:

```text
GET /audit/order/1
```

### 13. Reportes Y Comisiones

Como admin:

```text
/admin/reports
/admin/commissions
```

Reportes muestra resumen operativo del MVP.

Comisiones calcula comisiones demo sobre ordenes y permite estados:

- `pending`
- `earned`
- `settled`
- `withheld`

### 14. Modulos Operativos Demo

Como tienda o admin se pueden revisar datos demo en:

- TOS: contenedores y patios.
- Almacenamiento: inventario y ubicaciones.
- Transporte: viajes, vehiculos y choferes.
- Inspecciones: inspeccion documental completada.

## Datos Demo Ya Incluidos Por Seed

El seed crea un caso para probar distintos estados sin tener que ejecutar todo desde cero:

- Una cotizacion `pending` para que tienda responda.
- Una cotizacion `responded` para que cliente apruebe.
- Una orden `pending` con pago `pending`.
- Una orden `completed` con pago `confirmed`.
- Documento pendiente y documento aprobado.
- Review demo.
- Comisiones demo.
- Datos TOS, almacen, transporte e inspeccion.

## Endpoints Principales

- `POST /auth/register`
- `POST /auth/login`
- `GET /catalogs/:code`
- `GET /services/search`
- `GET /stores/public/:id`
- `POST /quotations`
- `PATCH /quotations/:id/respond`
- `PATCH /quotations/:id/status`
- `POST /quotations/:id/convert-to-order`
- `GET /orders`
- `PATCH /orders/:id/status`
- `POST /payments`
- `PATCH /payments/:id/confirm`
- `PATCH /payments/:id/reject`
- `POST /documents`
- `GET /documents`
- `POST /reviews`
- `GET /audit`
- `GET /reports`
- `GET /commissions`

## Problemas Comunes

### MySQL No Conecta

Verificar que Docker este corriendo:

```bash
docker compose ps
```

Si el puerto `3306` esta ocupado, detener otro MySQL local o cambiar el puerto en `docker-compose.yml` y `.env`.

### No Aparecen Datos

Ejecutar nuevamente:

```bash
cd backend-nest
npm run seed
```

### Token Invalido O Sesion Vieja

Cerrar sesion desde la UI o limpiar `localStorage` del navegador.

### La Orden No Inicia

Es esperado si no tiene pago confirmado completo. Entrar como admin y confirmar el pago en `/admin/payments`.

## Estado Del MVP

Funcional para pruebas locales end-to-end. Pendiente para produccion:

- Upload binario real de documentos/comprobantes.
- DTOs completos por endpoint.
- Migraciones en lugar de `synchronize: true`.
- Configuracion CORS por ambiente.
- Mejoras visuales en pantallas de detalle.
- Tests e2e del flujo completo.
