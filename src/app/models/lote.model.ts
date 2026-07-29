export type EstadoLote = 'correcto' | 'proximo' | 'caducado' | 'devuelto';

export interface ILoteResult {
  ide_lote: number;
  ide_prod: number;

  nombre_prod: string | null;

  fecha_caducidad_lote: string;
  stock_lote: number;
  estado_lote: EstadoLote;
}

export interface IResultDataLote {
  data: ILoteResult[];
  response: string;
}

export interface IFiltroLote {
  ideProd: number | '';

  estadoLote: EstadoLote | '';

  fechaCaducidadDesde: string;
  fechaCaducidadHasta: string;
}
