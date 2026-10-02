# Ventanilla digital SENPRENDE — propuesta para evaluación

Prototipo de portal público (Nuxt), registro y seguimiento ciudadano (Angular) y API (Node.js). Está preparado para revisión funcional y visual; aún necesita validación institucional y configuración de producción antes de atender solicitudes reales.

```text
frontend-nuxt/      Portal público y acceso a seguimiento   -> puerto 3001
frontend-angular/   Registro, seguimiento y gestión         -> puerto 4200
backend/            API y almacenamiento local              -> puerto 3000
```

El formulario de propuesta solicita nombre completo y número de identidad para asociar cada consulta con su solicitante. Los datos se guardan en el expediente privado de la API; los endpoints de consulta pública no los devuelven. Usa únicamente datos ficticios en este prototipo: el almacenamiento local actual no cifra la identidad y la autenticación de gestión aún es demostrativa.

## Iniciar el proyecto

Desde la carpeta principal:

```bash
npm install
npm start
```

Esto instala e inicia los tres proyectos desde una sola terminal. Abre:

- Portal público: `http://localhost:3001`
- Información de seguimiento privado: `http://localhost:3001/solicitudes`
- Registro y gestión: `http://localhost:4200`
- API: `http://localhost:3000`

Detén los servicios con `Ctrl+C`. También puedes iniciar cada proyecto por separado siguiendo el README de su carpeta.

## Recorrido que se puede evaluar

1. Desde el portal, abre el registro y crea una solicitud con asunto y detalle.
2. Conserva el código privado de gestión que devuelve el sistema.
3. Abre el seguimiento privado e ingresa ese código. No se publica una bandeja general ni se devuelve la identidad en la respuesta.
4. El área de gestión permite revisar solicitudes y actualizar su estado.

La API valida los campos y asigna la fecha usando la zona horaria de Honduras. Los registros del entorno local se guardan en `backend/data/solicitudes.json`; conserva ese archivo si necesitas mantener los datos de una sesión local.

## Alcance antes de una publicación institucional

- El acceso al área de gestión usa credenciales fijas de demostración (`admin` / `senprende2026`). No protege datos reales. Debe reemplazarse por autenticación institucional antes de cualquier publicación con información ciudadana.
- SENPRENDE debe confirmar qué datos identificativos exige cada tipo de solicitud, el texto de privacidad y la base institucional para recopilar y conservar la identidad.
- La paleta se inspiró en el emblema disponible en el proyecto. SENPRENDE debe validar los tonos exactos, el logotipo, los textos y los enlaces oficiales.
- La configuración de producción propuesta sirve Nuxt en `/`, Angular en `/registro/` y la API en `/api`. Requiere configurar y verificar el servidor, HTTPS, persistencia y respaldos en el entorno institucional.
- Los datos del archivo JSON son almacenamiento local de prototipo, no una base de datos de producción.

## Referencia de planificación

~80 h totales: 40 h base común + 24 h de la tecnología asignada + 16 h para este ejercicio, sus pruebas y la revisión (≈4 semanas a 20 h/semana). Se amplía cuando haga falta repasar fundamentos.
