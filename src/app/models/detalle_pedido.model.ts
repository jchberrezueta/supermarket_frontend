export enum EnumEstadoDetallePedido {
  PENDIENTE = 'pendiente',
  PARCIAL = 'parcial',
  COMPLETO = 'completo',
  CERRADO_INCOMPLETO = 'cerrado_incompleto',
  CANCELADO = 'cancelado',
}

export interface IDetallePedido {
  ideDetaPedi: number;
  idePedi: number;
  ideProd: number;
  cantidadProd: number;
  precioUnitarioProd: number;
  subtotalProd: number;
  dctoCompraProd: number;
  ivaProd: number;
  totalProd: number;
  dctoCaducProd: number;
  estadoDetaPedi: EnumEstadoDetallePedido;
}

export interface ILoteDevolucionPedidoPayload {
  ideLote: number;
  cantidadDevolucion: number;
}

export interface ILoteDevolucionPedidoResult {
  ide_deta_pedi_lote_devo: number;

  ide_lote: number;

  fecha_caducidad_lote: string | null;

  stock_lote: number | null;

  cantidad_devolucion: number;

  cantidad_procesada: number;
}

export interface ILoteCaducadoDisponible {
  ide_lote: number;
  ide_prod: number;
  nombre_prod: string | null;
  fecha_caducidad_lote: string;
  stock_lote: number;
  estado_lote: string;
}

export interface IResultDataLotesCaducados {
  data: ILoteCaducadoDisponible[];
  response: string;
}

export interface IDetallePedidoResult {
  ide_deta_pedi: number;
  ide_pedi: number;
  ide_prod: number;
  nombre_prod?: string | null;
  cantidad_prod: number;
  precio_unitario_prod: number;
  subtotal_prod: number;
  dcto_compra_prod: number;
  iva_prod: number;
  total_prod: number;
  dcto_caduc_prod: number;
  estado_deta_pedi: EnumEstadoDetallePedido;
  lotes_devolucion?: ILoteDevolucionPedidoResult[];
}

export interface IResultDataDetallePedido {
  data: IDetallePedidoResult[];
  response: string;
}

export interface IFiltroDetallePedido {
  ideDetaPedi: number;
  idePedi: number;
  ideProd: number;
  cantidadProdMin: number;
  cantidadProdMax: number;
  precioUnitarioProdMin: number;
  precioUnitarioProdMax: number;
  subtotalProdMin: number;
  subtotalProdMax: number;
  estadoDetaPedi: EnumEstadoDetallePedido;
}
