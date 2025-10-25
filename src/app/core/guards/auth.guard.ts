import { inject } from '@angular/core';
import {
  Router,
  CanMatchFn
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const canMatchAutgGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const loginState = authService.isAuthenticated();
  if (!loginState) {
    router.createUrlTree(['/login']);
  }
  return loginState;
};