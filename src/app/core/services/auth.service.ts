import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, tap } from 'rxjs';

import {
  IApiMessageResponse,
  ILoginCredentials,
  ILoginSuccessResponse,
  IMfaLoginRequest,
  IOpcionSidebar,
  IRefreshTokenResponse,
  IRequiredPasswordChangeRequest,
  IResultLogin,
  IRuta,
  IUsuario,
  IMfaSetupResponse,
  IMfaStatusResponse,
} from '@core/models';

import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';

  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private readonly USER_KEY = 'user';

  private readonly MFA_TOKEN_KEY = 'pending_mfa_token';

  private readonly CHANGE_TOKEN_KEY = 'pending_change_token';

  private readonly CHANGE_USER_KEY = 'pending_change_user';

  constructor(
    private readonly restService: RestService,

    private readonly router: Router,
  ) {}

  public login(credentials: ILoginCredentials): Observable<IResultLogin> {
    return this.restService.post<IResultLogin>('auth/login', credentials);
  }

  public verificarMfaLogin(
    body: IMfaLoginRequest,
  ): Observable<ILoginSuccessResponse> {
    return this.restService.post<ILoginSuccessResponse>(
      'auth/mfa/verificar-login',
      body,
    );
  }

  public cambiarClaveObligatoria(
    body: IRequiredPasswordChangeRequest,
  ): Observable<IApiMessageResponse> {
    return this.restService.post<IApiMessageResponse>(
      'auth/cambiar-clave-obligatoria',
      body,
    );
  }

  public cambiarClave(
    claveActual: string,
    claveNueva: string,
  ): Observable<IApiMessageResponse> {
    return this.restService.post<IApiMessageResponse>('auth/cambiar-clave', {
      claveActual,
      claveNueva,
    });
  }

  public solicitarRecuperacion(
    usuario: string,
  ): Observable<IApiMessageResponse> {
    return this.restService.post<IApiMessageResponse>('auth/forgot-password', {
      usuario: usuario.trim().toLowerCase(),
    });
  }

  public restablecerPassword(
    token: string,
    nuevaClave: string,
  ): Observable<IApiMessageResponse> {
    return this.restService.post<IApiMessageResponse>('auth/reset-password', {
      token: token.trim(),
      nuevaClave,
    });
  }

  public refreshSession(): Observable<IRefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();

    return this.restService
      .post<IRefreshTokenResponse>('auth/refresh', {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access_token);

          localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
        }),
      );
  }

  public saveSession(response: ILoginSuccessResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, response.access_token);

    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);

    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    this.clearPendingAuthentication();
  }

  public getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public getUser(): IUsuario | null {
    const rawUser = localStorage.getItem(this.USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as IUsuario;
    } catch {
      this.clearSession();
      return null;
    }
  }

  public savePendingMfaToken(mfaToken: string): void {
    sessionStorage.setItem(this.MFA_TOKEN_KEY, mfaToken);
  }

  public getPendingMfaToken(): string | null {
    return sessionStorage.getItem(this.MFA_TOKEN_KEY);
  }

  public clearPendingMfaToken(): void {
    sessionStorage.removeItem(this.MFA_TOKEN_KEY);
  }

  public savePendingPasswordChange(changeToken: string, usuario: string): void {
    sessionStorage.setItem(this.CHANGE_TOKEN_KEY, changeToken);

    sessionStorage.setItem(this.CHANGE_USER_KEY, usuario);
  }

  public getPendingChangeToken(): string | null {
    return sessionStorage.getItem(this.CHANGE_TOKEN_KEY);
  }

  public getPendingChangeUser(): string | null {
    return sessionStorage.getItem(this.CHANGE_USER_KEY);
  }

  public clearPendingPasswordChange(): void {
    sessionStorage.removeItem(this.CHANGE_TOKEN_KEY);

    sessionStorage.removeItem(this.CHANGE_USER_KEY);
  }

  public logout(): void {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.finishLogout();
      return;
    }

    this.restService
      .post<IApiMessageResponse>('auth/logout', {
        refreshToken,
      })
      .pipe(finalize(() => this.finishLogout()))
      .subscribe({
        error: () => undefined,
      });
  }

  public logoutAll(): Observable<IApiMessageResponse> {
    return this.restService
      .post<IApiMessageResponse>('auth/logout-all', {})
      .pipe(finalize(() => this.finishLogout()));
  }

  public clearSession(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);

    localStorage.removeItem(this.REFRESH_TOKEN_KEY);

    localStorage.removeItem(this.USER_KEY);

    this.clearPendingAuthentication();
  }

  public isAuthenticated(): boolean {
    return Boolean(
      this.getUser() && (this.getToken() || this.getRefreshToken()),
    );
  }

  public hasPermission(ruta: string): boolean {
    const user = this.getUser();

    if (!user?.permisos) {
      return false;
    }

    return user.permisos.some(
      (permission) => permission.ruta === ruta && permission.activo,
    );
  }

  public getUserPermisosRutas(): IRuta[] {
    return this.getUser()?.permisos ?? [];
  }

  public getUserPerfil(): string | null {
    return this.getUser()?.perfil ?? null;
  }

  public canAll(ruta: string): boolean {
    return (
      this.canList(ruta) &&
      this.canInsert(ruta) &&
      this.canUpdate(ruta) &&
      this.canDelete(ruta)
    );
  }

  public canList(ruta: string): boolean {
    return this.hasActionPermission(ruta, 'listar');
  }

  public canInsert(ruta: string): boolean {
    return this.hasActionPermission(ruta, 'insertar');
  }

  public canUpdate(ruta: string): boolean {
    return this.hasActionPermission(ruta, 'modificar');
  }

  public canDelete(ruta: string): boolean {
    return this.hasActionPermission(ruta, 'eliminar');
  }

  public isActiveRuta(ruta: string): boolean {
    const permission = this.findPermission(ruta);

    return Boolean(permission?.activo);
  }

  public getSidebarOptions(): IOpcionSidebar[] {
    return this.getUser()?.rutas_sidebar ?? [];
  }

  private findPermission(ruta: string): IRuta | undefined {
    return this.getUser()?.permisos?.find(
      (permission) => permission.ruta === ruta,
    );
  }

  private hasActionPermission(
    ruta: string,
    action: 'listar' | 'insertar' | 'modificar' | 'eliminar',
  ): boolean {
    const permission = this.findPermission(ruta);

    return Boolean(permission?.activo && permission[action]);
  }

  private clearPendingAuthentication(): void {
    this.clearPendingMfaToken();
    this.clearPendingPasswordChange();
  }

  private finishLogout(): void {
    this.clearSession();

    void this.router.navigate(['/auth/login'], {
      replaceUrl: true,
    });
  }

  public obtenerEstadoMfa(): Observable<IMfaStatusResponse> {
    return this.restService.get<IMfaStatusResponse>('auth/mfa/estado');
  }

  public generarMfa(claveActual: string): Observable<IMfaSetupResponse> {
    return this.restService.post<IMfaSetupResponse>('auth/mfa/generar', {
      claveActual,
    });
  }

  public activarMfa(codigo: string): Observable<IApiMessageResponse> {
    return this.restService.post<IApiMessageResponse>('auth/mfa/activar', {
      codigo,
    });
  }

  public desactivarMfa(
    claveActual: string,
    codigo: string,
  ): Observable<IApiMessageResponse> {
    return this.restService.post<IApiMessageResponse>('auth/mfa/desactivar', {
      claveActual,
      codigo,
    });
  }
}
