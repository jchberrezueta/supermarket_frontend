export enum EnumEstadosCuenta {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  BLOQUEADO = 'bloqueado',
}

export const ListEstadosCuenta = [
  {
    value: EnumEstadosCuenta.ACTIVO,
    label: 'Activo',
  },
  {
    value: EnumEstadosCuenta.INACTIVO,
    label: 'Inactivo',
  },
  {
    value: EnumEstadosCuenta.BLOQUEADO,
    label: 'Bloqueado',
  },
];

export interface ICreateCuenta {
  ideEmpl: number;
  idePerf: number;
  usuarioCuen: string;
  passwordCuen: string;
  estadoCuen: EnumEstadosCuenta;
}

export interface IUpdateCuenta {
  ideCuen: number;
  ideEmpl: number;
  idePerf: number;
  usuarioCuen: string;
  estadoCuen: EnumEstadosCuenta;
}

export interface ICuentaForm {
  ideCuen: number;
  ideEmpl: number;
  idePerf: number;
  usuarioCuen: string;
  passwordCuen: string;
  estadoCuen: EnumEstadosCuenta;
}

export interface ICuentaResult {
  ide_cuen: number;
  ide_empl: number;

  nombre_empleado?: string | null;

  ide_perf: number;

  nombre_perf?: string | null;

  usuario_cuen: string;

  estado_cuen: EnumEstadosCuenta;

  debe_cambiar_clave: boolean;

  intentos_fallidos?: number;

  bloqueado_hasta?: string | Date | null;

  ultimo_login?: string | Date | null;

  usua_ingre?: string | null;

  fecha_ingre?: string | Date | null;

  usua_actua?: string | null;

  fecha_actua?: string | Date | null;
}

export interface IResultDataCuenta {
  data: ICuentaResult[];
  response: string;
}

export interface IFiltroCuenta {
  ideEmpl: string;
  idePerf: string;
  nombrePerf: string;
  nombreCompletoEmpl: string;
  usuarioCuen: string;
  estadoCuen: EnumEstadosCuenta | '';
  debeCambiarClave?: boolean | '';
}
