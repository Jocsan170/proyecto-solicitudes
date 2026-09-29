# API (backend) — proyecto independiente

Node.js puro, sin dependencias externas (no hace falta `npm install`
para el servidor, aunque `npm install` no hace daño si no hay nada que
instalar).

## Cómo correrlo

```bash
cd backend
npm start          # http://localhost:3000
```

En otra terminal, con el servidor corriendo:

```bash
cd backend
npm test           # corre test/client.test.js contra la API
```

## Endpoints

| Método | Ruta                                  | Requiere rol | Descripción                          |
|--------|----------------------------------------|--------------|---------------------------------------|
| POST   | `/api/solicitudes`                     | —            | Crear (queda en `pendiente`)          |
| GET    | `/api/solicitudes?estado=`             | —            | Listar, con filtro opcional           |
| GET    | `/api/solicitudes/:id`                 | —            | Detalle                               |
| PATCH  | `/api/solicitudes/:id/estado`          | `gestor`     | Cambiar estado                        |
| GET    | `/api/solicitudes/publicas/listado`    | —            | Solo `atendida`, campos mínimos       |

Cuentas de prueba (encabezado `Authorization: Bearer <token>`):

- `TOKEN_CIUDADANO_DEMO` → rol `ciudadano` (sin permiso para cambiar estado)
- `TOKEN_GESTOR_DEMO` → rol `gestor` (sí puede)
- Sin encabezado → anónimo (tampoco puede)

Incluye CORS abierto (`Access-Control-Allow-Origin: *`) para que
Angular (puerto 4200) y Nuxt (otro puerto) puedan llamarlo sin
configuración adicional.
