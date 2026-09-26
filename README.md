# Morón Resuelve — Manual y Documentación de Uso

Plataforma digital de participación ciudadana y gestión operativa de incidencias urbanas del Municipio de Morón, desarrollada bajo los estándares de las **Olimpíadas Técnico-Profesionales de Programación**.

---

## 1. Descripción General del Sistema y Propósito

**Morón Resuelve** es una solución integral orientada a modernizar y agilizar el reporte, seguimiento y resolución de problemas en el espacio público del **Partido de Morón** (Provincia de Buenos Aires, Argentina).

El sistema cubre las **7 Unidades de Gestión Comunitaria (UGC)** del distrito:

1. **Morón Centro (UGC 1)**
2. **Haedo (UGC 2)**
3. **El Palomar (UGC 3)**
4. **Castelar Norte (UGC 4)**
5. **Castelar Sur (UGC 5)**
6. **Morón Sur (UGC 6)**
7. **Villa Sarmiento (UGC 7)**

### Objetivos Clave

- **Para el Vecino:** Canalizar reclamos con georreferenciación precisa en mapa interactivo (acotado al distrito de Morón), evidencia fotográfica, categorización guiada de 20 tipos de fallas urbanas y seguimiento paso a paso en tiempo real.
- **Para el Municipio (Inspectores y Cuadrillas):** Panel unificado de control municipal (_Mesa Operativa_) para priorizar intervenciones por nivel de urgencia, filtrar por área de competencia, asignar cuadrillas de trabajo, dejar notas técnicas y cambiar estados de los reclamos.
- **Alta Disponibilidad y Resiliencia:** Arquitectura dual frontend-backend. La aplicación cuenta con comunicación asíncrona hacia una **API REST en ASP.NET Core** con persistencia en **PostgreSQL**, respaldada por un motor de sincronización y fallback offline en **LocalStorage** que permite operar sin interrupciones incluso ante cortes de conectividad.

---

## 2. Requisitos Previos e Instalación

### 2.1. Requisitos de Software

- **Node.js**: v18.0.0 o superior (recomendado v20 LTS).
- **npm** o **pnpm**.
- **.NET SDK**: versión 10.0 (o superior).
- **PostgreSQL**: versión 14 o superior (en ejecución en el puerto `5432`).
- **Docker y Docker Compose** (opcional para ejecución en contenedores).

---

### 2.2. Variables de Entorno y Configuración

#### A. Backend (`proyecto_API/appsettings.json`)

