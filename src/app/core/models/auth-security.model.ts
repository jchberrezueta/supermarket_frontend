export interface IMfaStatusResponse {
  success: boolean;
  habilitado: boolean;
}

export interface IMfaSetupResponse {
  success: boolean;
  message: string;
  qr: string;
  secreto: string;
}
