import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsultaEstadoComponent } from '../components/consulta-estado/consulta-estado.component';

@Component({
  selector: 'app-seguimiento-page',
  standalone: true,
  imports: [RouterLink, ConsultaEstadoComponent],
  templateUrl: './seguimiento.page.html',
})
export class SeguimientoPageComponent {}
