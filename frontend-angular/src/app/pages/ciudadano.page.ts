import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudFormComponent } from '../components/solicitud-form/solicitud-form.component';
import { DatosCiudadanoComponent, DatosCiudadano } from '../components/datos-ciudadano/datos-ciudadano.component';

@Component({
  selector: 'app-ciudadano-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SolicitudFormComponent, DatosCiudadanoComponent],
  templateUrl: './ciudadano.page.html',
})
export class CiudadanoPageComponent {
  datosCiudadano: DatosCiudadano | null = null;

  registrarDatos(datos: DatosCiudadano): void {
    this.datosCiudadano = datos;
  }
}