El archivo de configuración principal de la API contiene la cadena de conexión a PostgreSQL y los parámetros de firma JWT:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=moron_resuelve;Username=postgres;Password=TU_PASSWORD"
  },
  "Jwt": {
    "Key": "esta-clave-debe-ser-larga-y-secreta-minimo-32-caracteres-moron-resuelve-2025",
    "Issuer": "MoronResuelve",
    "Audience": "MoronResuelve"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

#### B. Frontend (`.env` en la raíz)

En la carpeta raíz del proyecto frontend, se puede configurar opcionalmente el archivo `.env`:

```env
# Puerto y configuración del cliente
VITE_API_URL=/api
VITE_ADMIN_USER=admin
VITE_ADMIN_PASS=admin123
```

---

### 2.3. Puesta en Marcha Paso a Paso

#### Paso 1: Base de Datos (PostgreSQL)

1. Iniciar el servicio local de PostgreSQL.
2. Crear la base de datos (o dejar que Entity Framework la cree automáticamente al arrancar):
   ```sql
   CREATE DATABASE moron_resuelve;
   ```

#### Paso 2: Levantar el Backend (ASP.NET Core API)

1. Abrir una terminal en la carpeta `proyecto_API`:
   ```bash
   cd proyecto_API
   ```
2. Restaurar paquetes NuGet:
   ```bash
   dotnet restore BuffetApp.Api.csproj
   ```
3. Ejecutar las migraciones de Entity Framework para crear las tablas y sembrar los datos iniciales (categorías y usuarios oficiales):
   ```bash
   dotnet ef database update --project BuffetApp.Api.csproj
   ```
   _(Nota: `Program.cs` incluye `db.Database.Migrate()` automático al arrancar, por lo que aplicará las migraciones pendientes automáticamente al iniciar)._
4. Iniciar la API:
   ```bash
   dotnet run --project BuffetApp.Api.csproj
   ```
5. La API se iniciará en `http://localhost:5006` (o puerto configurado por Kestrel) y la documentación interactiva Swagger estará accesible en:
   ```
   http://localhost:5006/swagger
   ```

#### Paso 3: Levantar el Frontend (React + Vite)

1. Abrir otra terminal en la carpeta raíz del proyecto (`olimpiadas`):
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir en el navegador la URL informada en la terminal (típicamente `http://localhost:5173` o `http://localhost:5174`).

---

### 2.4. Ejecución mediante Docker (Opcional)

El proyecto incluye un `Dockerfile` en `proyecto_API/Dockerfile` para compilar y ejecutar el servicio backend en un contenedor Linux:

```bash
cd proyecto_API
docker build -t moron-resuelve-api .
docker run -d -p 5006:8080 --name moron_api moron-resuelve-api
```

---

## 3. Guía de Uso desde la Perspectiva del Usuario Final

### 3.1. Roles de Usuario en el Sistema

El sistema implementa dos roles principales definidos en la lógica de negocio y en la API (`RolUsuario`):

| Rol                             | Identificador         | Capacidades                                                                                                                                                                                                                                         |
| ------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vecino**                      | `vecino`              | Reportar incidencias, consultar el catálogo de servicios, ver sus reportes creados en la pestaña de cuenta, geolocalizar fallas urbanas y ver el mapa de reclamos públicos.                                                                         |
| **Inspector Municipal / Admin** | `inspector` o `admin` | Acceder a la pestaña **Gestión Municipal** (_Mesa Operativa_), cambiar estados de reportes (_Pendiente_, _En Proceso_, _Resuelto_, _Desestimado_), asignar cuadrillas operativas, redactar notas técnicas internas y administrar roles de usuarios. |

> **Detección Automática de Rol:** Todo usuario que se registre o inicie sesión con un correo institucional bajo el dominio `@moron.gob.ar` adquiere automáticamente privilegios de **Inspector Municipal**.

---

### 3.2. Cuentas de Demostración Precargadas

Para pruebas inmediatas sin necesidad de registro previo:

- **Cuenta Vecino Demo:**
  - **Email:** `al_garcia@eest6.edu.ar`
  - **Contraseña:** `password123`
- **Cuenta Inspector Municipal Demo:**
  - **Email:** `operaciones@moron.gob.ar`
  - **Contraseña:** `password123`
- **Acceso Administrativo Rápido:**
  - **Usuario:** `admin` o `admin@moron.gob.ar`
  - **Contraseña:** `admin123`

---

### 3.3. Flujo 1: Registro e Inicio de Sesión

1. Dirigirse a la pestaña **Acceso** en la barra de navegación.
2. Para **Iniciar Sesión**: ingresar correo y contraseña. Al validar las credenciales, el sistema guarda el token JWT en `localStorage` y redirige al perfil del ciudadano.
3. Para **Registrarse**: alternar a la pestaña "Registrarse", completar Nombre, Apellido, Correo, Teléfono, Localidad de Morón y Contraseña. Se deben aceptar los términos del municipio.

---

### 3.4. Flujo 2: Creación de un Nuevo Reporte Urbano

1. Ingresar mediante el botón flotante central **"Reportar"** o la ruta `/nuevo-reporte`.
2. **Paso 1: Tipo y Localidad:**
   - Seleccionar el tipo de problema entre las 20 categorías del catálogo oficial (ej. _Baches en calles_, _Alumbrado apagado_, _Semáforos_, _Acumulación basura_, _Pérdidas de agua_).
   - Elegir la localidad del Partido de Morón (Morón Centro, Haedo, El Palomar, Castelar Norte, Castelar Sur, Morón Sur, Villa Sarmiento).
3. **Paso 2: Ubicación en el Mapa (Acotado a Morón):**
   - El mapa interactivo (Leaflet) se abre centrado en Morón.
   - Cuenta con un **bounding box estricto** que bloquea el paneo fuera del distrito.
   - Si el usuario intenta mover el pin fuera de los límites o escribir una dirección foránea (ej. CABA, La Matanza), el sistema muestra una advertencia visual y reubica el marcador en el límite válido.
   - Se puede pulsar _"Usar mi ubicación GPS"_ para georreferenciación instantánea.
4. **Paso 3: Detalle, Fotos y Urgencia:**
   - Redactar una breve descripción del incidente.
   - Adjuntar hasta 4 fotografías testimoniales (procesadas como DataURL).
   - Seleccionar el nivel de riesgo: **Bajo**, **Medio** o **Alto/Riesgo**.
5. **Confirmación:** Al presionar _"Enviar Reporte"_, el sistema emite un código identificador único (ej: `MOR-4821`), programa la línea de tiempo de atención y muestra una pantalla de confirmación.

---

### 3.5. Flujo 3: Seguimiento y Consulta de Estado

- En la pestaña **Cuenta / Mi Perfil** (`/perfil`), el ciudadano puede:
  - Consultar todos sus reclamos realizados.
  - Ver el estado en tiempo real con su badge de color:
    - 🟡 **Pendiente:** Recibido por el sistema, a la espera de derivación técnica.
    - 🔵 **En Proceso:** Cuadrilla despachada y en viaje o trabajando en el lugar.
    - 🟢 **Resuelto:** Incidencia subsanada por la cuadrilla municipal.
    - ⚪ **Desestimado:** Descartado por duplicación o falta de competencia.
  - Ver la línea de tiempo de 4 pasos (_Recepción_, _Revisión_, _Despacho_, _Resolución_).

---

### 3.6. Flujo 4: Gestión Municipal (Mesa Operativa para Inspectores)

1. Acceder a la pestaña **Gestión Municipal** (`/gestion`).
2. Si el usuario no está logueado como inspector, se le solicita autenticarse con credenciales de operaciones o administrativas.
3. Una vez en el panel:
   - **Filtros rápidos:** Filtrar por estado (_Todos_, _Pendientes_, _En Proceso_, _Resueltos_) o por área (_Vialidad_, _Alumbrado_, _Higiene_, _Espacios_, _Seguridad_).
   - **Buscador en vivo:** Búsqueda instantánea por código de ticket (`MOR-XXXX`), calle o nombre del vecino.
   - **Vista Mapa vs Lista:** Alternar entre listado de tarjetas y mapa de calor interactivo con pines de colores según criticidad.
   - **Gestión de la Orden:** Al abrir un reporte, el inspector puede:
     - Asignar cuadrilla específica (ej. _Obras Públicas y Bacheo_, _Alumbrado y Electromecánica_, _Higiene Urbana_).
     - Ingresar notas técnicas del inspector.
     - Avanzar el estado a **En Proceso**, marcar como **Resuelto** o **Desestimar**.
   - **Pestaña "Gestión de Inspectores":** Permite al personal administrativo promover o revocar roles de inspector a otros usuarios registrados.

---

## 4. Documentación de Endpoints de la API REST

Todos los endpoints están prefijados por `/api`. La API responde en formato JSON con convenciones `camelCase`.

### 4.1. Módulo de Autenticación (`/api/auth`)

#### `POST /api/auth/registro`

- **Propósito:** Registra un nuevo vecino o inspector en el sistema y retorna el token JWT junto con el perfil.
- **Autenticación requerida:** No (Público).
- **Body esperado:**
  ```json
  {
    "nombre": "Mariana",
    "apellido": "Rossi",
    "email": "m.rossi@gmail.com",
    "password": "password123",
    "telefono": "1155551234",
    "localidad": "Castelar Sur"
  }
  ```
- **Respuesta exitosa (`201 Created`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 5,
      "name": "Mariana Rossi",
      "email": "m.rossi@gmail.com",
      "phone": "+54 9 11 1155551234",
      "locality": "Castelar Sur",
      "level": 1,
      "points": 100,
      "isVerified": true,
      "role": "vecino"
    }
  }
  ```
- **Errores:** `409 Conflict` (si el email ya está registrado), `400 Bad Request` (campos obligatorios faltantes).

---

#### `POST /api/auth/login`

- **Propósito:** Valida credenciales de acceso y emite un token JWT con vigencia de 24 horas.
- **Autenticación requerida:** No (Público).
- **Body esperado:**
  ```json
  {
    "email": "operaciones@moron.gob.ar",
    "password": "password123"
  }
  ```
- **Respuesta exitosa (`200 OK`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": 2,
      "name": "Operaciones Municipales Morón",
      "email": "operaciones@moron.gob.ar",
      "phone": "11-4489-7777",
      "locality": "Morón Centro",
      "level": 10,
      "points": 5000,
      "isVerified": true,
      "role": "inspector"
    }
  }
  ```
