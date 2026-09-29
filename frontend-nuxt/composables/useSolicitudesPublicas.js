/**
 * Composable para consumir el endpoint público y de solo lectura
 * (sin autenticación) que expone las solicitudes ciudadanas con
 * campos mínimos (nunca la descripción completa).
 *
 * Trae todas de una vez y las separa en pendientes/atendidas, así el
 * ciudadano ve de un vistazo qué sigue en trámite y qué ya se resolvió.
 *
 * Usa fetch nativo (disponible en el navegador y en Node 18+ durante
 * el renderizado en el servidor) para no depender de auto-imports.
 */
import { ref, computed } from 'vue';

export function useSolicitudesPublicas() {
  const todas = ref([]);
  const cargando = ref(false);
  const errorServicio = ref(null);
  const yaCargado = ref(false);

  const BASE_URL = 'http://localhost:3000/api/solicitudes/publicas/listado';

  const pendientes = computed(() => todas.value.filter((s) => s.estado === 'pendiente'));
  const atendidas = computed(() => todas.value.filter((s) => s.estado === 'atendida'));
  const listaVacia = computed(() => yaCargado.value && !errorServicio.value && todas.value.length === 0);

  async function cargar() {
    cargando.value = true;
    errorServicio.value = null;

    try {
      const res = await fetch(BASE_URL);
      const respuesta = await res.json();

      if (respuesta.success) {
        todas.value = respuesta.data;
      } else {
        // El backend respondió pero con un error estructurado.
        errorServicio.value = respuesta.error?.mensaje ?? 'No fue posible cargar la información.';
      }
    } catch (err) {
      // Falla real de comunicación con el servicio (caído, red, etc.),
      // distinta de una lista vacía.
      errorServicio.value = 'No fue posible comunicarse con el servicio en este momento.';
    } finally {
      cargando.value = false;
      yaCargado.value = true;
    }
  }

  return { todas, pendientes, atendidas, cargando, errorServicio, listaVacia, cargar };
}
