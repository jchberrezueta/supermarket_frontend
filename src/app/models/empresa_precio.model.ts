export interface IEmpresaPrecios {
  ideEmprProd: number;
  ideEmpr: number;
  ideProd: number;
  precioCompraProd: number;
  dctoCompraProd: number;
  dctoCaducidadProd: number;
  ivaProd: number;
  estadoEmprProd: 'activo' | 'inactivo';
}

export interface IEmpresaPreciosResult {
  ide_empr_prod: number;
  ide_empr: number;
  ide_prod: number;
  precio_compra_prod: number;
  dcto_compra_prod: number;
  dcto_caducidad_prod: number;
  iva_prod: number;
  nombre_prod?: string | null;
  estado_prod?: string | null;

  estado_empr_prod: 'activo' | 'inactivo';
}

export interface IResultDataEmpresaPrecios {
  data: IEmpresaPreciosResult[];
  response: string;
}

export interface IFiltroEmpresaPrecios {
  ideEmprProd: number;
  ideEmpr: number;
  ideProd: number;
  precioCompraProdMin: number;
  precioCompraProdMax: number;
  dctoCompraProdMin: number;
  dctoCompraProdMax: number;
}
