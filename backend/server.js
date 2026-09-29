const http = require('http');
const { URL } = require('url');
const store = require('./src/data/store');
const { identificar, tienePermiso } = require('./src/middlewares/auth');
const {
  validarCreacion,
  validarFiltroEstado,
  validarCambioEstado,
  validarMensaje,
} = require('./src/middlewares/validate');

const PUERTO = process.env.PUERTO || 3000;

function enviarJSON(res, status, cuerpo) {
  const texto = JSON.stringify(cuerpo);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(texto),
  });
  res.end(texto);
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let datos = '';
    req.on('data', (fragmento) => {
      datos += fragmento;
      // Límite simple contra cargas excesivas en el ejercicio.
      if (datos.length > 1_000_000) req.destroy();
    });
    req.on('end', () => {
      if (!datos) return resolve({});
      try {
        resolve(JSON.parse(datos));
      } catch (_err) {
        reject(new Error('JSON_INVALIDO'));
      }
    });
    req.on('error', reject);
  });
}

// Patrones de ruta soportados bajo /api/solicitudes
const RUTA_ID = /^\/api\/solicitudes\/([^/]+)$/;
const RUTA_ESTADO = /^\/api\/solicitudes\/([^/]+)\/estado$/;
const RUTA_MENSAJES = /^\/api\/solicitudes\/([^/]+)\/mensajes$/;
const RUTA_LECTURA = /^\/api\/solicitudes\/([^/]+)\/lectura$/;

