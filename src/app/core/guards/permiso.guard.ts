import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisoGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = JSON.parse(userData);
    const permisos = user.permisos || [];

    // Ruta solicitada
    const rutaSolicitada = state.url;

    // ¿Tiene permiso para acceder?
    const tienePermiso = permisos.some(
      (p: any) => p.ruta === rutaSolicitada && p.listar && p.activo
    );

    if (!tienePermiso) {
      this.router.navigate(['/no-autorizado']); // o donde prefieras
      return false;
    }

    return true;
  }
}
