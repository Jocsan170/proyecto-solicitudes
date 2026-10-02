import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { obtenerUrlPortalPublico } from '../services/portal-publico-url';

@Component({
  selector: 'app-ciudadano-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './ciudadano-shell.component.html',
})
export class CiudadanoShellComponent {
  readonly portalPublicoUrl = obtenerUrlPortalPublico();
  menuAbierto = false;
}