function aplicarCORS(req, res) {
  // Necesario porque Angular (p. ej. localhost:4200) y Nuxt (p. ej.
  // localhost:3001) corren en un puerto distinto al de esta API.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function manejarPeticion(req, res) {
  aplicarCORS(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const { pathname } = url;
  const usuario = identificar(req);

  try {
    // POST /api/solicitudes
    if (req.method === 'POST' && pathname === '/api/solicitudes') {
      const body = await leerCuerpo(req);
      const errores = validarCreacion(body);
      if (errores.length > 0) {
        return enviarJSON(res, 400, {
          success: false,
          error: { codigo: 'DATOS_INVALIDOS', mensaje: 'Hay campos incompletos o inválidos.', detalles: errores },
        });
      }
      const solicitud = store.crear({
        titulo: body.titulo.trim(),
        descripcion: body.descripcion.trim(),
        fecha: body.fecha,
      });
      return enviarJSON(res, 201, {
        success: true,
        mensaje: 'Solicitud registrada correctamente.',
        data: solicitud,
      });
    }

    // GET /api/solicitudes/publicas/listado[?estado=pendiente|atendida]
    // Vista pública, sin autenticación. Sin filtro devuelve todas (para
    // que el ciudadano vea qué está en trámite y qué ya se resolvió),
    // siempre con campos mínimos: nunca expone la descripción completa.
    if (req.method === 'GET' && pathname === '/api/solicitudes/publicas/listado') {
      const estado = url.searchParams.get('estado') || undefined;
      const errores = validarFiltroEstado(estado);
      if (errores.length > 0) {
        return enviarJSON(res, 400, {
          success: false,
          error: { codigo: 'FILTRO_INVALIDO', mensaje: 'El filtro de estado no es válido.', detalles: errores },
        });
      }
      const resultados = store.listar(estado).map(({ id, titulo, fecha, estado }) => ({ id, titulo, fecha, estado }));
      return enviarJSON(res, 200, { success: true, total: resultados.length, data: resultados });
    }

    // GET /api/solicitudes/publicas/:id — detalle público (mismos campos
    // mínimos), para que el ciudadano consulte el estado de un número
    // de seguimiento sin necesitar token.
    let coincidenciaPublica = pathname.match(/^\/api\/solicitudes\/publicas\/([^/]+)$/);
    if (req.method === 'GET' && coincidenciaPublica) {
      const id = decodeURIComponent(coincidenciaPublica[1]);
      const solicitud = store.obtenerPorId(id);
      if (!solicitud) {
        return enviarJSON(res, 404, {
          success: false,
          error: { codigo: 'NO_ENCONTRADA', mensaje: `No existe una solicitud con número "${id}".` },
        });
      }
      const { id: idPub, titulo, fecha, estado } = solicitud;
      return enviarJSON(res, 200, { success: true, data: { id: idPub, titulo, fecha, estado } });
    }

    // GET /api/solicitudes/notificaciones — bandeja del gestor
    if (req.method === 'GET' && pathname === '/api/solicitudes/notificaciones') {
      if (!tienePermiso(usuario, 'gestor')) {
        return enviarJSON(res, 403, {
          success: false,
          error: { codigo: 'SIN_PERMISOS', mensaje: 'Esta operación requiere el rol "gestor".' },
        });
      }
      const avisos = store.listarNotificaciones();
      return enviarJSON(res, 200, { success: true, total: avisos.length, data: avisos });
    }

    // GET/POST /api/solicitudes/:id/mensajes — chat del número de gestión
    let coincidenciaMensajes = pathname.match(RUTA_MENSAJES);
    if (coincidenciaMensajes && (req.method === 'GET' || req.method === 'POST')) {
      const id = decodeURIComponent(coincidenciaMensajes[1]);
      const existente = store.obtenerPorId(id);
      if (!existente) {
        return enviarJSON(res, 404, {
          success: false,
          error: { codigo: 'NO_ENCONTRADA', mensaje: `No existe una solicitud con número "${id}".` },
        });
      }
      if (req.method === 'GET') {
        return enviarJSON(res, 200, { success: true, data: store.listarMensajes(id) });
      }
      const body = await leerCuerpo(req);
      const errores = validarMensaje(body);
      if (errores.length > 0) {
        return enviarJSON(res, 400, {
          success: false,
          error: { codigo: 'DATOS_INVALIDOS', mensaje: 'Hay campos incompletos o inválidos.', detalles: errores },
        });
      }
      const autor = tienePermiso(usuario, 'gestor') ? 'gestor' : 'ciudadano';
      const mensaje = store.agregarMensaje(id, { autor, texto: body.texto.trim() });
      return enviarJSON(res, 201, {
        success: true,
        mensaje: 'Mensaje enviado.',
        data: mensaje,
      });
    }

    // POST /api/solicitudes/:id/lectura — el gestor abre el expediente
    let coincidenciaLectura = pathname.match(RUTA_LECTURA);
    if (req.method === 'POST' && coincidenciaLectura) {
      const id = decodeURIComponent(coincidenciaLectura[1]);
      if (!tienePermiso(usuario, 'gestor')) {
        return enviarJSON(res, 403, {
          success: false,
          error: { codigo: 'SIN_PERMISOS', mensaje: 'Esta operación requiere el rol "gestor".' },
        });
      }
      const actualizada = store.marcarLeida(id);
      if (!actualizada) {
        return enviarJSON(res, 404, {
          success: false,
          error: { codigo: 'NO_ENCONTRADA', mensaje: `No existe una solicitud con id "${id}".` },
        });
      }
      return enviarJSON(res, 200, { success: true, data: actualizada });
    }

    // GET /api/solicitudes?estado=&buscar=&orden=recientes|antiguas
    if (req.method === 'GET' && pathname === '/api/solicitudes') {
      const estado = url.searchParams.get('estado') || undefined;
      const buscar = url.searchParams.get('buscar') || undefined;
      const orden = url.searchParams.get('orden') || undefined;
      const errores = validarFiltroEstado(estado);
      if (errores.length > 0) {
        return enviarJSON(res, 400, {
          success: false,
          error: { codigo: 'FILTRO_INVALIDO', mensaje: 'El filtro de estado no es válido.', detalles: errores },
        });
      }
      const resultados = store.listar(estado, { buscar, orden });
      return enviarJSON(res, 200, { success: true, total: resultados.length, data: resultados });
    }

    // PATCH /api/solicitudes/:id/estado
    let coincidencia = pathname.match(RUTA_ESTADO);
    if (req.method === 'PATCH' && coincidencia) {
      const id = decodeURIComponent(coincidencia[1]);
      if (!tienePermiso(usuario, 'gestor')) {
        return enviarJSON(res, 403, {
          success: false,
          error: { codigo: 'SIN_PERMISOS', mensaje: 'Esta operación requiere el rol "gestor".' },
        });
      }
      const body = await leerCuerpo(req);
      const errores = validarCambioEstado(body);
      if (errores.length > 0) {
        return enviarJSON(res, 400, {
          success: false,
          error: { codigo: 'DATOS_INVALIDOS', mensaje: 'Hay campos incompletos o inválidos.', detalles: errores },
        });
      }
      const existente = store.obtenerPorId(id);
      if (!existente) {
        return enviarJSON(res, 404, {
          success: false,
          error: { codigo: 'NO_ENCONTRADA', mensaje: `No existe una solicitud con id "${id}".` },
        });
      }
      const actualizada = store.actualizarEstado(id, body.estado);
      return enviarJSON(res, 200, {
        success: true,
        mensaje: `El estado se actualizó a "${actualizada.estado}".`,
        data: actualizada,
      });
    }

    // PUT /api/solicitudes/:id — edición completa (no cambia el estado)
    coincidencia = pathname.match(RUTA_ID);
    if (req.method === 'PUT' && coincidencia) {
      const id = decodeURIComponent(coincidencia[1]);
      if (!tienePermiso(usuario, 'gestor')) {
        return enviarJSON(res, 403, {
          success: false,
          error: { codigo: 'SIN_PERMISOS', mensaje: 'Esta operación requiere el rol "gestor".' },
        });
      }
      const body = await leerCuerpo(req);
      const errores = validarCreacion(body);
      if (errores.length > 0) {
        return enviarJSON(res, 400, {
          success: false,
          error: { codigo: 'DATOS_INVALIDOS', mensaje: 'Hay campos incompletos o inválidos.', detalles: errores },
        });
      }
      const existente = store.obtenerPorId(id);
      if (!existente) {
        return enviarJSON(res, 404, {
          success: false,
          error: { codigo: 'NO_ENCONTRADA', mensaje: `No existe una solicitud con id "${id}".` },
        });
      }
      const actualizada = store.actualizar(id, {
        titulo: body.titulo.trim(),
        descripcion: body.descripcion.trim(),
        fecha: body.fecha,
      });
      return enviarJSON(res, 200, {
        success: true,
        mensaje: 'Solicitud actualizada correctamente.',
        data: actualizada,
      });
    }

    // DELETE /api/solicitudes/:id — solo gestor
    if (req.method === 'DELETE' && coincidencia) {
      const id = decodeURIComponent(coincidencia[1]);
      if (!tienePermiso(usuario, 'gestor')) {
        return enviarJSON(res, 403, {
          success: false,
          error: { codigo: 'SIN_PERMISOS', mensaje: 'Esta operación requiere el rol "gestor".' },
        });
      }
      const existente = store.obtenerPorId(id);
      if (!existente) {
        return enviarJSON(res, 404, {
          success: false,
          error: { codigo: 'NO_ENCONTRADA', mensaje: `No existe una solicitud con id "${id}".` },
        });
      }
      store.eliminar(id);
      return enviarJSON(res, 200, {
        success: true,
        mensaje: 'Solicitud eliminada correctamente.',
      });
    }

    // GET /api/solicitudes/:id
    if (req.method === 'GET' && coincidencia) {
      const id = decodeURIComponent(coincidencia[1]);
      const solicitud = store.obtenerPorId(id);
      if (!solicitud) {
        return enviarJSON(res, 404, {
          success: false,
          error: { codigo: 'NO_ENCONTRADA', mensaje: `No existe una solicitud con id "${id}".` },
        });
      }
      return enviarJSON(res, 200, { success: true, data: solicitud });
    }

    return enviarJSON(res, 404, {
      success: false,
      error: { codigo: 'RUTA_NO_ENCONTRADA', mensaje: `No existe la ruta ${req.method} ${pathname}.` },
    });
  } catch (err) {
    if (err.message === 'JSON_INVALIDO') {
      return enviarJSON(res, 400, {
        success: false,
        error: { codigo: 'JSON_INVALIDO', mensaje: 'El cuerpo de la petición no es JSON válido.' },
      });
    }
    console.error('Error no controlado:', err);
    return enviarJSON(res, 500, {
      success: false,
      error: { codigo: 'ERROR_SERVICIO', mensaje: 'Ocurrió un error inesperado en el servicio.' },
    });
  }
}

const servidor = http.createServer(manejarPeticion);

if (require.main === module) {
  servidor.listen(PUERTO, () => {
    console.log(`API de solicitudes escuchando en http://localhost:${PUERTO}`);
  });
}

module.exports = servidor;
