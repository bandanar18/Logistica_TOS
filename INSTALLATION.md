# Guía de Instalación Local - Marketplace Logístico TOS

Esta guía detalla los pasos para levantar el entorno de desarrollo del Marketplace Logístico TOS.

## Requisitos Previos

- Node.js (v18+)
- MySQL (v8+)
- Git

## Estructura del Proyecto

```text
/backend-nest  - API REST construida con Nest.js
/frontend-react - Interfaz de usuario construida con React.js
/docs           - Documentación maestra del proyecto
```

## Pasos para la Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Logistica_TOS
```

### 2. Configurar el Backend
1. Ir a la carpeta del backend:
   ```bash
   cd backend-nest
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   *Nota: Edite `.env` con sus credenciales de MySQL.*
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run start:dev
   ```

### 3. Configurar el Frontend
1. Ir a la carpeta del frontend:
   ```bash
   cd frontend-react
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Acceso al Sistema

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)
- **Swagger Docs**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Usuarios de Prueba (Seeds)
Consulte la [Guía de Seeds](./SEEDS_GUIDE.md) para conocer las credenciales de acceso predeterminadas.
