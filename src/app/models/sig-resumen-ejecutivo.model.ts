export interface ISigApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ISigConteosImportacion {
  categorias: number;
  empresas: number;
  proveedores: number;
  productos: number;
  clientes: number;
  ventas: number;
  detallesVenta: number;
  pedidos: number;
  entregas: number;
  lotes: number;
  movimientos: number;
}

export interface ISigUltimaSincronizacion {
  versionContrato: string;
  modo: string;
  fechaGeneracion: string;
  fechaImportacion: string;
  registros: ISigConteosImportacion;
}

export interface ISigResumenCanalVenta {
  transacciones: number;
  total: number;
}

export interface ISigResumenVentas {
  ventasCompletadas: number;
  ventasCanceladas: number;
  totalVentas: number;
  ticketPromedio: number;
  unidadesVendidas: number;
  pos: ISigResumenCanalVenta;
  movil: ISigResumenCanalVenta;
}

export interface ISigResumenInventario {
  productos: number;
  productosAgotados: number;
  productosStockBajo: number;
  lotesProximosCaducar: number;
  lotesCaducadosConStock: number;
  unidadesDisponibles: number;
}

export interface ISigResumenCalidad {
  alertasAbiertas: number;
  alertasReconocidas: number;
  incidentesActivos: number;
  incidentesCerrados: number;
  ultimaTemperatura?: number;
  estadoUltimaLectura?: string;
  fechaUltimaLectura?: string;
}

export type SigPrioridadRecomendacion =
  | 'critica'
  | 'alta'
  | 'media'
  | 'baja'
  | 'informativa';

export interface ISigRecomendacion {
  codigo: string;
  modulo: string;
  prioridad: SigPrioridadRecomendacion;
  titulo: string;
  mensaje: string;
}

export interface ISigResumenEjecutivo {
  tieneDatosERP: boolean;
  ultimaSincronizacion?: ISigUltimaSincronizacion;
  ventas: ISigResumenVentas;
  inventario: ISigResumenInventario;
  calidad: ISigResumenCalidad;
  recomendaciones: ISigRecomendacion[];
  fechaActualizacion: string;
}
