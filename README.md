# Reto Microservicios CRUD: Startups & Technologies

## Descripción
Sistema de microservicios desacoplados por acción CRUD para los dominios Startups y Technologies, expuestos vía API Gateway (Nginx), con base de datos PostgreSQL y frontend funcional. Orquestado con Docker Compose.

## Arquitectura

```
reto1/
│
├── gateway/           # API Gateway (Nginx)
├── services/
│   ├── startups/
│   │   ├── create/
│   │   ├── read/
│   │   ├── update/
│   │   └── delete/
│   └── technologies/
│       ├── create/
│       ├── read/
│       ├── update/
│       └── delete/
├── frontend/          # (React o Vue)
├── db/
│   └── migrations/
│       └── 001_init.sql
├── docker-compose.yml
└── README.md
```

## Requisitos
- Docker y Docker Compose
- Node.js (solo para desarrollo local)
- PostgreSQL (se levanta en contenedor)

## Variables de entorno
Copia el archivo `.env.example` y renómbralo a `.env` en cada microservicio.  
Variables principales:
```
PGHOST=postgres
PGUSER=user
PGPASSWORD=password
PGDATABASE=reto1db
PGPORT=5432
```

## Instalación rápida y ejecución

1. Clona el repositorio y entra a la carpeta `reto1`.
2. Instala todas las dependencias automáticamente ejecutando:
   ```powershell
   powershell -ExecutionPolicy Bypass -File install-all.ps1
   ```
3. Copia el archivo `.env.example` a `.env` en cada microservicio y ajusta si es necesario.
4. Levanta todo el proyecto abriendo una nueva terminal en la carpeta raiz (reto1) con:
   ```
   npm run dev:all
   ```
   NOTA: En caso de que no empiecen a levantar los servicios backend, gateway, base de datos y posterior frontend hacer los comandos siguientes (5. y 6.):

5. Levanta todos los servicios backend, gateway y base de datos:
   ```powershell
   docker-compose up --build
   ```
6. En otra terminal, inicia el frontend en modo desarrollo:
   ```powershell
   cd frontend
   npm run dev
   ```

- El frontend estará en: http://localhost:5173/
- El gateway (API): http://localhost:8080/v1/api/

Para detener todos los servicios backend, gateway y base de datos:
```powershell
docker-compose down
```
En el caso de frontend es necesario detener el servicio directamente a la terminal donde esta abierto el servidor local con:
```
Ctrl + C
```

¡Listo! Así cualquier usuario puede instalar y correr el proyecto fácilmente.

## Endpoints principales

### Startups
- `POST   /v1/api/startups/create`
- `GET    /v1/api/startups/read`
- `GET    /v1/api/startups/read/:id`
- `PUT    /v1/api/startups/update/:id`
- `DELETE /v1/api/startups/delete/:id`

### Technologies
- `POST   /v1/api/technologies/create`
- `GET    /v1/api/technologies/read`
- `GET    /v1/api/technologies/read/:id`
- `PUT    /v1/api/technologies/update/:id`
- `DELETE /v1/api/technologies/delete/:id`

## Ejemplos de request/response

### Crear Startup (POST)
```
POST /v1/api/startups/create
{
  "name": "Mi Startup",
  "foundedAt": "2023-01-01",
  "location": "CDMX",
  "category": "Tech",
  "fundingAmount": 1000000
}
```
Respuesta:
```
{
  "id": 1,
  "name": "Mi Startup",
  ...
}
```

### Listar Startups (GET)
```
GET /v1/api/startups/read
```
Respuesta:
```
[
  { "id": 1, "name": "Mi Startup", ... }
]
```

### Leer Startup por ID (GET)
```
GET /v1/api/startups/read/1
```
Respuesta:
```
{ "id": 1, "name": "Mi Startup", ... }
```

### Actualizar Startup (PUT)
```
PUT /v1/api/startups/update/1
{
  "name": "Startup actualizada"
}
```
Respuesta:
```
{ "id": 1, "name": "Startup actualizada", ... }
```

### Eliminar Startup (DELETE)
```
DELETE /v1/api/startups/delete/1
```
Respuesta: Código 204 sin contenido.

## Pruebas manuales
- Crear, listar, leer, actualizar y eliminar startups y technologies.
- Pruebas con datos válidos e inválidos.
- Capturas de pantalla del frontend y de Postman.
