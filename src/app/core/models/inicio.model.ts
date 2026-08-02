export interface IInicioUsuario {
  ideCuen: number;
  ideEmpl: number;
  usuario: string;
  nombreEmpleado: string;
  perfil: string;
  estado: string;
}

export interface IInicioAcceso {
  ideAcce: number;
  fecha: string;
  navegador: string;
  ip: string | null;
  latitud: number | null;
  longitud: number | null;
}

export interface IInicioResponse {
  usuario: IInicioUsuario;
  accesoActual: IInicioAcceso | null;
  accesoAnterior: IInicioAcceso | null;
  primerIngreso: boolean;
}
