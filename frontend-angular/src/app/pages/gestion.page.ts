import { Component } from '@angular/core';
import { MesaTrabajoComponent } from '../components/mesa-trabajo/mesa-trabajo.component';

@Component({
  selector: 'app-gestion-page',
  standalone: true,
  imports: [MesaTrabajoComponent],
  template: '<app-mesa-trabajo></app-mesa-trabajo>',
})
export class GestionPageComponent {}
