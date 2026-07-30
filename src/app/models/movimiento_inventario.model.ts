export type TipoMovimientoInventario =
  | 'entrada_entrega'
  | 'salida_venta'
  | 'salida_devolucion_proveedor'
  | 'entrada_canje_caducidad'
  | 'anulacion_venta'
  | 'anulacion_entrega'
  | 'ajuste_entrada'
  | 'ajuste_salida'
  | 'correccion_lote';

export interface IMovimientoInventarioResult {
  ide_movi: number;
  fecha_ingre: string;
  ide_prod: number;
  nombre_prod: string;
  ide_lote: number | null;
  fecha_caducidad_lote: string | null;
  tipo_movi: TipoMovimientoInventario;
  tipo_movi_label: string;
  cantidad_movi: number;
  stock_prod_anterior: number | null;
  stock_prod_posterior: number | null;
  stock_prod_rango: string;
  stock_lote_anterior: number | null;
  stock_lote_posterior: number | null;
  stock_lote_rango: string;
  documento_origen: string;
  canal_origen: string;
  usua_ingre: string;
  observacion_movi: string | null;
}

export interface IResultDataMovimientoInventario {
  data: IMovimientoInventarioResult[];
  response: string;
}
