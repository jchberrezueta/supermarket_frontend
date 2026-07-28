import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { AuthService } from './auth.service';

let refreshing = false;

const refreshedToken$ = new BehaviorSubject<string | null>(null);

function addToken(
  request: HttpRequest<unknown>,
  token: string,
): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function isPublicAuthRequest(url: string): boolean {
  const publicEndpoints = [
    'auth/login',
    'auth/refresh',
    'auth/forgot-password',
    'auth/reset-password',
    'auth/cambiar-clave-obligatoria',
    'auth/mfa/verificar-login',
  ];

  return publicEndpoints.some((endpoint) => url.includes(endpoint));
}

export const AuthInterceptor: HttpInterceptorFn = (initialRequest, next) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const accessToken = authService.getToken();

  const publicRequest = isPublicAuthRequest(initialRequest.url);

  const request =
    accessToken && !publicRequest
      ? addToken(initialRequest, accessToken)
      : initialRequest;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const refreshToken = authService.getRefreshToken();

      if (error.status !== 401 || publicRequest || !refreshToken) {
        return throwError(() => error);
      }

      if (!refreshing) {
        refreshing = true;

        refreshedToken$.next(null);

        return authService.refreshSession().pipe(
          switchMap((response) => {
            refreshedToken$.next(response.access_token);

            return next(addToken(initialRequest, response.access_token));
          }),

          catchError((refreshError: HttpErrorResponse) => {
            authService.clearSession();

            void router.navigate(['/auth/login'], {
              replaceUrl: true,
            });

            return throwError(() => refreshError);
          }),

          finalize(() => {
            refreshing = false;
          }),
        );
      }

      return refreshedToken$.pipe(
        filter((token): token is string => Boolean(token)),

        take(1),

        switchMap((token) => next(addToken(initialRequest, token))),
      );
    }),
  );
};
