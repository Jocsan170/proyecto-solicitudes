# Vista pública (Nuxt) — proyecto independiente

Proyecto Nuxt 3 completo y listo para abrir en VS Code. No necesita
copiarse dentro de otro proyecto.

## Cómo correrlo

```bash
cd frontend-nuxt
npm install
npm run dev
```

Abre `http://localhost:3001` (Nuxt usa el puerto 3000 por defecto,
pero aquí el backend ya lo ocupa; ver más abajo cómo fijarlo).
Desde la página de inicio entra a "Ver solicitudes atendidas".

Para fijar el puerto en 3001 puedes correr:

```bash
npm run dev -- --port 3001
```

Requiere que el backend esté corriendo en `http://localhost:3000`
(ver `../backend`).

## Por qué es "expresamente publicable"

Esta vista consume `/api/solicitudes/publicas/listado`, un endpoint
sin autenticación que el backend expone aparte de la API
administrativa, y que:

- Solo devuelve solicitudes en estado `atendida` (nunca `pendiente`).
- Solo expone `id`, `titulo`, `fecha` y `estado` — nunca la
  `descripcion` completa ni ningún dato sensible.

Así, el front público nunca decide qué es publicable filtrando datos
en el cliente: la API ya entrega exactamente lo que corresponde
publicar.

## Estados que diferencia la vista

- Cargando.
- Falla del servicio (mensaje de error).
- Lista vacía (mensaje informativo, no un error).
- Listado con resultados.

## Si la API corre en otro puerto/host

Edita `BASE_URL` en `composables/useSolicitudesPublicas.js`.
