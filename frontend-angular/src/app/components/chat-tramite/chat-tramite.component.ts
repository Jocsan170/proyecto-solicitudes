import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MensajeTramite, SolicitudPublica } from '../../models/solicitud.model';
import { SolicitudesService } from '../../services/solicitudes.service';
import { formatearNumeroGestion } from '../../utils/numero-gestion';

interface TurnoAsistente {
  autor: 'ciudadano' | 'william';
  texto: string;
  fecha: Date;
  sources?: { title: string; url: string }[];
}

const MARCADOR_DERIVACION = 'Solicitud de atención por asesor desde la conversación con Williams.';

@Component({
  selector: 'app-chat-tramite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-tramite.component.html',
})
export class ChatTramiteComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) numeroGestion = '';
  @Input() codigoVisible: string | null = null;
  @Input() rol: 'ciudadano' | 'gestor' = 'ciudadano';
  @Input() tokenSeguimiento = '';
  @Input() solicitudVerificada: SolicitudPublica | null = null;
  @ViewChild('listaMensajes') listaMensajes?: ElementRef<HTMLElement>;

  mensajes: MensajeTramite[] = [];
  turnos: TurnoAsistente[] = [];
  solicitud: SolicitudPublica | null = null;
  texto = '';
  enviando = false;
  errorChat: string | null = null;
  cargando = false;
  modoAsesor = false;
  esperandoValoracion = false;
  esperandoDecisionAsesor = false;
  derivando = false;
  chatMinimizado = false;

  private intervalo: ReturnType<typeof setInterval> | null = null;

  formatearCodigo(numero: string): string {
    return formatearNumeroGestion(numero);
  }

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.iniciar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numeroGestion'] && !changes['numeroGestion'].firstChange) this.iniciar();
  }

  ngOnDestroy(): void {
    this.detener();
  }

  get tituloRol(): string {
    return this.rol === 'gestor' ? 'Conversación con el ciudadano' : 'Chat con un asesor de SENPRENDE';
  }

  preguntarRapido(pregunta: string): void {
    if (this.enviando) return;
    this.texto = pregunta;
    this.enviar();
  }

  manejarEnter(evento: KeyboardEvent): void {
    if (evento.shiftKey) return;
    evento.preventDefault();
    this.enviar();
  }

  enviar(): void {
    const pregunta = this.texto.trim();
    if (!pregunta || this.enviando) return;
    this.texto = '';
    this.errorChat = null;

    if (this.rol === 'gestor' || this.modoAsesor) {
      if (!this.numeroGestion) return;
      this.enviando = true;
      this.solicitudesService.enviarMensaje(this.numeroGestion, pregunta, this.tokenSeguimiento).subscribe({
        next: (respuesta) => {
          this.enviando = false;
          if (respuesta.success) this.cargar(true);
        },
        error: (respuesta) => {
          this.enviando = false;
          this.errorChat = respuesta?.error?.mensaje ?? 'No fue posible enviar el mensaje.';
          this.texto = pregunta;
        },
      });
      return;
    }

    this.turnos.push({ autor: 'ciudadano', texto: pregunta, fecha: new Date() });
    this.esperandoDecisionAsesor = false;
    this.esperandoValoracion = false;
    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|hola william)[!.\s]*$/i.test(pregunta.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
      this.turnos.push({ autor: 'william', texto: '¡Hola! Soy Williams, el agente virtual de SENPRENDE. Puedo orientarte sobre nuestros servicios, programas y plataformas para emprendedores. ¿Qué te gustaría conocer?', fecha: new Date() });
      setTimeout(() => this.bajarScroll(), 0);
      return;
    }

    this.enviando = true;
    const historial = this.turnos.slice(-9, -1).map((turno) => ({
      role: turno.autor === 'william' ? 'assistant' as const : 'user' as const,
      content: turno.texto,
    }));
    this.solicitudesService.consultarWilliams(pregunta, historial).subscribe({
      next: (respuesta) => {
        this.enviando = false;
        if (!respuesta.success) return;
        this.turnos.push({ autor: 'william', texto: respuesta.data.answer, fecha: new Date(), sources: respuesta.data.sources });
        this.esperandoDecisionAsesor = respuesta.data.needsAdvisor;
        this.esperandoValoracion = !respuesta.data.needsAdvisor;
        setTimeout(() => this.bajarScroll(), 0);
      },
      error: (respuesta) => {
        this.enviando = false;
        this.errorChat = respuesta?.error?.mensaje ?? 'No fue posible consultar a Williams. Inténtalo de nuevo.';
      },
    });
    setTimeout(() => this.bajarScroll(), 0);
  }

  valorarAyuda(util: boolean): void {
    this.esperandoValoracion = false;
    if (util) {
      this.turnos.push({ autor: 'william', texto: 'Me alegra haber podido orientarte. ¿Necesitas ayuda con otro punto de tu solicitud?', fecha: new Date() });
    } else {
      this.esperandoDecisionAsesor = true;
      this.turnos.push({ autor: 'william', texto: 'Puedo intentar aclarar a qué documento o paso te refieres. Si el caso requiere revisar tu expediente, puedo pasar esta conversación al área responsable. ¿Quieres hablar con un asesor?', fecha: new Date() });
    }
    setTimeout(() => this.bajarScroll(), 0);
  }

  solicitarAsesor(): void {
    this.esperandoDecisionAsesor = false;
    if (!this.numeroGestion || this.derivando) return;
    const preguntas = this.turnos
      .filter((t) => t.autor === 'ciudadano')
      .slice(-6)
      .map((t) => t.texto.slice(0, 250));
    const orientaciones = this.turnos
      .filter((t) => t.autor === 'william')
      .slice(-5)
      .map((t) => t.texto.slice(0, 300));
    const contexto = [
      MARCADOR_DERIVACION,
      `Solicitud N.º ${this.numeroGestion}.`,
      `Estado actual: ${this.solicitud ? this.etiquetaEstado(this.solicitud.estado) : 'No disponible'}.`,
      `Preguntas del ciudadano: ${preguntas.join(' | ') || 'Solicita atención humana.'}`,
      `Orientación ofrecida por Williams: ${orientaciones.join(' | ') || 'No disponible.'}`,
      `Fuentes oficiales: ${[...new Set(this.turnos.flatMap((t) => t.sources || []).map((fuente) => fuente.url))].slice(-5).join(', ') || 'Sin enlaces consultados.'}`,
      `Información consultada: ficha de la solicitud y estado actual${this.solicitud ? ` (${this.etiquetaEstado(this.solicitud.estado)})` : ''}. Documentos y observaciones del revisor no disponibles en el sistema.`,
      'Motivo: Williams no pudo confirmar la respuesta o el ciudadano pidió atención humana.',
    ].join('\n').slice(0, 4800);

    this.derivando = true;
    this.solicitudesService.enviarMensaje(this.numeroGestion, contexto, this.tokenSeguimiento).subscribe({
      next: (respuesta) => {
        this.derivando = false;
        if (respuesta.success) {
          this.turnos.push({ autor: 'william', texto: 'Dejé tu solicitud de atención en la conversación de este trámite con el contexto disponible. El personal de SENPRENDE podrá verla al revisar el caso. No puedo confirmar desde aquí un área asignada ni un plazo de respuesta. Puedes continuar por este chat sin repetir tu pregunta.', fecha: new Date() });
          this.modoAsesor = true;
          this.cargar(true);
        }
      },
      error: (respuesta) => {
        this.derivando = false;
        this.errorChat = respuesta?.error?.mensaje ?? 'No fue posible marcar la conversación para atención.';
      },
    });
  }

  private etiquetaEstado(estado: SolicitudPublica['estado']): string {
    return estado === 'atendida' ? 'atendida' : 'en trámite';
  }

  private iniciar(): void {
    this.detener();
    this.mensajes = [];
    this.turnos = [];
    this.texto = '';
    this.solicitud = null;
    this.modoAsesor = false;
    this.chatMinimizado = false;
    if (!this.numeroGestion || (this.rol === 'ciudadano' && !this.tokenSeguimiento)) return;
    this.solicitud = this.solicitudVerificada;
    this.turnos.push({ autor: 'william', texto: 'Hola. Soy Williams, agente virtual de SENPRENDE. Puedo ayudarte con nuestros servicios, programas y plataformas para emprendedores. Para dudas sobre el estado o revisión de este expediente, te pondré en contacto con un asesor. ¿Qué necesitas saber?', fecha: new Date() });
    if (this.rol === 'gestor') {
      this.solicitudesService.obtener(this.numeroGestion).subscribe({ next: (r) => { if (r.success) this.solicitud = r.data; } });
    }
    this.cargar();
    this.intervalo = setInterval(() => this.cargar(), 5000);
  }

  private detener(): void {
    if (this.intervalo) clearInterval(this.intervalo);
    this.intervalo = null;
  }

  private cargar(forzarScroll = false): void {
    if (!this.numeroGestion) return;
    const eraVacio = this.mensajes.length === 0;
    this.cargando = eraVacio;
    this.solicitudesService.listarMensajes(this.numeroGestion, this.tokenSeguimiento).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        if (respuesta.success) {
          const anterior = this.mensajes.length;
          this.mensajes = respuesta.data;
          if (this.rol === 'ciudadano' && respuesta.data.some((mensaje) => mensaje.autor === 'ciudadano' && mensaje.texto.startsWith(MARCADOR_DERIVACION))) {
            this.modoAsesor = true;
          }
          if (forzarScroll || eraVacio || respuesta.data.length !== anterior) setTimeout(() => this.bajarScroll(), 0);
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