- **Errores:** `401 Unauthorized` (email o contraseña incorrectos).

---

### 4.2. Módulo de Incidencias (`/api/incidencias`)

#### `GET /api/incidencias`

- **Propósito:** Lista los reportes urbanos registrados con soporte para filtros combinados.
- **Autenticación requerida:** Opcional (abierto para consulta pública; token Bearer para trazabilidad).
- **Query Parameters:**
  - `status` (string, opcional): `pendiente`, `proceso`, `resuelto`, `desestimado`.
  - `area` (string, opcional): `vialidad`, `alumbrado`, `higiene`, `espacios`, `seguridad`.
  - `search` (string, opcional): término de búsqueda por código, título, reportante o dirección.
- **Respuesta exitosa (`200 OK`):** Array de objetos `IncidenciaDto`.

---

#### `GET /api/incidencias/{codigo}`

- **Propósito:** Obtiene el detalle exhaustivo de una incidencia por su código visible (ej. `MOR-4821`).
- **Autenticación requerida:** No.
- **Respuesta exitosa (`200 OK`):**
  ```json
  {
    "id": "MOR-4821",
    "title": "Bache en calle Belgrano",
    "category": "Baches en calles",
    "categorySlug": "baches-calles",
    "area": "vialidad",
    "description": "Bache profundo frente al colegio...",
    "location": "Belgrano y 9 de Julio, Morón Centro",
    "locality": "Morón Centro",
    "status": "pendiente",
    "urgency": "Alto/Riesgo",
    "timeAgo": "Recién",
    "reportedBy": "Juan García",
    "reporterEmail": "al_garcia@eest6.edu.ar",
    "reporterPhone": "11-2345-6789",
    "images": ["https://ejemplo.com/foto1.jpg"],
    "assignedCuadrilla": "Cuadrilla Móvil de Morón Centro",
    "operatorInCharge": null,
    "inspectorNotes": null,
    "lat": -34.6534,
    "lng": -58.6198,
    "timeline": {
      "receivedAt": "14:22 hs",
      "reviewedAt": "Pendiente",
      "dispatchedAt": "En espera",
      "estimatedResolution": "48hs hábiles",
      "currentStep": 1
    }
  }
  ```
