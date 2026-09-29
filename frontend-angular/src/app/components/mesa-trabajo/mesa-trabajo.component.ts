import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EstadoSolicitud, NotificacionBandeja, Solicitud } from '../../models/solicitud.model';
import { SolicitudesService } from '../../services/solicitudes.service';
import { AuthService } from '../../services/auth.service';
import { ChatTramiteComponent } from '../chat-tramite/chat-tramite.component';

type FiltroMesa = EstadoSolicitud | 'todas';

@Component({
  selector: 'app-mesa-trabajo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ChatTramiteComponent],
  templateUrl: './mesa-trabajo.component.html',
})
export class MesaTrabajoComponent implements OnInit, OnDestroy {
  usuario = '';
  contrasena = '';
  errorLogin: string | null = null;

  solicitudes: Solicitud[] = [];
  filtro: FiltroMesa = 'pendiente';
  busqueda = '';
  cargando = false;
  errorCarga: string | null = null;

  seleccionada: Solicitud | null = null;
  procesando = false;
  errorAccion: string | null = null;
  mensajeConfirmacion: string | null = null;

  notificaciones: NotificacionBandeja[] = [];
  panelAvisos = false;

  readonly portalPublicoUrl = 'http://localhost:3001/solicitudes';

  private intervalo: ReturnType<typeof setInterval> | null = null;

  constructor(private solicitudesService: SolicitudesService, private auth: AuthService) {}

  ngOnInit(): void {
    if (this.sesionActiva) {
      this.arrancarMesa();
    }
  }

  ngOnDestroy(): void {
    this.detener();
  }

  get sesionActiva(): boolean {
    return this.auth.estaAutenticado();
  }

  get pendientes(): number {
    return this.solicitudes.filter((s) => s.estado === 'pendiente').length;
  }

  get avisosNuevos(): number {
    return this.notificaciones.length;
  }

  get cola(): Solicitud[] {
    const termino = this.busqueda.trim().toLowerCase();
    return this.solicitudes.filter((s) => {
      const estadoOk = this.filtro === 'todas' ? true : s.estado === this.filtro;
      const busquedaOk = !termino || s.titulo.toLowerCase().includes(termino) || s.id.includes(termino);
      return estadoOk && busquedaOk;
    });
  }

  iniciarSesion(): void {
    const ok = this.auth.iniciarSesion(this.usuario.trim(), this.contrasena);
    if (ok) {
      this.errorLogin = null;
      this.contrasena = '';
      this.arrancarMesa();
    } else {
      this.errorLogin = 'Usuario o contraseña incorrectos.';
    }
  }

  cerrarSesion(): void {
    this.detener();
    this.auth.cerrarSesion();
    this.usuario = '';
    this.contrasena = '';
    this.solicitudes = [];
    this.seleccionada = null;
    this.notificaciones = [];
  }

  aplicarFiltro(valor: FiltroMesa): void {
    this.filtro = valor;
  }

  seleccionar(solicitud: Solicitud): void {
    this.seleccionada = solicitud;
    this.errorAccion = null;
    this.mensajeConfirmacion = null;
    this.panelAvisos = false;
    this.solicitudesService.marcarLectura(solicitud.id).subscribe({
      next: () => this.refrescar(),
      error: () => this.refrescar(),
    });
  }

  abrirDesdeAviso(aviso: NotificacionBandeja): void {
    const encontrada = this.solicitudes.find((s) => s.id === aviso.solicitudId);
    if (encontrada) {
      this.seleccionar(encontrada);
    } else {
      this.solicitudesService.obtener(aviso.solicitudId).subscribe({
        next: (respuesta) => {
          if (respuesta.success) this.seleccionar(respuesta.data);
        },
      });
    }
  }

  cambiarEstado(nuevoEstado: EstadoSolicitud): void {
    if (!this.seleccionada) return;
    this.procesando = true;
    this.errorAccion = null;
    this.solicitudesService.cambiarEstado(this.seleccionada.id, nuevoEstado).subscribe({
      next: (respuesta) => {
        this.procesando = false;
        if (respuesta.success) {
          this.seleccionada = respuesta.data;
          this.mensajeConfirmacion = respuesta.mensaje ?? 'Estado actualizado.';
          this.refrescar();
        }
      },
      error: (respuesta) => {
        this.procesando = false;
        this.errorAccion = respuesta?.error?.mensaje ?? 'No fue posible cambiar el estado.';
      },
    });
  }

  mensajesPendientes(s: Solicitud): number {
    return (s.mensajes || []).filter((m) => m.autor === 'ciudadano' && !m.leidoPorGestor).length;
  }

  esNueva(s: Solicitud): boolean {
    return s.leidaPorGestor === false;
  }

  private arrancarMesa(): void {
    this.refrescar();
    this.detener();
    this.intervalo = setInterval(() => this.refrescar(), 8000);
  }

  private detener(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  private refrescar(): void {
    this.cargando = this.solicitudes.length === 0;
    this.solicitudesService.listar(undefined, { orden: 'recientes' }).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        if (respuesta.success) {
          this.solicitudes = respuesta.data;
          if (this.seleccionada) {
            this.seleccionada = respuesta.data.find((s) => s.id === this.seleccionada?.id) || this.seleccionada;
          }
        }
      },
      error: (respuesta) => {
        this.cargando = false;
        this.errorCarga = respuesta?.error?.mensaje ?? 'No fue posible cargar la mesa de trabajo.';
      },
    });

    this.solicitudesService.listarNotificaciones().subscribe({
      next: (respuesta) => {
        if (respuesta.success) this.notificaciones = respuesta.data;
      },
    });
  }
}
