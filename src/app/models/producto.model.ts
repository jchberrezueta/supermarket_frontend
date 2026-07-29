export enum EnumEstadosProducto {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

export interface IProducto {
  ideProd: number;
  ideCate: number;
  ideMarc: number;
  codigoBarraProd: string;
  nombreProd: string;
  precioVentaProd: number;

  /**
   * Porcentaje.
   *
   * Ejemplo:
   * 15 = 15 %
   */
  ivaProd: number;

  /**
   * Descuento monetario por unidad.
   *
   * Ejemplo:
   * 0.50 = cincuenta centavos
   * de descuento por unidad.
   */
  dctoPromoProd: number;

  /**
   * Datos controlados por inventario.
   */
  stockProd: number;
  stockMinimoProd: number;
  disponibleProd: 'si' | 'no';

  estadoProd: EnumEstadosProducto;
  descripcionProd: string | null;
  urlImgProd: string | null;
}

export type ICreateProducto = Omit<
  IProducto,
  'ideProd' | 'stockProd' | 'disponibleProd'
>;

export type IUpdateProducto = Omit<IProducto, 'stockProd' | 'disponibleProd'>;

export interface IProductoResult {
  ide_prod: number;
  ide_cate: number;
  nombre_cate?: string;
  ide_marc: number;
  nombre_marc?: string;
  codigo_barra_prod: string;
  nombre_prod: string;
  precio_venta_prod: number;
  iva_prod: number;
  dcto_promo_prod: number;
  stock_prod: number;
  stock_minimo_prod: number;
  disponible_prod: 'si' | 'no';
  estado_prod: EnumEstadosProducto;
  descripcion_prod: string | null;
  url_img_prod: string | null;
}

export interface IResultDataProducto {
  data: IProductoResult[];
  response: string;
}

export interface IFiltroProducto {
  ideCate: string;
  ideMarc: string;
  codigoBarraProd: string;
  nombreProd: string;
  disponibleProd: string;
  estadoProd: EnumEstadosProducto | '';
}
