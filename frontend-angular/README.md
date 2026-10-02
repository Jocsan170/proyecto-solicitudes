# Ventanilla digital SENPRENDE (Angular)

## Desarrollo local

```bash
cd frontend-angular
npm install
npm start
```

Abre `http://localhost:4200`. La API debe estar disponible en `http://localhost:3000`.

## Recorrido ciudadano

- `/` registra una consulta con nombre completo y número de identidad; no pide fecha manual.
- El backend asigna la fecha y devuelve el número de gestión.
- `/seguimiento` solicita el código privado de gestión para mostrar estado, historial y conversación.
- `/gestion` es el área de trabajo del personal.

El nombre y la identidad se guardan en el expediente y no aparecen en la consulta pública. Usa solo datos ficticios mientras siga activo el almacenamiento local sin cifrado y el acceso de demostración. No incluyas contraseñas ni datos bancarios.

El código nuevo de gestión es numérico, aleatorio y de 12 dígitos; se muestra agrupado `XXXX-XXXX-XXXX` para facilitar su lectura. Los comprobantes anteriores siguen aceptándose durante la transición. El token temporal de seguimiento dura 30 minutos; en producción configura `SEGUIMIENTO_TOKEN_SECRET` con un secreto aleatorio de entorno.

## Acceso de evaluación

El ingreso actual a gestión utiliza credenciales fijas para demostración. No constituye autenticación institucional ni debe usarse para proteger información real:

```
Usuario:    admin
Contraseña: senprende2026
```

Antes de publicar el sistema con información real, reemplaza ese acceso por autenticación institucional.

## Enlaces de entorno

- Desarrollo: `src/environments/environment.ts` apunta al portal Nuxt local.
- Producción: Angular se prepara para `/registro/`; `src/environments/environment.prod.ts` enlaza el portal Nuxt raíz (`/`) en el mismo dominio.
- La API Angular usa `/api`; configura el servidor de publicación para dirigir esa ruta al backend.

Al publicar, configura el servidor para entregar Angular en `/registro/` (incluidas las rutas `/registro/seguimiento` y `/registro/gestion`) y Nuxt en `/`. Define `NUXT_PUBLIC_REGISTRO_URL=/registro/` y `NUXT_PUBLIC_API_BASE=/api` al compilar Nuxt.

El backend asigna automáticamente la fecha local de Honduras al crear una solicitud. El formulario valida el asunto (3–100 caracteres) y el detalle (10–500 caracteres).
