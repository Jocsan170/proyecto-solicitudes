import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { CiudadanoShellComponent } from './pages/ciudadano-shell.component';
import { CiudadanoPageComponent } from './pages/ciudadano.page';
import { SeguimientoPageComponent } from './pages/seguimiento.page';
import { GestionPageComponent } from './pages/gestion.page';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter([
      {
        path: '',
        component: CiudadanoShellComponent,
        children: [
          { path: '', component: CiudadanoPageComponent },
          { path: 'seguimiento', component: SeguimientoPageComponent },
        ],
      },
      { path: 'gestion', component: GestionPageComponent },
      { path: '**', redirectTo: '' },
    ]),
  ],
};
