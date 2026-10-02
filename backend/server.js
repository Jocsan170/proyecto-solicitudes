const http = require('http');
const crypto = require('crypto');
const { URL } = require('url');
const store = require('./src/store');
const { responderWilliams } = require('./src/williams');
const { identificar, tienePermiso } = require('./src/middlewares/auth');
const {
  validarCreacion,
  validarFiltroEstado,
  validarCambioEstado,
  validarMensaje,
} = require('./src/middlewares/validate');

const PUERTO = process.env.PUERTO || 3000;
const SECRETO_SEGUIMIENTO = process.env.SEGUIMIENTO_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
const intentosSeguimiento = new Map();

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

const conversacionesWilliamsPorIp = new Map();

function limitarConversacionWilliams(ip) {
  const ahora = Date.now();
  const recientes = (conversacionesWilliamsPorIp.get(ip) || []).filter((fecha) => ahora - fecha < 60_000);
  if (recientes.length >= 20) return false;
  recientes.push(ahora);
  conversacionesWilliamsPorIp.set(ip, recientes);
  return true;
}

function aplicarCORS(req, res) {
  // Necesario porque Angular (p. ej. localhost:4200) y Nuxt (p. ej.
  // localhost:3001) corren en un puerto distinto al de esta API.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Seguimiento-Token');
}

function permitirConsultaSeguimiento(ip) {
  const ahora = Date.now();
  const recientes = (intentosSeguimiento.get(ip) || []).filter((fecha) => ahora - fecha < 15 * 60_000);
  if (recientes.length >= 8) return false;
  recientes.push(ahora);
  intentosSeguimiento.set(ip, recientes);
  return true;
}

function crearTokenSeguimiento(id) {
  const payload = Buffer.from(JSON.stringify({ id: String(id), exp: Date.now() + 30 * 60_000 })).toString('base64url');
  const firma = crypto.createHmac('sha256', SECRETO_SEGUIMIENTO).update(payload).digest('base64url');
  return `${payload}.${firma}`;
}

function idDesdeTokenSeguimiento(token) {
  if (typeof token !== 'string') return null;
  const partes = token.split('.');
  if (partes.length !== 2) return false;
  const [payload, firma] = partes;
  const esperada = crypto.createHmac('sha256', SECRETO_SEGUIMIENTO).update(payload).digest();
  let recibida;
  try { recibida = Buffer.from(firma, 'base64url'); } catch (_err) { return false; }
  if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) return false;
  try {
    const datos = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof datos.id === 'string' && Number.isFinite(datos.exp) && datos.exp > Date.now() ? datos.id : null;
  } catch (_err) {
    return null;
  }
}

