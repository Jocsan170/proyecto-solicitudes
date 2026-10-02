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
| GET    | `/api/solicitudes?estado=`             | `gestor`     | Listado completo y filtros             |
| GET    | `/api/solicitudes/:id`                 | `gestor`     | Detalle privado                       |
| PATCH  | `/api/solicitudes/:id/estado`          | `gestor`     | Cambiar estado                        |
| POST   | `/api/solicitudes/publicas/consulta`   | Código privado de gestión | Estado e historial de un expediente |
| GET/POST| `/api/solicitudes/:id/mensajes`        | `gestor`     | Conversación del expediente |
| GET/POST| `/api/solicitudes/seguimiento/mensajes`| Token temporal de seguimiento | Conversación privada; el código no se coloca en la URL |

## Validación, respaldo y datos

- El servidor valida longitudes después de quitar espacios. Al crear, asigna automáticamente la fecha local de Honduras; las operaciones de edición siguen validando fechas reales en formato `AAAA-MM-DD`.
- El registro requiere nombre completo e identidad, que se guardan en el expediente JSON. Los nuevos expedientes reciben un código aleatorio de 12 dígitos, mostrado en grupos de cuatro; no se usan IDs internos consecutivos. Los códigos anteriores se conservan como alias durante la migración para no cortar el seguimiento. La consulta con el código devuelve solo el código, fecha, estado e historial; nombre, identidad, título y descripción permanecen fuera de la respuesta. La conversación requiere un token temporal emitido al verificar el código. El listado completo y el detalle requieren rol gestor. El historial registra la fecha de creación y cada cambio efectivo de estado.
- Ejecuta `npm run backup` dentro de `backend` para copiar `data/solicitudes.json` a `data/respaldos/`. Guarda una copia de esa carpeta fuera del equipo para protegerte ante fallas del disco.
- Las cuentas y tokens incluidos son de demostración y el archivo JSON no cifra datos. Usa solo datos ficticios; no expongas este servidor en Internet sin autenticación real, control de acceso por persona, protección del almacenamiento y revisión de privacidad.
- Define `SEGUIMIENTO_TOKEN_SECRET` como secreto aleatorio antes del despliegue. Si se omite, se genera uno nuevo al iniciar el proceso y los tokens temporales se invalidan al reiniciar. El código de seguimiento es una credencial: no lo publiques ni lo compartas; antes de producción también se requiere almacenamiento protegido, TLS y control de intentos compartido entre instancias.

Cuentas de prueba (encabezado `Authorization: Bearer <token>`):

- `TOKEN_CIUDADANO_DEMO` → rol `ciudadano` (sin permiso para cambiar estado)
- `TOKEN_GESTOR_DEMO` → rol `gestor` (sí puede)
- Sin encabezado → anónimo (tampoco puede)

Incluye CORS abierto (`Access-Control-Allow-Origin: *`) para que
Angular (puerto 4200) y Nuxt (otro puerto) puedan llamarlo sin
configuración adicional.
