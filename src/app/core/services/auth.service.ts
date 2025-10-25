import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from './rest.service';
import { IUsuario } from '@core/models/usuarios.model';
import { IRuta } from '@core/models/rutas.model';

interface ICredencial {
  usuario: string;
  clave: string;
  numIntentos: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _restService: RestService, private router: Router) {}

  login(credenciales: ICredencial) {
    return this._restService.post<any>('auth/login', credenciales);
  }

  saveSession(token: string, user: any) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): IUsuario | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasPermission(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta);
    return !!permisoRuta;
  }

  getUserPermisosRutas(): IRuta[] {
    const user = this.getUser();
    if (!user || !user.permisos) return [];
    return user.permisos;
  }

  getUserPerfil(): string | null {
    const user = this.getUser();
    if (!user) return null;
    return user.perfil;
  }

  canList(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.listar && p.activo);
    return !!permisoRuta;
  }

  canInsert(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.insertar && p.activo);
    return !!permisoRuta;
  }

  canUpdate(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.modificar && p.activo);
    return !!permisoRuta;
  }
  
  canDelete(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.eliminar && p.activo);
    return !!permisoRuta;
  }

  isActiveRuta(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.activo);
    return !!permisoRuta;
  }
}