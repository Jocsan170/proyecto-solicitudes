import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Solicitud } from '../../models/solicitud.model';
import { SolicitudesService } from '../../services/solicitudes.service';
import { ChatTramiteComponent } from '../chat-tramite/chat-tramite.component';

@Component({
  selector: 'app-consulta-estado',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatTramiteComponent],
  templateUrl: './consulta-estado.component.html',
})
export class ConsultaEstadoComponent implements OnInit, OnChanges {
  @Input() numeroInicial: string | null = null;

  numero = '';
  buscando = false;
  resultado: Solicitud | null = null;
  noEncontrada = false;
  errorConsulta: string | null = null;
  yaConsulto = false;

  constructor(
    private solicitudesService: SolicitudesService,
    private ruta: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ruta.queryParamMap.subscribe((params) => {
      const numero = params.get('numero');
      if (numero) {
        this.numero = numero;
        this.consultar();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['numeroInicial'] && this.numeroInicial) {
      this.numero = this.numeroInicial;
      this.consultar();
    }
  }

  consultar(): void {
    const numeroLimpio = this.numero.trim();
    if (!numeroLimpio) return;

    this.buscando = true;
    this.yaConsulto = true;
    this.resultado = null;
    this.noEncontrada = false;
    this.errorConsulta = null;

    this.solicitudesService.obtener(numeroLimpio).subscribe({
      next: (respuesta) => {
        this.buscando = false;
        if (respuesta.success) {
          this.resultado = respuesta.data;
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
