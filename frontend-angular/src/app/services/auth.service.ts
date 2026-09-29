import { Injectable } from '@angular/core';

/**
 * Sesión del gestor. Es una simulación (credenciales fijas) — no hay un
 * servidor de autenticación real detrás. Se guarda en sessionStorage
 * para que sobreviva al recargar la mesa de trabajo.
 *
 * Credenciales de entrenamiento (ver README): admin / senprende2026
 */
const USUARIO_DEMO = 'admin';
const CONTRASENA_DEMO = 'senprende2026';
const TOKEN_GESTOR = 'TOKEN_GESTOR_DEMO';
const CLAVE_SESION = 'senprende-gestor-sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private autenticado = false;

  constructor() {
    this.autenticado = sessionStorage.getItem(CLAVE_SESION) === '1';
  }

  iniciarSesion(usuario: string, contrasena: string): boolean {
    if (usuario === USUARIO_DEMO && contrasena === CONTRASENA_DEMO) {
      this.autenticado = true;
      sessionStorage.setItem(CLAVE_SESION, '1');
      return true;
    }
    return false;
  }

  cerrarSesion(): void {
    this.autenticado = false;
    sessionStorage.removeItem(CLAVE_SESION);
  }

  estaAutenticado(): boolean {
    return this.autenticado;
  }

  obtenerEncabezadoAutorizacion(): Record<string, string> {
    return this.autenticado ? { Authorization: `Bearer ${TOKEN_GESTOR}` } : {};
  }
}
