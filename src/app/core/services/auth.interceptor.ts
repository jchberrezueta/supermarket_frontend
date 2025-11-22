import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { AuthService } from './auth.service';

const getAuthService = () => {
  return inject(AuthService);
}

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const token = getAuthService().getToken();
  const user = getAuthService().getUser();

  let headers = req.headers;
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  if (user && user.perfil) {
    headers = headers.set('perfil', user.perfil);
  }
  const cloned = req.clone({ headers });
  return next(cloned);
}
