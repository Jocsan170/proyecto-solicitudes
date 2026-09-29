import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoSolicitud, Solicitud } from '../../models/solicitud.model';
import { SolicitudesService } from '../../services/solicitudes.service';
import { AuthService } from '../../services/auth.service';

type FiltroEstado = EstadoSolicitud | 'todas';
type Orden = 'recientes' | 'antiguas';

@Component({
  selector: 'app-solicitudes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudes-list.component.html',
})
export class SolicitudesListComponent implements OnInit {
  /** Portal público (Nuxt) — ajusta el puerto si lo corres distinto. */
  readonly portalPublicoUrl = 'http://localhost:3001/solicitudes';

  // --- Sesión de gestor ---
  usuario = '';
  contrasena = '';
  errorLogin: string | null = null;

  // --- Listado ---
  solicitudes: Solicitud[] = [];
  filtro: FiltroEstado = 'todas';
  busqueda = '';
  orden: Orden = 'recientes';

  cargando = false;
  errorCarga: string | null = null;
  listaVacia = false;

  mensajeConfirmacion: string | null = null;
  errorAccion: string | null = null;

  // --- Edición en línea ---
  idEnEdicion: string | null = null;
  edicionTitulo = '';
  edicionDescripcion = '';
  edicionFecha = '';
  guardandoEdicion = false;
  errorEdicion: string | null = null;

  procesandoId: string | null = null;

  constructor(private solicitudesService: SolicitudesService, private auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.estaAutenticado()) {
      this.cargar();
    }
  }

  get sesionActiva(): boolean {
    return this.auth.estaAutenticado();
  }

  iniciarSesion(): void {
    const ok = this.auth.iniciarSesion(this.usuario.trim(), this.contrasena);
    if (ok) {
      this.errorLogin = null;
      this.contrasena = '';
      this.cargar();
    } else {
      this.errorLogin = 'Usuario o contraseña incorrectos.';
    }
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.usuario = '';
    this.contrasena = '';
    this.solicitudes = [];
    this.idEnEdicion = null;
  }

  aplicarFiltro(valor: FiltroEstado): void {
    this.filtro = valor;
    this.cargar();
  }

  aplicarOrden(valor: Orden): void {
    this.orden = valor;
    this.cargar();
  }

  buscar(): void {
    this.cargar();
  }

  cargar(): void {
    if (!this.sesionActiva) return;

    this.cargando = true;
    this.errorCarga = null;
    this.listaVacia = false;

    const estado = this.filtro === 'todas' ? undefined : this.filtro;

    this.solicitudesService.listar(estado, { buscar: this.busqueda || undefined, orden: this.orden }).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        if (respuesta.success) {
          this.solicitudes = respuesta.data;
          this.listaVacia = respuesta.data.length === 0;
        }
      },
      error: (respuesta) => {
        this.cargando = false;
        this.solicitudes = [];
        this.errorCarga = respuesta?.error?.mensaje ?? 'No fue posible cargar las solicitudes.';
      },
    });
  }

  cambiarEstado(solicitud: Solicitud, nuevoEstado: EstadoSolicitud): void {
    this.mensajeConfirmacion = null;
    this.errorAccion = null;
    this.procesandoId = solicitud.id;

    this.solicitudesService.cambiarEstado(solicitud.id, nuevoEstado).subscribe({
      next: (respuesta) => {
        this.procesandoId = null;
        if (respuesta.success) {
          this.mensajeConfirmacion = respuesta.mensaje ?? 'Estado actualizado.';
          this.cargar();
        }
      },
      error: (respuesta) => {
        this.procesandoId = null;
        this.errorAccion = respuesta?.error?.mensaje ?? 'No fue posible cambiar el estado.';
      },
    });
  }

  iniciarEdicion(solicitud: Solicitud): void {
    this.idEnEdicion = solicitud.id;
    this.edicionTitulo = solicitud.titulo;
    this.edicionDescripcion = solicitud.descripcion;
    this.edicionFecha = solicitud.fecha;
    this.errorEdicion = null;
  }

  cancelarEdicion(): void {
    this.idEnEdicion = null;
    this.errorEdicion = null;
  }

  guardarEdicion(): void {
    if (!this.idEnEdicion) return;

    this.guardandoEdicion = true;
    this.errorEdicion = null;

    this.solicitudesService
      .actualizar(this.idEnEdicion, {
        titulo: this.edicionTitulo,
        descripcion: this.edicionDescripcion,
        fecha: this.edicionFecha,
      })
      .subscribe({
        next: (respuesta) => {
          this.guardandoEdicion = false;
          if (respuesta.success) {
            this.mensajeConfirmacion = respuesta.mensaje ?? 'Solicitud actualizada.';
            this.idEnEdicion = null;
            this.cargar();
          }
        },
        error: (respuesta) => {
          this.guardandoEdicion = false;
          if (respuesta?.error?.detalles?.length) {
            this.errorEdicion = respuesta.error.detalles.map((d: any) => d.mensaje).join(' ');
          } else {
            this.errorEdicion = respuesta?.error?.mensaje ?? 'No fue posible guardar los cambios.';
          }
        },
      });
  }

  eliminar(solicitud: Solicitud): void {
    const confirmado = window.confirm(`¿Eliminar la solicitud #${solicitud.id} ("${solicitud.titulo}")? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    this.mensajeConfirmacion = null;
    this.errorAccion = null;
    this.procesandoId = solicitud.id;

    this.solicitudesService.eliminar(solicitud.id).subscribe({
      next: (respuesta) => {
        this.procesandoId = null;
        if (respuesta.success) {
          this.mensajeConfirmacion = respuesta.mensaje ?? 'Solicitud eliminada.';
          this.cargar();
        }
      },
      error: (respuesta) => {
        this.procesandoId = null;
        this.errorAccion = respuesta?.error?.mensaje ?? 'No fue posible eliminar la solicitud.';
      },
    });
  }
}
