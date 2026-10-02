import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SolicitudPublica } from '../../models/solicitud.model';
import { SolicitudesService } from '../../services/solicitudes.service';
import { ChatTramiteComponent } from '../chat-tramite/chat-tramite.component';
import { formatearNumeroGestion } from '../../utils/numero-gestion';

@Component({
  selector: 'app-consulta-estado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ChatTramiteComponent],
  templateUrl: './consulta-estado.component.html',
})
export class ConsultaEstadoComponent {
  numero = '';
  tokenSeguimiento = '';
  buscando = false;
  resultado: SolicitudPublica | null = null;
  noEncontrada = false;
  errorConsulta: string | null = null;
  codigoInvalido = false;
  yaConsulto = false;

  constructor(private solicitudesService: SolicitudesService) {}

  formatearCodigo(numero: string): string {
    return formatearNumeroGestion(numero);
  }

  consultar(): void {
    const numeroLimpio = this.numero.replace(/[-\s]/g, '').toUpperCase();
    if (!/^\d{12}$/.test(numeroLimpio) && !/^[A-F0-9]{16}$/.test(numeroLimpio)) {
      this.codigoInvalido = true;
      this.errorConsulta = 'Ingresa los 12 dígitos del comprobante entregado al registrar la solicitud.';
      return;
    }

    this.buscando = true;
    this.yaConsulto = true;
    this.resultado = null;
    this.tokenSeguimiento = '';
    this.noEncontrada = false;
    this.codigoInvalido = false;
    this.errorConsulta = null;

    this.solicitudesService.verificarSeguimiento(numeroLimpio).subscribe({
      next: (respuesta) => {
        this.buscando = false;
        if (respuesta.success) {
          this.resultado = respuesta.data.solicitud;
          this.tokenSeguimiento = respuesta.data.token;
        }
      },
      error: (respuesta) => {
        this.buscando = false;
        if (respuesta?.error?.codigo === 'NO_ENCONTRADA') {
          this.noEncontrada = true;
        } else {
          this.errorConsulta = respuesta?.error?.mensaje ?? 'No fue posible consultar la solicitud en este momento.';
        }
      },
    });
  }
}
