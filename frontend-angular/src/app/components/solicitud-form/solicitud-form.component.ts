import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RespuestaApi, Solicitud } from '../../models/solicitud.model';
import { SolicitudesService } from '../../services/solicitudes.service';
import { formatearNumeroGestion as formatearCodigo } from '../../utils/numero-gestion';

function longitudRecortada(minimo: number, maximo: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const longitud = typeof control.value === 'string' ? control.value.trim().length : 0;
    return longitud >= minimo && longitud <= maximo ? null : { longitudRecortada: true };
  };
}

@Component({
  selector: 'app-solicitud-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitud-form.component.html',
})
export class SolicitudFormComponent {
  /** Avisa al resto de la app (el listado) que hay una solicitud nueva. */
  @Output() creada = new EventEmitter<Solicitud>();

  enviando = false;
  errorGeneral: string | null = null;
  ultimoId: string | null = null;
  copiado = false;
  errorCopiado = false;

  formulario: FormGroup;

  constructor(private fb: FormBuilder, private solicitudesService: SolicitudesService) {
    this.formulario = this.fb.group({
      nombreSolicitante: ['', [Validators.required, longitudRecortada(3, 100)]],
      identidad: ['', [Validators.required, Validators.pattern(/^[0-9-]{8,20}$/)]],
      titulo: ['', [Validators.required, longitudRecortada(3, 100)]],
      descripcion: ['', [Validators.required, longitudRecortada(10, 500)]],
    });
  }

  /** true si el campo fue tocado y está inválido (para mostrar el bloque de error). */
  campoInvalido(nombre: string): boolean {
    const control = this.formulario.get(nombre);
    return !!control && control.touched && control.invalid;
  }

  /** true si el campo tiene específicamente ese tipo de error (required, minlength, maxlength). */
  tieneError(nombre: string, tipoError: string): boolean {
    const control = this.formulario.get(nombre);
    return !!control && control.hasError(tipoError);
  }

  async copiarNumero(): Promise<void> {
    if (!this.ultimoId) return;
    const codigo = this.formatearNumeroGestion(this.ultimoId);
    this.errorCopiado = false;

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(codigo);
      } else {
        // Alternativa para navegadores que no habilitan la API del portapapeles.
        const campoTemporal = document.createElement('textarea');
        campoTemporal.value = codigo;
        campoTemporal.setAttribute('readonly', '');
        campoTemporal.style.position = 'fixed';
        campoTemporal.style.opacity = '0';
        document.body.appendChild(campoTemporal);
        campoTemporal.select();
        const copiado = document.execCommand('copy');
        campoTemporal.remove();
        if (!copiado) throw new Error('El navegador no permitió copiar el código.');
      }

      this.copiado = true;
      setTimeout(() => (this.copiado = false), 2500);
    } catch {
      this.errorCopiado = true;
    }
  }

  enviar(): void {
    this.errorGeneral = null;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.ultimoId = null;
    const { nombreSolicitante, identidad, titulo, descripcion } = this.formulario.getRawValue();

    this.solicitudesService.crear({ nombreSolicitante, identidad, titulo, descripcion }).subscribe({
      next: (respuesta: RespuestaApi<Solicitud> & { numeroGestion?: string }) => {
        this.enviando = false;
        if (respuesta.success === false) {
          this.errorGeneral = respuesta.error.mensaje;
          return;
        }

        const datos = respuesta.data as Solicitud & { solicitud?: Solicitud; codigoGestion?: string };
        const solicitud = datos?.solicitud ?? datos;
        const numeroGestion = respuesta.numeroGestion || solicitud?.numeroGestion || datos?.codigoGestion;
        if (!numeroGestion) {
          this.errorGeneral = 'El servidor confirmó el registro, pero no entregó el número de gestión. No vuelvas a enviar esta solicitud; el equipo de atención debe recuperar el código del expediente.';
          return;
        }

        const solicitudConCodigo: Solicitud = { ...solicitud, numeroGestion };
        this.ultimoId = numeroGestion;
        this.copiado = false;
        this.errorCopiado = false;
        this.formulario.reset({ nombreSolicitante: '', identidad: '', titulo: '', descripcion: '' });
        this.creada.emit(solicitudConCodigo);
        setTimeout(() => document.getElementById('comprobante-solicitud')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      },
      error: (respuesta: any) => {
        this.enviando = false;
        // Distingue validación del backend (400 con detalles) de otras fallas.
        if (respuesta?.error?.detalles?.length) {
          this.errorGeneral = respuesta.error.detalles.map((d: any) => d.mensaje).join(' ');
        } else {
          this.errorGeneral = respuesta?.error?.mensaje ?? 'Ocurrió un error inesperado.';
        }
      },
    });
  }

  formatearNumeroGestion(numero: string): string {
    return formatearCodigo(numero);
  }
}
