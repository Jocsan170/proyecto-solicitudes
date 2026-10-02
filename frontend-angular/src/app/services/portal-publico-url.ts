import { environment } from '../../environments/environment';

/** Devuelve la raíz del portal Nuxt tanto desde Angular local como desde producción. */
export function obtenerUrlPortalPublico(): string {
  if (typeof window === 'undefined') return environment.portalPublicoUrl;

  // En local, Angular puede ejecutarse con la configuración de producción
  // durante una vista previa; en ambos casos Nuxt escucha en el puerto 3001.
  if (!environment.production || window.location.port === '4200') {
    return `${window.location.protocol}//${window.location.hostname}:3001/`;
  }

  // En el despliegue institucional, Nuxt ocupa la raíz y Angular /registro/.
  return new URL(environment.portalPublicoUrl, window.location.origin).toString();
}
