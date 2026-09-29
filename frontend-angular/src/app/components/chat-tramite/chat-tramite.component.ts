import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensajeTramite } from '../../models/solicitud.model';
import { SolicitudesService } from '../../services/solicitudes.service';

@Component({
  selector: 'app-chat-tramite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-tramite.component.html',
})
export class ChatTramiteComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) numeroGestion = '';
  @Input() rol: 'ciudadano' | 'gestor' = 'ciudadano';
  @ViewChild('listaMensajes') listaMensajes?: ElementRef<HTMLElement>;

  mensajes: MensajeTramite[] = [];
  texto = '';
  enviando = false;
  errorChat: string | null = null;
  cargando = false;

  private intervalo: ReturnType<typeof setInterval> | null = null;

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.iniciar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numeroGestion'] && !changes['numeroGestion'].firstChange) {
      this.iniciar();
    }
  }

  ngOnDestroy(): void {
    this.detener();
  }

  get tituloRol(): string {
    return this.rol === 'gestor' ? 'Conversación con el ciudadano' : 'Conversación con SENPRENDE';
  }

  enviar(): void {
    const texto = this.texto.trim();
    if (!texto || !this.numeroGestion || this.enviando) return;

    this.enviando = true;
    this.errorChat = null;
    this.solicitudesService.enviarMensaje(this.numeroGestion, texto).subscribe({
      next: (respuesta) => {
        this.enviando = false;
        if (respuesta.success) {
          this.texto = '';
          this.cargar(true);
        }
      },
      error: (respuesta) => {
        this.enviando = false;
        this.errorChat = respuesta?.error?.mensaje ?? 'No fue posible enviar el mensaje.';
      },
    });
  }

  private iniciar(): void {
    this.detener();
    this.mensajes = [];
    this.texto = '';
    if (!this.numeroGestion) return;
    this.cargar();
    this.intervalo = setInterval(() => this.cargar(), 5000);
  }

  private detener(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  private cargar(forzarScroll = false): void {
    if (!this.numeroGestion) return;
    const eraVacio = this.mensajes.length === 0;
    this.cargando = this.mensajes.length === 0;
    this.solicitudesService.listarMensajes(this.numeroGestion).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        if (respuesta.success) {
          const anterior = this.mensajes.length;
          this.mensajes = respuesta.data;
          if (forzarScroll || eraVacio || respuesta.data.length !== anterior) {
            setTimeout(() => this.bajarScroll(), 0);
          }
        }
      },
      error: (respuesta) => {
        this.cargando = false;
        this.errorChat = respuesta?.error?.mensaje ?? 'No fue posible cargar la conversación.';
      },
    });
  }

  private bajarScroll(): void {
    const el = this.listaMensajes?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
