import { IUsuario } from './usuarios.model';

export interface ILoginCredentials {
  usuario: string;
  clave: string;
}

export interface ILoginSuccessResponse {
  access_token: string;
  refresh_token: string;
  user: IUsuario;
}

export interface IPasswordChangeRequiredResponse {
  success: true;
  requiresPasswordChange: true;
  changeToken: string;
  usuario: string;
}

export interface IMfaRequiredResponse {
  success: true;
  requiresMfa: true;
  mfaToken: string;
}

export type IResultLogin =
  | ILoginSuccessResponse
  | IPasswordChangeRequiredResponse
  | IMfaRequiredResponse;

export interface IRefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface IApiMessageResponse {
  success: boolean;
  message?: string | string[];
}

export interface IMfaLoginRequest {
  mfaToken: string;
  codigo: string;
}

export interface IRequiredPasswordChangeRequest {
  changeToken: string;
  claveNueva: string;
}

export function isLoginSuccess(
  response: IResultLogin,
): response is ILoginSuccessResponse {
  return (
    'access_token' in response &&
    'refresh_token' in response &&
    'user' in response
  );
}

export function requiresPasswordChange(
  response: IResultLogin,
): response is IPasswordChangeRequiredResponse {
  return (
    'requiresPasswordChange' in response &&
    response.requiresPasswordChange === true
  );
}

export function requiresMfa(
  response: IResultLogin,
): response is IMfaRequiredResponse {
  return 'requiresMfa' in response && response.requiresMfa === true;
}
