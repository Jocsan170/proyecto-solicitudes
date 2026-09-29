# Registro de solicitudes (ejercicio de entrenamiento)

Tres proyectos **independientes**, cada uno se abre y corre por
separado en VS Code (no hay que copiar nada dentro de otro proyecto):

```
backend/            API en Node.js puro + cliente de prueba   -> puerto 3000
frontend-angular/   Formulario de registro + listado admin.   -> puerto 4200
frontend-nuxt/      Vista pública, expresamente publicable    -> puerto 3001
```

Datos ficticios. Cada solicitud tiene: `id`, `titulo`, `descripcion`,
`fecha`, `estado` (`pendiente` | `atendida`, inicia en `pendiente`).
No se recopilan nombres, expedientes, teléfonos ni correos reales.

## Orden para correrlo

Necesitas 2 o 3 terminales abiertas en VS Code (una por proyecto que
quieras probar), todas dentro de la carpeta de este repo.

**1. Backend (siempre primero, los otros dos dependen de él):**

```bash
cd backend
npm start
```

**2. Angular** (en otra terminal):

```bash
cd frontend-angular
npm install
npm start
```

Abre `http://localhost:4200`.

**3. Nuxt** (en otra terminal, opcional):

```bash
cd frontend-nuxt
npm install
npm run dev -- --port 3001
```

Abre `http://localhost:3001/solicitudes`.

> La primera vez, `npm install` en Angular y Nuxt descarga sus
> dependencias desde internet (tu máquina sí tiene conexión; el
> backend no las necesita porque no usa ninguna).

## Casos que el ejercicio pide revisar (y dónde se ven)

| Caso                                   | Backend                          | Angular                              | Nuxt                        |
|-----------------------------------------|-----------------------------------|----------------------------------------|------------------------------|
| Longitudes / campos incompletos         | 400 con `detalles` por campo      | Validadores del formulario reactivo    | —                            |
| Identificador inexistente               | 404                                | Se refleja como `errorAccion`/detalle  | —                            |
| Operación sin permisos                  | 403 (`SIN_PERMISOS`)              | Login de gestor + botón oculto/403     | —                            |
| Lista vacía vs. falla del servicio      | `success:true,data:[]` vs. `500`  | `listaVacia` vs. `errorCarga`          | `listaVacia` vs. `errorServicio` |
| Confirmación de operación exitosa       | `mensaje` en la respuesta         | Notificación flotante / mensaje        | —                            |

## Panel de gestión (acceso completo para el gestor)

El listado administrativo ahora vive en un **widget flotante**
(botón "Panel de gestión", esquina superior derecha de Angular) y
requiere iniciar sesión — usuario `admin`, contraseña `senprende2026`
(ver `frontend-angular/README.md`). Una vez dentro, el gestor puede:

- **Buscar** por título y **ordenar** (más recientes/antiguas primero).
- **Filtrar** por estado.
- **Editar** título, descripción y fecha de cualquier solicitud.
- **Cambiar el estado** en ambos sentidos (marcar atendida / reabrir).
- **Eliminar** una solicitud (con confirmación).

El ciudadano, en la pantalla principal, solo ve lo esencial: sus datos,
el formulario de registro y la consulta de estado — sin nada del panel
de gestión de por medio.

## El backend ya no pierde los datos al reiniciar

`backend/data/solicitudes.json` guarda el estado en disco después de
cada cambio (crear, editar, cambiar estado, eliminar). Si detienes el
servidor (`Ctrl+C`) y lo vuelves a levantar, las solicitudes siguen
ahí. Ese archivo se genera solo (no viene en el zip) y está en
`.gitignore`.

## Funciones agregadas para que se sienta un programa real

- **Logo institucional** en el encabezado de Angular y de Nuxt, y como
  favicon en ambos.
- **Número de seguimiento** con botón para copiarlo, como notificación
  flotante al registrar una solicitud.
- **Consultar el estado de una solicitud por su número**, sin necesitar
  cuenta.
- El listado del panel de gestión se **refresca solo** al registrar una
  solicitud nueva.
- **Botón "Ver portal público de trámites"** dentro del panel de
  gestión — abre Nuxt en una pestaña nueva.
- Nuxt muestra **dos secciones**: "En trámite" (pendientes) y
  "Resueltas" (atendidas), cada una con su contador. El endpoint
  público (`/api/solicitudes/publicas/listado`) sigue exponiendo solo
  campos mínimos — nunca la descripción completa.
- La página de bienvenida de Nuxt (`/`) trae un **carrusel de
  imágenes** en tamaño contenido y legible (antes se veían como fondo
  gigante y borroso — se corrigió separándolo del hero).

## Distribución de horas (referencia de la UTI, no un plazo rígido)

~80 h totales: 40 h base común + 24 h de la tecnología asignada + 16 h
para este ejercicio, sus pruebas y la revisión (≈4 semanas a 20 h/semana).
Se amplía cuando haga falta repasar fundamentos.
