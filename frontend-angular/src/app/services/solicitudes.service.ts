import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AccesoSeguimiento, EstadoSolicitud, MensajeTramite, NotificacionBandeja, RespuestaApi, Solicitud, SolicitudPublica } from '../models/solicitud.model';
import { AuthService } from './auth.service';

/**
 * Ajusta esta URL si la API corre en otro host/puerto durante el
 * desarrollo (por ejemplo mediante un proxy de Angular CLI).
 */
const BASE_URL = '/api/solicitudes';

export interface RespuestaWilliams {
  answer: string;
  sources: { title: string; url: string }[];
  needsAdvisor: boolean;
}

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  consultarWilliams(pregunta: string, historial: { role: 'user' | 'assistant'; content: string }[]): Observable<RespuestaApi<RespuestaWilliams>> {
    return this.http
      .post<RespuestaApi<RespuestaWilliams>>('/api/williams', { pregunta, historial })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  crear(datos: { nombreSolicitante: string; identidad: string; titulo: string; descripcion: string }): Observable<RespuestaApi<Solicitud>> {
    return this.http
      .post<RespuestaApi<Solicitud>>(BASE_URL, datos, { headers: this.auth.obtenerEncabezadoAutorizacion() })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  listar(estado?: EstadoSolicitud, opciones?: { buscar?: string; orden?: 'recientes' | 'antiguas' }): Observable<RespuestaApi<Solicitud[]>> {
    let params = new HttpParams();
    if (estado) params = params.set('estado', estado);
    if (opciones?.buscar) params = params.set('buscar', opciones.buscar);
    if (opciones?.orden) params = params.set('orden', opciones.orden);
    return this.http
      .get<RespuestaApi<Solicitud[]>>(BASE_URL, { params, headers: this.auth.obtenerEncabezadoAutorizacion() })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  /** Edición completa (título, descripción, fecha) — requiere sesión de gestor. */
  actualizar(id: string, datos: { titulo: string; descripcion: string; fecha: string }): Observable<RespuestaApi<Solicitud>> {
    return this.http
      .put<RespuestaApi<Solicitud>>(`${BASE_URL}/${id}`, datos, { headers: this.auth.obtenerEncabezadoAutorizacion() })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  /** Elimina una solicitud — requiere sesión de gestor. */
  eliminar(id: string): Observable<RespuestaApi<null>> {
    return this.http
      .delete<RespuestaApi<null>>(`${BASE_URL}/${id}`, { headers: this.auth.obtenerEncabezadoAutorizacion() })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  obtener(id: string): Observable<RespuestaApi<Solicitud>> {
    return this.http
      .get<RespuestaApi<Solicitud>>(`${BASE_URL}/${id}`, { headers: this.auth.obtenerEncabezadoAutorizacion() })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  verificarSeguimiento(numeroGestion: string): Observable<RespuestaApi<AccesoSeguimiento>> {
    return this.http
      .post<RespuestaApi<AccesoSeguimiento>>(`${BASE_URL}/publicas/consulta`, { numeroGestion })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  cambiarEstado(id: string, estado: EstadoSolicitud): Observable<RespuestaApi<Solicitud>> {
    return this.http
      .patch<RespuestaApi<Solicitud>>(
        `${BASE_URL}/${id}/estado`,
        { estado },
        { headers: this.auth.obtenerEncabezadoAutorizacion() }
      )
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  listarMensajes(id: string, tokenSeguimiento?: string): Observable<RespuestaApi<MensajeTramite[]>> {
    let headers = new HttpHeaders(this.auth.obtenerEncabezadoAutorizacion());
    if (tokenSeguimiento) headers = headers.set('X-Seguimiento-Token', tokenSeguimiento);
    const url = tokenSeguimiento ? `${BASE_URL}/seguimiento/mensajes` : `${BASE_URL}/${id}/mensajes`;
    return this.http
      .get<RespuestaApi<MensajeTramite[]>>(url, {
        headers,
      })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  enviarMensaje(id: string, texto: string, tokenSeguimiento?: string): Observable<RespuestaApi<MensajeTramite>> {
    let headers = new HttpHeaders(this.auth.obtenerEncabezadoAutorizacion());
    if (tokenSeguimiento) headers = headers.set('X-Seguimiento-Token', tokenSeguimiento);
    const url = tokenSeguimiento ? `${BASE_URL}/seguimiento/mensajes` : `${BASE_URL}/${id}/mensajes`;
    return this.http
      .post<RespuestaApi<MensajeTramite>>(
        url,
        { texto },
        { headers }
      )
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  listarNotificaciones(): Observable<RespuestaApi<NotificacionBandeja[]>> {
    return this.http
      .get<RespuestaApi<NotificacionBandeja[]>>(`${BASE_URL}/notificaciones`, {
        headers: this.auth.obtenerEncabezadoAutorizacion(),
      })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  marcarLectura(id: string): Observable<RespuestaApi<Solicitud>> {
    return this.http
      .post<RespuestaApi<Solicitud>>(`${BASE_URL}/${id}/lectura`, {}, { headers: this.auth.obtenerEncabezadoAutorizacion() })
      .pipe(catchError((err) => this.normalizarError(err)));
  }

  /**
   * Convierte cualquier error HTTP (incluida una falla real de red/servicio,
   * como el backend caído) en una respuesta con la misma forma que usa el
   * resto de la aplicación, para que los componentes solo tengan que mirar
   * `success` y `error.mensaje`.
   */
  private normalizarError(err: HttpErrorResponse) {
    // El backend ya respondió con un cuerpo de error estructurado (400/403/404/500).
    if (err.error && typeof err.error === 'object' && 'success' in err.error) {
      return throwError(() => err.error as RespuestaApi<never>);
    }
    // Falla real del servicio: no hubo respuesta del backend (red caída, CORS, etc.).
    return throwError(
      () =>
        ({
          success: false,
          error: { codigo: 'ERROR_SERVICIO', mensaje: 'No fue posible comunicarse con el servicio.' },
        } as RespuestaApi<never>)
    );
  }
}
