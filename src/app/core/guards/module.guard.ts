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
    return router.createUrlTree(['/auth/login']);
    //return false;
  }

  const nav = router.getCurrentNavigation();
  const allSegments = nav?.initialUrl.root.children['primary']?.segments ?? [];
  const faltantes = segments.map(s => s.path);

  const rutaActual = '/' + allSegments
    .slice(0, allSegments.length - faltantes.length)
    .map(s => s.path)
    .join('/') + '/' + route.path;

  if(!rutaActual) return false;

  return authService.hasPermission(rutaActual);
};