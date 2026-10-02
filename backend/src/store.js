/**
 * Almacén con persistencia simple en archivo JSON.
 *
 * No es una base de datos real (sigue siendo un ejercicio de
 * entrenamiento), pero ya sobrevive a reiniciar el servidor: cada
 * cambio (crear, editar, cambiar estado, eliminar, mensajes) se guarda
 * de inmediato en data/solicitudes.json.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ARCHIVO_DATOS = process.env.SOLICITUDES_DATA_FILE || path.join(__dirname, '..', 'data', 'solicitudes.json');
const DIR_DATOS = path.dirname(ARCHIVO_DATOS);

let contadorId = 1;
let contadorMensaje = 1;

const CODIGO_GESTION_NUEVO = /^\d{12}$/;
const CODIGO_GESTION_ANTERIOR = /^[A-F0-9]{16}$/;

/**
 * @typedef {{id:string, autor:'ciudadano'|'gestor', texto:string, fecha:string, leidoPorGestor:boolean}} Mensaje
 * @typedef {{id:string, numeroGestion:string, codigosAnteriores?:string[], nombreSolicitante:string, identidad:string, titulo:string, descripcion:string, fecha:string, estado:'pendiente'|'atendida', creadaEn:string, leidaPorGestor:boolean, mensajes:Mensaje[]}} Solicitud
 */

/** @type {Solicitud[]} */
let solicitudes = [];

function generarNumeroGestion() {
  let numero;
  do {
    numero = crypto.randomInt(0, 1_000_000_000_000).toString().padStart(12, '0');
  } while (solicitudes.some((s) => s.numeroGestion === numero || s.codigosAnteriores?.includes(numero)));
  return numero;
}

function ahoraIso() {
  return new Date().toISOString();
}

/** @param {Partial<Solicitud>} s */
function normalizarSolicitud(s) {
  const historialEstados = Array.isArray(s.historialEstados) && s.historialEstados.length
    ? s.historialEstados.map((e) => ({ estado: e.estado === 'atendida' ? 'atendida' : 'pendiente', fecha: e.fecha || ahoraIso() }))
    : [{ estado: s.estado === 'atendida' ? 'atendida' : 'pendiente', fecha: s.creadaEn || s.fecha || ahoraIso() }];
  const mensajes = Array.isArray(s.mensajes)
    ? s.mensajes.map((m) => ({
        id: String(m.id),
        autor: m.autor === 'gestor' ? 'gestor' : 'ciudadano',
        texto: String(m.texto || ''),
        fecha: m.fecha || ahoraIso(),
        leidoPorGestor: m.leidoPorGestor === true || m.autor === 'gestor',
      }))
    : [];
  const codigoGuardado = typeof s.numeroGestion === 'string' ? s.numeroGestion.toUpperCase() : '';
  const codigosAnteriores = Array.isArray(s.codigosAnteriores)
    ? s.codigosAnteriores.filter((codigo) => typeof codigo === 'string' && CODIGO_GESTION_ANTERIOR.test(codigo))
    : [];
  const numeroGestion = CODIGO_GESTION_NUEVO.test(codigoGuardado)
    ? codigoGuardado
    : generarNumeroGestion();
  if (CODIGO_GESTION_ANTERIOR.test(codigoGuardado) && codigoGuardado !== numeroGestion && !codigosAnteriores.includes(codigoGuardado)) {
    codigosAnteriores.push(codigoGuardado);
  }
  return {
    id: String(s.id),
    numeroGestion,
    codigosAnteriores,
    nombreSolicitante: s.nombreSolicitante || '',
    identidad: s.identidad || '',
    titulo: s.titulo || '',
    descripcion: s.descripcion || '',
    fecha: s.fecha || '',
    estado: s.estado === 'atendida' ? 'atendida' : 'pendiente',
    historialEstados,
    creadaEn: s.creadaEn || s.fecha || ahoraIso(),
    leidaPorGestor: s.leidaPorGestor !== false,
    mensajes,
  };
}

function recalcularContadores() {
  const maxId = solicitudes.reduce((max, s) => Math.max(max, Number(s.id) || 0), 0);
  contadorId = maxId + 1;
  const maxMsg = solicitudes.reduce((max, s) => {
    const local = s.mensajes.reduce((m, msg) => Math.max(m, Number(msg.id) || 0), 0);
    return Math.max(max, local);
  }, 0);
  contadorMensaje = maxMsg + 1;
}

function cargarDesdeDisco() {
  try {
    if (!fs.existsSync(ARCHIVO_DATOS)) return;
    const contenido = fs.readFileSync(ARCHIVO_DATOS, 'utf-8');
    const datos = JSON.parse(contenido);
    if (Array.isArray(datos)) {
      const migrados = datos.some((s) => !s || typeof s.numeroGestion !== 'string' || !CODIGO_GESTION_NUEVO.test(s.numeroGestion));
      solicitudes = [];
      for (const dato of datos) solicitudes.push(normalizarSolicitud(dato));
      recalcularContadores();
      if (migrados) guardarEnDisco();
    }
  } catch (err) {
    console.error('No se pudo leer data/solicitudes.json, se inicia con datos vacíos:', err.message);
    solicitudes = [];
    contadorId = 1;
    contadorMensaje = 1;
  }
}

function guardarEnDisco() {
  try {
    if (!fs.existsSync(DIR_DATOS)) fs.mkdirSync(DIR_DATOS, { recursive: true });
    fs.writeFileSync(ARCHIVO_DATOS, JSON.stringify(solicitudes, null, 2), 'utf-8');
  } catch (err) {
    console.error('No se pudo guardar data/solicitudes.json:', err.message);
  }
}

