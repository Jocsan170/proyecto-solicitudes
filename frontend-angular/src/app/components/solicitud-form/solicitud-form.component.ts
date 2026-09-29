import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Solicitud } from '../../models/solicitud.model';
import { SolicitudesService } from '../../services/solicitudes.service';

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
  mensajeExito: string | null = null;
  errorGeneral: string | null = null;
  ultimoId: string | null = null;
  copiado = false;

  private temporizadorToast: ReturnType<typeof setTimeout> | null = null;

  formulario: FormGroup;

  constructor(private fb: FormBuilder, private solicitudesService: SolicitudesService) {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      fecha: [new Date().toISOString().slice(0, 10), [Validators.required]],
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

  copiarNumero(): void {
    if (!this.ultimoId) return;
    navigator.clipboard
      ?.writeText(this.ultimoId)
      .then(() => {
        this.copiado = true;
        setTimeout(() => (this.copiado = false), 2000);
      })
      .catch(() => {
        /* si el navegador bloquea el portapapeles, el número ya está visible en el mensaje */
      });
  }

  private mostrarToast(): void {
    if (this.temporizadorToast) clearTimeout(this.temporizadorToast);
    this.temporizadorToast = setTimeout(() => {
      this.mensajeExito = null;
      this.errorGeneral = null;
    }, 7000);
  }

  enviar(): void {
    this.mensajeExito = null;
    this.errorGeneral = null;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando = true;
    const { titulo, descripcion, fecha } = this.formulario.getRawValue();

    this.solicitudesService.crear({ titulo, descripcion, fecha }).subscribe({
      next: (respuesta: any) => {
        this.enviando = false;
        if (respuesta.success) {
          this.ultimoId = respuesta.data.id;
          this.mensajeExito = 'Solicitud registrada correctamente.';
          this.formulario.reset({
            titulo: '',
            descripcion: '',
            fecha: new Date().toISOString().slice(0, 10),
          });
          this.creada.emit(respuesta.data);
          this.mostrarToast();
        }
      },
      error: (respuesta: any) => {
        this.enviando = false;
        // Distingue validación del backend (400 con detalles) de otras fallas.
        if (respuesta?.error?.detalles?.length) {
          this.errorGeneral = respuesta.error.detalles.map((d: any) => d.mensaje).join(' ');
        } else {
          this.errorGeneral = respuesta?.error?.mensaje ?? 'Ocurrió un error inesperado.';
        }
        this.mostrarToast();
      },
    });
  }
}