- **Errores:** `404 Not Found` (si no existe el código).

---

#### `POST /api/incidencias`

- **Propósito:** Crea un nuevo reclamo urbano. Genera automáticamente el código `MOR-XXXX` y la línea de tiempo inicial.
- **Autenticación requerida:** Opcional (si se envía el token Bearer, vincula la incidencia al `UsuarioId`).
- **Body esperado (`CrearIncidenciaDto`):**
  ```json
  {
    "title": "Bache peligroso en esquina",
    "category": "Baches en calles",
    "categorySlug": "baches-calles",
    "area": "vialidad",
    "description": "Rotura de pavimento con agua estancada.",
    "location": "Av. Rivadavia 18200, Morón",
    "locality": "Morón Centro",
    "urgency": "Alto/Riesgo",
    "reportedBy": "Juan García",
    "reporterEmail": "al_garcia@eest6.edu.ar",
    "reporterPhone": "11-2345-6789",
    "images": ["data:image/jpeg;base64,..."],
    "assignedCuadrilla": "Cuadrilla Móvil de Morón Centro",
    "lat": -34.6534,
    "lng": -58.6198
  }
  ```
- **Respuesta exitosa (`201 Created`):** Objeto `IncidenciaDto` creado.

---

#### `PUT /api/incidencias/{codigo}` o `PATCH /api/incidencias/{codigo}/estado`

- **Propósito:** Actualiza el estado operativo, notas técnicas y cuadrilla asignada de un reclamo.
- **Autenticación requerida:** **Sí, Token Bearer con rol `inspector`**.
- **Body esperado (`ActualizarEstadoIncidenciaDto`):**
  ```json
  {
    "status": "proceso",
    "assignedCuadrilla": "Obras Públicas y Bacheo - Móvil 4",
    "operatorInCharge": "Oficial Gómez",
    "inspectorNotes": "Cuadrilla despachada con material asfáltico en caliente."
  }
  ```
- **Respuesta exitosa (`200 OK`):** Objeto `IncidenciaDto` actualizado con la línea de tiempo recalculada.
- **Errores:** `403 Forbidden` (si el usuario autenticado no tiene rol de inspector), `404 Not Found`.

---

#### `DELETE /api/incidencias/{codigo}`

- **Propósito:** Elimina un reporte del sistema.
- **Autenticación requerida:** Sí (`Authorization: Bearer <token>`).
- **Respuesta exitosa (`204 NoContent`).**

---

