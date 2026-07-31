import { ISigResumenVentas } from './sig-resumen-ejecutivo.model';

export interface ISigPeriodoVentas {
  desde?: string;
  hasta?: string;
}

export interface ISigFiltrosVentas extends ISigPeriodoVentas {
  limite?: number;
}

export interface ISigResumenVentasPeriodo {
  periodo: ISigPeriodoVentas;
  indicadores: ISigResumenVentas;
}

export interface ISigPuntoTendenciaVentas {
  fecha: string;
  transacciones: number;
  total: number;
  unidades: number;
}

export interface ISigTendenciaVentas {
  periodo: ISigPeriodoVentas;
  items: ISigPuntoTendenciaVentas[];
  total: number;
}

export interface ISigProductoVendido {
  idProductoOrigen: number;
  nombre: string;
  unidadesVendidas: number;
  ingresos: number;
}

export interface ISigRankingProductos {
  periodo: ISigPeriodoVentas;
  items: ISigProductoVendido[];
  total: number;
  limite: number;
}

export interface ISigCategoriaVendida {
  idCategoriaOrigen: number;
  nombre: string;
  unidadesVendidas: number;
  ingresos: number;
}

export interface ISigRankingCategorias {
  periodo: ISigPeriodoVentas;
  items: ISigCategoriaVendida[];
  total: number;
  limite: number;
}
