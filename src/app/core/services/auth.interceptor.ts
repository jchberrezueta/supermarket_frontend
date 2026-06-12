import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

const getAuthService = () => {
  return inject(AuthService);
};

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getAuthService().getToken();

  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const cloned = req.clone({ headers });

  return next(cloned);
};