function tokenSeguimientoValido(token, id) {
  return idDesdeTokenSeguimiento(token) === String(id);
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
    // POST /api/williams — asistente informativo restringido a fuentes oficiales.
    if (req.method === 'POST' && pathname === '/api/williams') {
      const ip = req.socket.remoteAddress || 'desconocida';
      if (!limitarConversacionWilliams(ip)) {
        return enviarJSON(res, 429, {
          success: false,
          error: { codigo: 'LIMITE_CONSULTAS', mensaje: 'Espera un momento antes de enviar otra pregunta.' },
        });
      }
      const body = await leerCuerpo(req);
      if (typeof body.pregunta !== 'string' || !body.pregunta.trim() || body.pregunta.length > 1000) {
        return enviarJSON(res, 400, {
          success: false,
          error: { codigo: 'PREGUNTA_INVALIDA', mensaje: 'Escribe una pregunta de hasta 1,000 caracteres.' },
        });
      }
      const historial = Array.isArray(body.historial)
        ? body.historial.slice(-8).filter((item) => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string')
        : [];
      const data = await responderWilliams({ pregunta: body.pregunta.trim(), historial });
      return enviarJSON(res, 200, { success: true, data });
    }

    // POST /api/solicitudes
    if (req.method === 'POST' && pathname === '/api/solicitudes') {
      const body = await leerCuerpo(req);
      const errores = validarCreacion(body, { requerirFecha: false });
      if (errores.length > 0) {
        return enviarJSON(res, 400, {
          success: false,
          error: { codigo: 'DATOS_INVALIDOS', mensaje: 'Hay campos incompletos o inválidos.', detalles: errores },
        });
      }
      const solicitud = store.crear({
        nombreSolicitante: body.nombreSolicitante.trim(),
        identidad: body.identidad.trim(),
        titulo: body.titulo.trim(),
        descripcion: body.descripcion.trim(),
        fecha: body.fecha || new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Tegucigalpa' }).format(new Date()),
      });
      return enviarJSON(res, 201, {
        success: true,
        mensaje: 'Solicitud registrada correctamente.',
        // También se entrega en la raíz para clientes que consumen el comprobante
        // sin depender de la forma interna del objeto de la solicitud.
        numeroGestion: solicitud.numeroGestion,
        data: solicitud,
      });
    }

    // POST /api/solicitudes/publicas/consulta — el código aleatorio actúa como
    // credencial de acceso individual; nunca se puede enumerar la bandeja.
    if (req.method === 'POST' && pathname === '/api/solicitudes/publicas/consulta') {
      const ip = req.socket.remoteAddress || 'desconocida';
      if (!permitirConsultaSeguimiento(ip)) {
        return enviarJSON(res, 429, { success: false, error: { codigo: 'LIMITE_CONSULTAS', mensaje: 'Has realizado varias consultas. Espera unos minutos e inténtalo de nuevo.' } });
      }
      const body = await leerCuerpo(req);
      const numeroGestion = typeof body.numeroGestion === 'string' ? body.numeroGestion.replace(/[-\s]/g, '').toUpperCase() : '';
      const codigoNumericoNuevo = /^\d{12}$/.test(numeroGestion);
      const codigoAnterior = /^[A-F0-9]{16}$/.test(numeroGestion);
      const solicitud = (codigoNumericoNuevo || codigoAnterior)
        ? store.obtenerPorNumeroGestion(numeroGestion)
        : null;
      if (!solicitud) {
        return enviarJSON(res, 404, { success: false, error: { codigo: 'NO_ENCONTRADA', mensaje: 'No fue posible verificar el número de gestión. Revísalo e inténtalo de nuevo.' } });
      }
      const { numeroGestion: codigo, fecha, estado, historialEstados = [] } = solicitud;
      return enviarJSON(res, 200, {
        success: true,
        data: {
          solicitud: { id: codigo, fecha, estado, historialEstados },
          token: crearTokenSeguimiento(codigo),
        },
      });
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

    // GET/POST /api/solicitudes/:id/mensajes — chat del gestor
    // GET/POST /api/solicitudes/seguimiento/mensajes — chat del ciudadano, identificado por token
    let coincidenciaMensajes = pathname.match(RUTA_MENSAJES);
    const rutaMensajesSeguimiento = pathname === '/api/solicitudes/seguimiento/mensajes';
    if ((coincidenciaMensajes || rutaMensajesSeguimiento) && (req.method === 'GET' || req.method === 'POST')) {
      const token = req.headers['x-seguimiento-token'];
      const esGestor = !rutaMensajesSeguimiento && tienePermiso(usuario, 'gestor');
      const id = rutaMensajesSeguimiento ? idDesdeTokenSeguimiento(token) : decodeURIComponent(coincidenciaMensajes[1]);
      if (rutaMensajesSeguimiento ? !id : (!esGestor && !tokenSeguimientoValido(token, id))) {
        return enviarJSON(res, 404, { success: false, error: { codigo: 'NO_ENCONTRADA', mensaje: 'No fue posible verificar el acceso a esta conversación.' } });
      }
      const existente = rutaMensajesSeguimiento
        ? store.obtenerPorNumeroGestion(id)
        : esGestor ? store.obtenerPorId(id) : store.obtenerPorNumeroGestion(id);
      if (!existente) {
        return enviarJSON(res, 404, {
          success: false,
          error: { codigo: 'NO_ENCONTRADA', mensaje: `No existe una solicitud con número "${id}".` },
        });
      }
      if (req.method === 'GET') {
        return enviarJSON(res, 200, { success: true, data: store.listarMensajes(existente.id) });
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
      const mensaje = store.agregarMensaje(existente.id, { autor, texto: body.texto.trim() });
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
      if (!tienePermiso(usuario, 'gestor')) {
        return enviarJSON(res, 403, {
          success: false,
          error: { codigo: 'SIN_PERMISOS', mensaje: 'El listado completo requiere el rol "gestor".' },
        });
      }
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
      if (!tienePermiso(usuario, 'gestor')) {
        return enviarJSON(res, 403, {
          success: false,
          error: { codigo: 'SIN_PERMISOS', mensaje: 'El detalle privado requiere el rol "gestor".' },
        });
      }
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
