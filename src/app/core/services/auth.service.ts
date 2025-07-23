

// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3001/api'; // Ajusta esto a tu API

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { usuario: string, clave: string }) {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials);
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


  // auth.service.ts
  getUserRoles(): string[] {
    const token = localStorage.getItem('access_token');
    if (!token) return [];
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.roles || [];
  }


}

