import { inject } from '@angular/core';
import {
  Router,
  CanMatchFn
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
  let rutaSolicitada, lastSegment;
  if(segments[segments.length-1].path != ':id') {
    rutaSolicitada = segments.slice(0, segments.length-1).toString();
    lastSegment = segments[segments.length-1]?.path;
  } else {
    rutaSolicitada = segments.slice(0, segments.length-2).toString();
    lastSegment = segments[segments.length-2]?.path;
  }

  if(lastSegment === 'list' || lastSegment === 'details') return authService.canList(rutaSolicitada);
  if(lastSegment === 'insert') return authService.canInsert(rutaSolicitada);
  if(lastSegment === 'update') return authService.canUpdate(rutaSolicitada);
  return false;
};