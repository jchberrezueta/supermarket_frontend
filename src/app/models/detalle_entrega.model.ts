export enum EnumEstadoDetalleEntrega {
  COMPLETO = 'completo',
  INCOMPLETO = 'incompleto',
  NO_ENTREGADO = 'no_entregado',
}

export interface ILoteEntregaBorrador {
  fechaCaducidadLote: string;
  cantidadLote: number;
}

export interface IDetalleEntrega {
  ideDetaPedi: number;
  cantidadProd: number;
  lotesRecibidos: ILoteEntregaBorrador[];
}

export interface ILineaPedidoPendiente {
  ideDetaPedi: number;
  ideProd: number;
  nombreProd: string;
  cantidadSolicitada: number;
  cantidadRecibidaConfirmada: number;
  cantidadPendiente: number;
  precioUnitarioProd: number;
  subtotalProd: number;
  dctoCompraProd: number;
  ivaProd: number;
  totalProd: number;
  dctoCaducProd: number;
  estadoDetaPedi: string;
}

export interface IDetalleEntregaResult {
  ide_deta_entr: number;
  ide_entr: number;
  ide_deta_pedi: number;
  ide_prod: number;
  nombre_prod?: string | null;
  cantidad_prod: number;
  precio_unitario_prod: number;
  subtotal_prod: number;
  dcto_compra_prod: number;
  iva_prod: number;
  total_prod: number;
  dcto_caduc_prod: number;
  estado_deta_entr: EnumEstadoDetalleEntrega;
  cantidad_pedida?: number | null;
  estado_deta_pedi?: string | null;
  lotes_recibidos?: Array<{
    ide_deta_entr_lote: number;
    ide_deta_entr: number;
    ide_lote: number | null;
    fecha_caducidad_lote: string;
    cantidad_lote: number;
    estado_deta_entr_lote: string;
  }>;
}

export interface IResultDataDetalleEntrega {
  data: IDetalleEntregaResult[];
  response: string;
}
