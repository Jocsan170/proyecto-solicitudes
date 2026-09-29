/**
 * Autenticación/autorización simplificada para el ejercicio.
 *
 * En un sistema real esto vendría de un proveedor de identidad. Aquí,
 * para poder "probar el intento de operación sin permisos" con una
 * cuenta de prueba, se usan dos tokens fijos que representan dos
 * cuentas ficticias:
 *
 *   - Bearer TOKEN_CIUDADANO_DEMO  -> rol "ciudadano" (solo lectura/creación)
 *   - Bearer TOKEN_GESTOR_DEMO     -> rol "gestor" (puede cambiar estado)
 *
 * Cualquier otro valor, o la ausencia del encabezado, se trata como
 * anónimo: puede listar/consultar, pero no cambiar estados.
 */

const CUENTAS_DEMO = {
  TOKEN_CIUDADANO_DEMO: { rol: 'ciudadano' },
  TOKEN_GESTOR_DEMO: { rol: 'gestor' },
};

/** @param {import('http').IncomingMessage} req */
function identificar(req) {
  const encabezado = req.headers['authorization'] || '';
  const [tipo, token] = encabezado.split(' ');
  if (tipo === 'Bearer' && CUENTAS_DEMO[token]) {
    return CUENTAS_DEMO[token];
  }
  return null; // anónimo
}

function tienePermiso(usuario, rolRequerido) {
  return !!usuario && usuario.rol === rolRequerido;
}

module.exports = { identificar, tienePermiso };
