import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { RestService } from './rest.service';
import { IUsuario, IRuta, IOpcionSidebar, IResultLogin } from '@core/models';


interface ICredencial {
  usuario: string;
  clave: string;
  numIntentos: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _restService: RestService, private _router: Router) {}

  public login(credenciales: ICredencial): Observable<IResultLogin> {
    return this._restService.post<IResultLogin>('auth/login', credenciales);
  }

  public saveSession(token: string, user: IUsuario): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getUser(): IUsuario | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  public logout(): void {
    this.clearSession();
    this._router.navigate(['/login']);
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public hasPermission(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta);
    return !!permisoRuta;
  }

  public getUserPermisosRutas(): IRuta[] {
    const user = this.getUser();
    if (!user || !user.permisos) return [];
    return user.permisos;
  }

  public getUserPerfil(): string | null {
    const user = this.getUser();
    if (!user) return null;
    return user.perfil;
  }

  public canList(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.listar && p.activo);
    return !!permisoRuta;
  }

  public canInsert(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.insertar && p.activo);
    return !!permisoRuta;
  }

  public canUpdate(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.modificar && p.activo);
    return !!permisoRuta;
  }
  
  public canDelete(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.eliminar && p.activo);
    return !!permisoRuta;
  }

  public isActiveRuta(ruta: string): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;
    const permisoRuta = user.permisos.find((p: IRuta) => p.ruta === ruta && p.activo);
    return !!permisoRuta;
  }

  public getSidebarOptions(): IOpcionSidebar[] {
    const user = this.getUser();
    if(!user || !user.rutas_sidebar) return [];
    return user.rutas_sidebar;
  }
}