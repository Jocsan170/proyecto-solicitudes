import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import localeEsHN from '@angular/common/locales/es-HN';

registerLocaleData(localeEsHN);
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
