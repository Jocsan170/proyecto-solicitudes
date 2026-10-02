import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SolicitudFormComponent } from '../components/solicitud-form/solicitud-form.component';

@Component({
  selector: 'app-ciudadano-page',
  standalone: true,
  imports: [RouterLink, SolicitudFormComponent],
  templateUrl: './ciudadano.page.html',
})
export class CiudadanoPageComponent {}
