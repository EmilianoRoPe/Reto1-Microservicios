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

## Cómo correr local
1. Clona el repositorio y entra a la carpeta `reto1`.
2. Ejecuta:
   ```bash
   docker-compose up --build
   ```
3. El gateway estará en:  
   `http://localhost:8080`

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
