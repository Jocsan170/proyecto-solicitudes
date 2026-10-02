export type EstadoSolicitud = 'pendiente' | 'atendida';
export type AutorMensaje = 'ciudadano' | 'gestor';

export interface MensajeTramite {
  id: string;
  autor: AutorMensaje;
  texto: string;
  fecha: string;
  leidoPorGestor?: boolean;
}

export interface Solicitud {
  id: string;
  numeroGestion: string;
  nombreSolicitante: string;
  identidad: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: EstadoSolicitud;
  historialEstados?: { estado: EstadoSolicitud; fecha: string }[];
  creadaEn?: string;
  leidaPorGestor?: boolean;
  mensajes?: MensajeTramite[];
}

export interface SolicitudPublica {
  id: string;
  fecha: string;
  estado: EstadoSolicitud;
  historialEstados?: { estado: EstadoSolicitud; fecha: string }[];
}

export interface AccesoSeguimiento {
  solicitud: SolicitudPublica;
  token: string;
}

export interface NotificacionBandeja {
  id: string;
  tipo: 'nueva_solicitud' | 'mensaje_ciudadano' | string;
  solicitudId: string;
  titulo: string;
  texto: string;
  fecha: string;
}

export interface RespuestaExitosa<T> {
  success: true;
  data: T;
  total?: number;
  mensaje?: string;
}

export interface DetalleError {
  campo?: string;
  mensaje: string;
}

export interface RespuestaError {
  success: false;
  error: {
    codigo: string;
    mensaje: string;
    detalles?: DetalleError[];
  };
}

export type RespuestaApi<T> = RespuestaExitosa<T> | RespuestaError;
