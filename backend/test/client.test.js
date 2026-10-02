/**
 * Cliente de prueba simple para la API de solicitudes.
 * Ejecuta un recorrido por los casos exigidos en el ejercicio:
 *   - registro válido
 *   - campos incompletos
 *   - listado con filtro (incluyendo lista vacía como caso exitoso)
 *   - identificador inexistente
 *   - cambio de estado sin permisos
 *   - cambio de estado con permisos (confirmación)
 *
 * Requiere Node 18+ (fetch global) y el servidor corriendo en
 * http://localhost:3000 (`npm start` en otra terminal), o bien ejecutar
 * este archivo mientras server.js corre en el mismo proceso (ver abajo).
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000/api/solicitudes';

let fallos = 0;

function verificar(descripcion, condicion, detalle) {
  if (condicion) {
    console.log(`OK   - ${descripcion}`);
  } else {
    fallos++;
    console.log(`FAIL - ${descripcion}`);
    if (detalle !== undefined) console.log('       detalle:', JSON.stringify(detalle));
  }
}

async function main() {
  // 1. Crear con datos válidos
  let resp = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombreSolicitante: 'Persona de prueba',
      identidad: '0801-2000-12345',
      titulo: 'Solicitud de prueba',
      descripcion: 'Descripción suficientemente larga para pasar la validación.',
      fecha: '2026-09-20',
    }),
  });
  let cuerpo = await resp.json();
  verificar('Crear solicitud válida -> 201', resp.status === 201 && cuerpo.success === true, cuerpo);
  const idCreado = cuerpo?.data?.id;

  resp = await fetch(`${BASE_URL}/${idCreado}`);
  cuerpo = await resp.json();
  verificar('Detalle privado sin permisos -> 403', resp.status === 403 && cuerpo.success === false, cuerpo);

  resp = await fetch(BASE_URL);
  cuerpo = await resp.json();
  verificar('Listado completo sin permisos -> 403', resp.status === 403 && cuerpo.success === false, cuerpo);

  // 2. Crear con campos incompletos
  resp = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: 'ab' }), // muy corto y sin descripcion/fecha
  });
  cuerpo = await resp.json();
  verificar('Crear con campos incompletos -> 400', resp.status === 400 && cuerpo.success === false, cuerpo);

  // 3. Listar todas
  resp = await fetch(BASE_URL, {
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar('Listar todas -> 200 con arreglo', resp.status === 200 && Array.isArray(cuerpo.data), cuerpo);

  // 4. Listar con filtro que da lista vacía (éxito, no error)
  resp = await fetch(`${BASE_URL}?estado=atendida`, {
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar(
    'Filtrar por "atendida" sin resultados -> 200, success:true, data:[]',
    resp.status === 200 && cuerpo.success === true && Array.isArray(cuerpo.data) && cuerpo.data.length === 0,
    cuerpo
  );

  // 5. Filtro de estado inválido
  resp = await fetch(`${BASE_URL}?estado=inexistente`, {
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar('Filtrar con estado inválido -> 400', resp.status === 400 && cuerpo.success === false, cuerpo);

  // 6. Consultar detalle inexistente
  resp = await fetch(`${BASE_URL}/id-que-no-existe`, {
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar('Consultar id inexistente -> 404', resp.status === 404 && cuerpo.success === false, cuerpo);

  // 7. Cambiar estado sin token (sin permisos)
  resp = await fetch(`${BASE_URL}/${idCreado}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: 'atendida' }),
  });
  cuerpo = await resp.json();
  verificar('Cambiar estado sin permisos -> 403', resp.status === 403 && cuerpo.success === false, cuerpo);

  // 8. Cambiar estado con token de ciudadano (rol insuficiente)
  resp = await fetch(`${BASE_URL}/${idCreado}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer TOKEN_CIUDADANO_DEMO' },
    body: JSON.stringify({ estado: 'atendida' }),
  });
  cuerpo = await resp.json();
  verificar('Cambiar estado con rol "ciudadano" -> 403', resp.status === 403 && cuerpo.success === false, cuerpo);

  // 9. Cambiar estado con token de gestor (permitido)
  resp = await fetch(`${BASE_URL}/${idCreado}/estado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
    body: JSON.stringify({ estado: 'atendida' }),
  });
  cuerpo = await resp.json();
  verificar(
    'Cambiar estado con rol "gestor" -> 200 con confirmación',
    resp.status === 200 && cuerpo.success === true && cuerpo.data.estado === 'atendida' &&
      Array.isArray(cuerpo.data.historialEstados) && cuerpo.data.historialEstados.at(-1)?.estado === 'atendida' &&
      typeof cuerpo.mensaje === 'string',
    cuerpo
  );

  // 9a. El seguimiento verifica el código privado y responde con un token temporal.
  const numeroGestion = cuerpo?.data?.numeroGestion;
  resp = await fetch(`${BASE_URL}/publicas/consulta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numeroGestion }),
  });
  cuerpo = await resp.json();
  const tokenSeguimiento = cuerpo?.data?.token;
  verificar(
    'Consulta privada -> valida código, incluye historial y omite datos personales',
    resp.status === 200 && cuerpo.data.solicitud.historialEstados.length === 2 &&
      !('identidad' in cuerpo.data.solicitud) && !('nombreSolicitante' in cuerpo.data.solicitud) &&
      !('descripcion' in cuerpo.data.solicitud) && !('titulo' in cuerpo.data.solicitud) && !!tokenSeguimiento,
    cuerpo
  );

  // 10. Ahora sí debe aparecer al filtrar por "atendida"
  resp = await fetch(`${BASE_URL}?estado=atendida`, {
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar(
    'Filtrar por "atendida" tras el cambio -> incluye la solicitud',
    resp.status === 200 && cuerpo.data.some((s) => s.id === idCreado),
    cuerpo
  );

  // 11. Editar sin permisos
  resp = await fetch(`${BASE_URL}/${idCreado}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: 'Título editado',
      descripcion: 'Descripción editada, suficientemente larga para pasar.',
      fecha: '2026-09-21',
    }),
  });
  cuerpo = await resp.json();
  verificar('Editar sin permisos -> 403', resp.status === 403 && cuerpo.success === false, cuerpo);

  // 12. Editar con permisos de gestor
  resp = await fetch(`${BASE_URL}/${idCreado}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
    body: JSON.stringify({
      titulo: 'Título editado',
      descripcion: 'Descripción editada, suficientemente larga para pasar.',
      fecha: '2026-09-21',
    }),
  });
  cuerpo = await resp.json();
  verificar(
    'Editar con permisos de gestor -> 200 y refleja el cambio',
    resp.status === 200 && cuerpo.success === true && cuerpo.data.titulo === 'Título editado',
    cuerpo
  );

  // 13. Buscar por título
  resp = await fetch(`${BASE_URL}?buscar=editado`, {
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar(
    'Buscar por título -> encuentra la solicitud editada',
    resp.status === 200 && cuerpo.data.some((s) => s.id === idCreado),
    cuerpo
  );

  // 14. Orden por más antiguas primero
  resp = await fetch(`${BASE_URL}?orden=antiguas`, {
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar(
    'Orden "antiguas" -> primer resultado tiene el id más chico',
    resp.status === 200 && cuerpo.data.length > 0 && Number(cuerpo.data[0].id) === Math.min(...cuerpo.data.map((s) => Number(s.id))),
    cuerpo
  );

  // 15. Chat ciudadano sobre el número de gestión
  resp = await fetch(`${BASE_URL}/seguimiento/mensajes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Seguimiento-Token': tokenSeguimiento },
    body: JSON.stringify({ texto: '¿Cuál es el avance de mi trámite?' }),
  });
  cuerpo = await resp.json();
  verificar('Ciudadano envía mensaje -> 201', resp.status === 201 && cuerpo.success === true, cuerpo);

  resp = await fetch(`${BASE_URL}/seguimiento/mensajes`, {
    headers: { 'X-Seguimiento-Token': tokenSeguimiento },
  });
  cuerpo = await resp.json();
  verificar(
    'Listar mensajes del trámite -> incluye el del ciudadano',
    resp.status === 200 && Array.isArray(cuerpo.data) && cuerpo.data.some((m) => m.autor === 'ciudadano'),
    cuerpo
  );

  resp = await fetch(`${BASE_URL}/notificaciones`, {
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar(
    'Gestor ve notificación de mensaje -> 200',
    resp.status === 200 && cuerpo.success === true && cuerpo.data.some((n) => n.solicitudId === idCreado),
    cuerpo
  );

  // 16. Eliminar sin permisos
  resp = await fetch(`${BASE_URL}/${idCreado}`, { method: 'DELETE' });
  cuerpo = await resp.json();
  verificar('Eliminar sin permisos -> 403', resp.status === 403 && cuerpo.success === false, cuerpo);

  // 16. Eliminar con permisos de gestor
  resp = await fetch(`${BASE_URL}/${idCreado}`, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar('Eliminar con permisos de gestor -> 200', resp.status === 200 && cuerpo.success === true, cuerpo);

  // 17. Ya no debe existir
  resp = await fetch(`${BASE_URL}/${idCreado}`, {
    headers: { Authorization: 'Bearer TOKEN_GESTOR_DEMO' },
  });
  cuerpo = await resp.json();
  verificar('Consultar la solicitud eliminada -> 404', resp.status === 404 && cuerpo.success === false, cuerpo);

  console.log('\n----------------------------------------');
  console.log(fallos === 0 ? 'Todos los casos pasaron.' : `${fallos} caso(s) fallaron.`);
  process.exit(fallos === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Error ejecutando el cliente de prueba:', err);
  process.exit(1);
});
