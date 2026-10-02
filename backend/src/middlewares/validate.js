/**
 * Validaciones de entrada. Se devuelve un arreglo de errores (vacío si
 * todo está bien) en lugar de lanzar excepciones, para que las rutas
 * decidan cómo responder.
 */

const ESTADOS_VALIDOS = ['pendiente', 'atendida'];

function esFechaValida(valor) {
  if (typeof valor !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
}

function validarCreacion(body, opciones = {}) {
  const errores = [];
  const requerirFecha = opciones.requerirFecha !== false;
  const { nombreSolicitante, identidad, titulo, descripcion, fecha } = body || {};

  if (typeof nombreSolicitante !== 'string' || nombreSolicitante.trim().length < 3 || nombreSolicitante.trim().length > 100) {
    errores.push({ campo: 'nombreSolicitante', mensaje: 'El nombre completo es obligatorio y debe tener entre 3 y 100 caracteres.' });
  }

  if (typeof identidad !== 'string' || !/^[0-9-]{8,20}$/.test(identidad.trim()) || identidad.trim().replace(/-/g, '').length < 8) {
    errores.push({ campo: 'identidad', mensaje: 'La identidad es obligatoria; escribe entre 8 y 20 números o guiones.' });
  }

  if (typeof titulo !== 'string' || titulo.trim().length === 0) {
    errores.push({ campo: 'titulo', mensaje: 'El título es obligatorio.' });
  } else if (titulo.trim().length < 3 || titulo.trim().length > 100) {
    errores.push({ campo: 'titulo', mensaje: 'El título debe tener entre 3 y 100 caracteres.' });
  }

  if (typeof descripcion !== 'string' || descripcion.trim().length === 0) {
    errores.push({ campo: 'descripcion', mensaje: 'La descripción es obligatoria.' });
  } else if (descripcion.trim().length < 10 || descripcion.trim().length > 500) {
    errores.push({ campo: 'descripcion', mensaje: 'La descripción debe tener entre 10 y 500 caracteres.' });
  }

  if (requerirFecha && (fecha === undefined || fecha === null || fecha === '')) {
    errores.push({ campo: 'fecha', mensaje: 'La fecha es obligatoria.' });
  } else if (fecha !== undefined && fecha !== null && fecha !== '' && !esFechaValida(fecha)) {
    errores.push({ campo: 'fecha', mensaje: 'La fecha debe tener un formato válido (ISO 8601).' });
  }

  return errores;
}

function validarFiltroEstado(valor) {
  if (valor === undefined) return [];
  if (!ESTADOS_VALIDOS.includes(valor)) {
    return [{ campo: 'estado', mensaje: `El filtro de estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.` }];
  }
  return [];
}

function validarCambioEstado(body) {
  const errores = [];
  const { estado } = body || {};
  if (typeof estado !== 'string' || estado.trim().length === 0) {
    errores.push({ campo: 'estado', mensaje: 'El estado es obligatorio.' });
  } else if (!ESTADOS_VALIDOS.includes(estado)) {
    errores.push({ campo: 'estado', mensaje: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}.` });
  }
  return errores;
}

function validarMensaje(body) {
  const errores = [];
  const { texto } = body || {};
  if (typeof texto !== 'string' || texto.trim().length === 0) {
    errores.push({ campo: 'texto', mensaje: 'El mensaje no puede ir vacío.' });
  } else if (texto.trim().length > 5000) {
    errores.push({ campo: 'texto', mensaje: 'El mensaje no puede superar 5,000 caracteres.' });
  }
  return errores;
}

module.exports = {
  ESTADOS_VALIDOS,
  validarCreacion,
  validarFiltroEstado,
  validarCambioEstado,
  validarMensaje,
};