### 4.3. Módulo de Usuarios (`/api/usuarios`)

- `GET /api/usuarios`: Retorna el listado completo de usuarios registrados (requiere token).
- `GET /api/usuarios/{id}`: Obtiene el perfil de un usuario por su ID numérico.
- `PUT /api/usuarios/{id}`: Modifica los datos personales de un usuario (nombre, teléfono, localidad). El rol está protegido y no se puede alterar en este endpoint.
- `PATCH /api/usuarios/{id}/rol`: **Exclusivo para inspectores**. Modifica el rol de un usuario (`vecino` <-> `inspector`).

---

### 4.4. Módulo de Catálogo y Localidades (`/api/categorias` y `/api/localidades`)

- `GET /api/categorias`: Retorna las 20 categorías oficiales con su SLA, área municipal, íconos y clases de estilo. Admite query params `?area=vialidad` y `?search=luz`.
- `GET /api/categorias/{slug}`: Retorna una categoría por su identificador amigable (ej: `/api/categorias/baches-calles`).
- `GET /api/localidades`: Retorna las 7 UGC del Partido de Morón con sus identificadores.

---

## 5. Errores Comunes y Troubleshooting

### 1. Error de Conexión con PostgreSQL al Iniciar la API

- **Síntoma:** La API arroja `Npgsql.NpgsqlException: Failed to connect to localhost:5432`.
- **Causa:** El servicio de PostgreSQL no está en ejecución o la contraseña en `appsettings.json` difiere de la de tu instalación local.
- **Solución:**
  1. Verificar que el servicio esté corriendo (`Get-Service postgresql*` en Windows o `sudo systemctl status postgresql` en Linux).
  2. Ajustar el valor de `Password` en `proyecto_API/appsettings.json` con tu contraseña local de postgres.

### 2. Bloqueo de CORS entre Frontend y Backend

- **Síntoma:** La consola del navegador muestra `Access to fetch at 'http://localhost:5006/api/...' has been blocked by CORS policy`.
- **Solución:** En `Program.cs` del backend está habilitada la política `AllowFrontend` con `AllowAnyOrigin`, `AllowAnyMethod` y `AllowAnyHeader`. Asegurarse de que el frontend apunte a la ruta relativa `/api` (aprovechando el proxy de desarrollo de Vite) o a `http://localhost:5006/api`.

### 3. Error 403 Forbidden al Modificar Reportes

- **Síntoma:** Al intentar cambiar el estado de una incidencia desde `/gestion`, el servidor responde `403 Forbidden` con el mensaje: _"Acceso denegado: solo el personal con rol de Inspector Municipal..."_.
- **Solución:** Asegurarse de iniciar sesión con una cuenta que posea rol de inspector (por ejemplo `operaciones@moron.gob.ar` o cualquier correo con terminación `@moron.gob.ar`).

### 4. Advertencia de Ubicación Fuera de Morón

- **Síntoma:** Al seleccionar un punto en el mapa aparece una tarjeta de advertencia indicando que la zona está fuera del distrito.
- **Causa:** El Partido de Morón tiene límites territoriales estrictos configurados por coordenadas (`-34.7080` a `-34.5800` latitud, `-58.6850` a `-58.5620` longitud).
- **Solución:** La aplicación restringe automáticamente el desplazamiento fuera del distrito para garantizar que las cuadrillas municipales de Morón no reciban reportes correspondientes a otros municipios (como Ituzaingó, Tres de Febrero o La Matanza). Haga clic dentro de cualquiera de las 7 localidades de Morón.

### 5. Funcionamiento en Modo Offline / Sin Conexión

- **Comportamiento:** Si el servidor backend de .NET no está encendido al abrir el frontend, la plataforma **no se rompe**: conmuta automáticamente a almacenamiento local en `localStorage`. Los reclamos se guardarán localmente y se mostrarán en la interfaz con códigos válidos (`MOR-XXXX`). Cuando el backend vuelva a estar disponible, las peticiones HTTP se restablecerán de forma transparente.

---

## 6. Equipo de Desarrollo

Proyecto desarrollado en el marco de las **Olimpíadas Técnico-Profesionales de Programación 6to Año**:

- **Leonel Mancuso** — Desarrollador Backend y Frontend
- **Valentin Sanchez** — Desarrollador Backend y Frontend
- **Rodrigo Molina** — Desarrollador Frontend
- **Ezequiel Mendez** — Diseñador principal de la organización de Documentación, DER y Diagrama de flujo


