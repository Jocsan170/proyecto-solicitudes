# Front administrativo (Angular) — proyecto independiente

Proyecto Angular completo y listo para abrir en VS Code. No necesita
copiarse dentro de otro proyecto.

## Cómo correrlo

```bash
cd frontend-angular
npm install
npm start
```

Abre `http://localhost:4200`. Requiere que el backend esté corriendo
en `http://localhost:3000` (ver `../backend`).

## Flujo de la aplicación

1. **Datos del ciudadano** (nombre completo, identidad, ciudad) — puerta
   de entrada antes de poder registrar solicitudes. Se queda solo en el
   navegador, no se envía al backend.
2. **Registrar solicitud** — devuelve un número de seguimiento como
   notificación flotante, con botón para copiarlo.
3. **Consultar el estado de una solicitud** — por su número, sin cuenta.
4. **Panel de gestión** (botón flotante, esquina superior derecha) —
   requiere iniciar sesión (ver credenciales abajo). Ahí el gestor
   tiene control completo: buscar, ordenar, filtrar por estado, editar,
   eliminar y cambiar el estado de cualquier solicitud.

## Acceso del gestor

El panel de gestión (botón "Panel de gestión", esquina superior
derecha) pide usuario y contraseña. Son credenciales fijas de
entrenamiento, no hay un servidor de autenticación real detrás:

```
Usuario:    admin
Contraseña: senprende2026
```

La sesión se mantiene mientras la pestaña siga abierta, aunque cierres
y vuelvas a abrir el panel.

## Qué valida el formulario

Los mismos límites que exige la API:

- Título: 3–100 caracteres, obligatorio.
- Descripción: 10–500 caracteres, obligatoria.
- Fecha: obligatoria.

## Qué distingue el listado

- **Cargando** vs. **error del servicio** vs. **lista vacía**: tres
  estados visuales distintos.
- Confirmaciones de éxito y error separadas, tanto en el formulario
  (como notificación flotante) como en el panel de gestión.

## Si la API corre en otro puerto/host

Edita `BASE_URL` en `src/app/services/solicitudes.service.ts`.
