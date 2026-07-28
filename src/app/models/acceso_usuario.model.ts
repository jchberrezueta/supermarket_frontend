export type ResultadoAcceso = 'exitoso' | 'fallido';

export const ListResultadosAcceso = [
  {
    value: 'exitoso',
    label: 'Exitoso',
  },
  {
    value: 'fallido',
    label: 'Fallido',
  },
];

export interface IAccesoUsuarioResult {
  ide_acce: number;

  ide_cuen: number | null;

  usuario_intentado: string | null;

  usuario_cuen: string | null;

  estado_cuen: string | null;

  resultado_acce: ResultadoAcceso;

  motivo_acce: string | null;

  navegador_acce: string;
  fecha_acce: string;
  num_int_fall_acce: number;

  ip_acce: string | null;

  latitud_acce: number | null;

  longitud_acce: number | null;
}

export interface IResultDataAccesoUsuario {
  data: IAccesoUsuarioResult[];
  response: string;
}

export interface IFiltroAccesoUsuario {
  ideCuen: string;
  usuarioCuen: string;
  ipAcce: string;
  navegadorAcce: string;

  resultadoAcce: ResultadoAcceso | '';

  fechaAcceDesde: string;
  fechaAcceHasta: string;
}
