import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface DatosCiudadano {
  nombreCompleto: string;
  identidad: string;
  ciudad: string;
}

/**
 * Paso previo al registro: pide datos básicos del ciudadano antes de
 * dejarlo continuar. Es solo una puerta de entrada de la interfaz —
 * estos datos se quedan en el navegador, no se envían al backend ni
 * se guardan en la solicitud (que sigue siendo anónima, como en el
 * resto del ejercicio).
 */
@Component({
  selector: 'app-datos-ciudadano',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-ciudadano.component.html',
})
export class DatosCiudadanoComponent {
  @Output() completado = new EventEmitter<DatosCiudadano>();

  nombreCompleto = '';
  identidad = '';
  ciudad = '';
  error: string | null = null;

  continuar(): void {
    const nombreCompleto = this.nombreCompleto.trim();
    const identidad = this.identidad.trim();
    const ciudad = this.ciudad.trim();

    if (nombreCompleto.length < 3) {
      this.error = 'Escribe tu nombre completo.';
      return;
    }
    if (identidad.length < 5) {
      this.error = 'Escribe tu número de identidad.';
      return;
    }
    if (!ciudad) {
      this.error = 'Escribe tu ciudad.';
      return;
    }

    this.error = null;
    this.completado.emit({ nombreCompleto, identidad, ciudad });
  }
}