cargarDesdeDisco();

function reiniciar() {
  solicitudes = [];
  contadorId = 1;
  contadorMensaje = 1;
  guardarEnDisco();
}

function crear({ nombreSolicitante, identidad, titulo, descripcion, fecha }) {
  const nueva = {
    id: String(contadorId++),
    numeroGestion: generarNumeroGestion(),
    nombreSolicitante,
    identidad,
    titulo,
    descripcion,
    fecha,
    estado: 'pendiente',
    historialEstados: [{ estado: 'pendiente', fecha: ahoraIso() }],
    creadaEn: ahoraIso(),
    leidaPorGestor: false,
    mensajes: [],
  };
  solicitudes.push(nueva);
  guardarEnDisco();
  return nueva;
}

/**
 * @param {'pendiente'|'atendida'|undefined} filtroEstado
 * @param {{ buscar?: string, orden?: 'recientes'|'antiguas' }} [opciones]
 */
function listar(filtroEstado, opciones = {}) {
  let resultado = filtroEstado ? solicitudes.filter((s) => s.estado === filtroEstado) : [...solicitudes];

  if (opciones.buscar) {
    const termino = opciones.buscar.trim().toLowerCase();
    if (termino) {
      resultado = resultado.filter((s) => s.titulo.toLowerCase().includes(termino));
    }
  }

  if (opciones.orden === 'antiguas') {
    resultado.sort((a, b) => Number(a.id) - Number(b.id));
  } else {
    resultado.sort((a, b) => Number(b.id) - Number(a.id));
  }

  return resultado;
}

function obtenerPorId(id) {
  return solicitudes.find((s) => s.id === id) || null;
}

function obtenerPorNumeroGestion(numeroGestion) {
  const normalizado = String(numeroGestion || '').replace(/[-\s]/g, '').toUpperCase();
  return solicitudes.find((s) => s.numeroGestion === normalizado || s.codigosAnteriores?.includes(normalizado)) || null;
}

function actualizarEstado(id, nuevoEstado) {
  const solicitud = obtenerPorId(id);
  if (!solicitud) return null;
  if (solicitud.estado !== nuevoEstado) {
    solicitud.estado = nuevoEstado;
    solicitud.historialEstados.push({ estado: nuevoEstado, fecha: ahoraIso() });
  }
  guardarEnDisco();
  return solicitud;
}

function actualizar(id, { titulo, descripcion, fecha }) {
  const solicitud = obtenerPorId(id);
  if (!solicitud) return null;
  solicitud.titulo = titulo;
  solicitud.descripcion = descripcion;
  solicitud.fecha = fecha;
  guardarEnDisco();
  return solicitud;
}

function eliminar(id) {
  const indice = solicitudes.findIndex((s) => s.id === id);
  if (indice === -1) return false;
  solicitudes.splice(indice, 1);
  guardarEnDisco();
  return true;
}

function listarMensajes(id) {
  const solicitud = obtenerPorId(id);
  if (!solicitud) return null;
  return solicitud.mensajes;
}

function agregarMensaje(id, { autor, texto }) {
  const solicitud = obtenerPorId(id);
  if (!solicitud) return null;
  const mensaje = {
    id: String(contadorMensaje++),
    autor,
    texto,
    fecha: ahoraIso(),
    leidoPorGestor: autor === 'gestor',
  };
  solicitud.mensajes.push(mensaje);
  guardarEnDisco();
  return mensaje;
}

function marcarLeida(id) {
  const solicitud = obtenerPorId(id);
  if (!solicitud) return null;
  solicitud.leidaPorGestor = true;
  solicitud.mensajes.forEach((m) => {
    m.leidoPorGestor = true;
  });
  guardarEnDisco();
  return solicitud;
}

function mensajesNoLeidos(solicitud) {
  return solicitud.mensajes.filter((m) => m.autor === 'ciudadano' && !m.leidoPorGestor);
}

function listarNotificaciones() {
  /** @type {Array<{id:string, tipo:string, solicitudId:string, titulo:string, texto:string, fecha:string}>} */
  const avisos = [];

  for (const s of solicitudes) {
    if (!s.leidaPorGestor) {
      avisos.push({
        id: `nueva-${s.id}`,
        tipo: 'nueva_solicitud',
        solicitudId: s.id,
        titulo: s.titulo,
        texto: `Nueva solicitud N.º ${s.id} ingresó a la mesa de trabajo.`,
        fecha: s.creadaEn,
      });
    }
    for (const m of mensajesNoLeidos(s)) {
      avisos.push({
        id: `msg-${m.id}`,
        tipo: 'mensaje_ciudadano',
        solicitudId: s.id,
        titulo: s.titulo,
        texto: `Mensaje del ciudadano en el trámite N.º ${s.id}.`,
        fecha: m.fecha,
      });
    }
  }

  avisos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  return avisos;
}

function resumenBandeja(solicitud) {
  return {
    id: solicitud.id,
    numeroGestion: solicitud.numeroGestion,
    titulo: solicitud.titulo,
    descripcion: solicitud.descripcion,
    fecha: solicitud.fecha,
    estado: solicitud.estado,
    creadaEn: solicitud.creadaEn,
    leidaPorGestor: solicitud.leidaPorGestor,
    mensajesPendientes: mensajesNoLeidos(solicitud).length,
    totalMensajes: solicitud.mensajes.length,
  };
}

module.exports = {
  crear,
  listar,
  obtenerPorId,
  obtenerPorNumeroGestion,
  actualizarEstado,
  actualizar,
  eliminar,
  reiniciar,
  listarMensajes,
  agregarMensaje,
  marcarLeida,
  listarNotificaciones,
  resumenBandeja,
};
