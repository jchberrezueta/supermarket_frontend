import { inject } from '@angular/core';
import {
  Router,
  CanMatchFn
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const canMatchModuleGuard: CanMatchFn  = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const loginState = authService.isAuthenticated();
  if (!loginState) {
    router.createUrlTree(['/login']);
    return false;
  }
  const rutaSolitada = route.path;
  if(!rutaSolitada) return false;
  return authService.hasPermission(rutaSolitada);
};