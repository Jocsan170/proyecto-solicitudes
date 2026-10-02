# Portal público SENPRENDE (Nuxt)

## Desarrollo local

```bash
cd frontend-nuxt
npm install
npm run dev -- --port 3001
```

Abre `http://localhost:3001`. La página de inicio presenta la propuesta e incluye a Williams como ayuda guiada, cerrada hasta que la persona toca el robot. Explica SENPRENDE y acompaña con botones grandes por el registro sin recibir mensajes ni datos. `/solicitudes` explica el acceso privado al seguimiento. No existe una lista pública de solicitudes.

## Configuración de despliegue

Nuxt usa variables públicas de entorno para enlazar la ventanilla Angular y el backend:

- `NUXT_PUBLIC_REGISTRO_URL`: dirección de la ventanilla, por ejemplo `https://sitio.ejemplo/registro`.
- `NUXT_PUBLIC_API_BASE`: dirección base de la API, por ejemplo `https://sitio.ejemplo/api`.

En desarrollo, los valores predeterminados apuntan a `localhost:4200` y `localhost:3000/api`. Para el esquema de rutas de producción preparado en este proyecto, configura `NUXT_PUBLIC_REGISTRO_URL=/registro/` y `NUXT_PUBLIC_API_BASE=/api` antes de compilar/publicar.

La consulta de estado y la conversación requieren el código aleatorio de gestión entregado en el comprobante. No existe una lista pública ni consulta por identificadores consecutivos. Las respuestas no exponen nombre, identidad, asunto ni descripción. Los expedientes existentes reciben un código nuevo al iniciar el backend, conservando el resto de sus datos.

## Identidad y accesibilidad

El portal comparte los tonos azul institucional y dorado del emblema, usa estados verdes para los trámites atendidos, cuenta con navegación móvil y admite movimiento reducido del sistema.
