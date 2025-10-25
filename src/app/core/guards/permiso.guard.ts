import { inject } from '@angular/core';
import {
  Router,
  CanMatchFn,
  UrlSegment
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const canMatchPermisoGuard: CanMatchFn  = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const loginState = authService.isAuthenticated();
  if (!loginState) {
    router.createUrlTree(['/login']);
    return false;
  }
  console.log('canMatchPermisoGuard');
  const nav = router.getCurrentNavigation();
  const allSegments = nav?.initialUrl.root.children['primary']?.segments ?? [];
  const faltantes = segments.map(s => s.path);
  if(route.path === 'list' && allSegments[allSegments.length-1].path != 'list'){
    allSegments.push(new UrlSegment(faltantes[0], {}));
  } 
  
  const rutaActual = '/' + allSegments
    .slice(0, allSegments.length - faltantes.length)
    .map(s => s.path)
    .join('/');
  if (route.path === 'list') return authService.canList(rutaActual);
  if (route.path === 'insert') return authService.canInsert(rutaActual);
  if (route.path === 'details/:id') return authService.canList(rutaActual);
  if (route.path === 'update/:id') return authService.canUpdate(rutaActual);

  return false;
};