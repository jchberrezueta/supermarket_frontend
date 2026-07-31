export interface ISigFiltrosInventario {
  dias?: number;
  limite?: number;
  desde?: string;
  hasta?: string;
  tipo?: string;
}

export interface ISigInventarioResumen {
  productos: number;
  unidadesDisponibles: number;
  productosAgotados: number;
  productosStockBajo: number;
  lotesConStock: number;
  lotesProximosCaducar: number;
  lotesCaducados: number;
  diasEvaluadosCaducidad: number;
}

export type SigEstadoStockCritico = 'agotado' | 'stock_bajo';

export interface ISigProductoStockCritico {
  idProductoOrigen: number;
  idCategoriaOrigen: number;
  categoria: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  estado: SigEstadoStockCritico;
}

export interface ISigReporteStockCritico {
  items: ISigProductoStockCritico[];
  total: number;
  limite: number;
}

export type SigEstadoCaducidad = 'caducado' | 'proximo_caducar';

export interface ISigLoteCaducidad {
  idLoteOrigen: number;
  idProductoOrigen: number;
  producto: string;
  fechaCaducidad: string;
  diasRestantes: number;
  stock: number;
  estado: SigEstadoCaducidad;
}

export interface ISigReporteCaducidad {
  diasEvaluados: number;
  items: ISigLoteCaducidad[];
  total: number;
  limite: number;
}

export interface ISigPeriodoInventario {
  desde?: string;
  hasta?: string;
}

export interface ISigResumenMovimientosInventario {
  movimientos: number;
  entradas: number;
  salidas: number;
  unidadesEntrada: number;
  unidadesSalida: number;
  unidadesNetas: number;
}

export interface ISigMovimientoInventario {
  idMovimientoOrigen: number;
  idProductoOrigen: number;
  producto: string;
  idLoteOrigen?: number;
  tipo: string;
  cantidad: number;

  stockProductoAnterior?: number;
  stockProductoPosterior?: number;
  stockLoteAnterior?: number;
  stockLotePosterior?: number;

  documentoOrigen?: string;
  usuarioOrigen?: string;
  fechaMovimiento: string;
}

export interface ISigReporteMovimientosInventario {
  periodo: ISigPeriodoInventario;
  tipo?: string;
  resumen: ISigResumenMovimientosInventario;
  items: ISigMovimientoInventario[];
  total: number;
  limite: number;
}
