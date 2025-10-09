import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from './rest.service';

interface ICredencial {
  usuario: string;
  clave: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private restService: RestService, private router: Router) {}

  login(credenciales: ICredencial) {
    return this.restService.post<any>('auth/login', credenciales);
  }

  saveSession(token: string, user: any) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasPermission(ruta: string, permiso: keyof any): boolean {
    const user = this.getUser();
    if (!user || !user.permisos) return false;

    const permisoRuta = user.permisos.find((p: any) => p.ruta === ruta);
    return permisoRuta ? permisoRuta[permiso] === true && permisoRuta.activo === true : false;
  }

  getUserRoles(): string[] {
    const token = localStorage.getItem('access_token');
    if (!token) return [];
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles || [];
  }


}