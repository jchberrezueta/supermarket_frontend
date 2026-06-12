import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { Observable } from 'rxjs';

export interface IProductoPos {
  ideProd: number;
  ideCate: number;
  ideMarc: number;
  codigoBarraProd: string;
  nombreProd: string;
  precioVentaProd: string | number;
  ivaProd: string | number;
  dctoPromoProd: string | number;
  stockProd: number;
  disponibleProd: 'si' | 'no';
  estadoProd: 'activo' | 'inactivo';
  descripcionProd: string;
  urlImgProd: string;
}

export interface IClientePos {
  ideClie: number;
  cedulaClie: string;
  fechaNacimientoClie: string | Date;
  edadClie: number;
  telefonoClie: string;
  primerNombreClie: string;
  segundoNombreClie?: string;
  apellidoPaternoClie: string;
  apellidoMaternoClie?: string;
  emailClie: string;
  esSocio: 'si' | 'no';
  esTerceraEdad: 'si' | 'no';
}

export interface IItemVentaPos {
  ideProd: number;
  cantidad: number;
}

export interface IConfirmarVentaPos {
  ideClie: number;
  ideEmpl?: number;
  tipoPagoVent?: 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'paypal';
  ideMetoPago?: number;
  items: IItemVentaPos[];
}

export interface IDetalleVentaPosResponse {
  ideProd: number;
  nombreProd: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  iva: number;
  descuento: number;
  total: number;
}

export interface IAlertaStockPos {
  ideProd: number;
  nombreProd: string;
  stockActual: number;
  mensaje: string;
}

export interface IVentaPosResponse {
  ideVent: number;
  numFacturaVent: string;
  cantidadVent: number;
  subtotalVent: number;
  ivaVent: number;
  descuentoVent: number;
  totalVent: number;
  detalles: IDetalleVentaPosResponse[];
  alertasStock: IAlertaStockPos[];
}

export interface ICancelarVentaPosResponse {
  ideVent: number;
  numFacturaVent: string;
  estadoVent: string;
  productosActualizados: Array<{
    ideProd: number;
    nombreProd: string;
    stockActual: number;
  }>;
}

export interface IApiResponse<T> {
  data: T;
  response: {
    success: boolean;
    message: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PosService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'ventas/pos';

  public buscarProductoPorCodigo(
    codigo: string,
  ): Observable<IApiResponse<IProductoPos>> {
    return this._restService.get<IApiResponse<IProductoPos>>(
      `${this.apiUrl}/producto/codigo/${codigo}`,
    );
  }

  public confirmarVenta(
    body: IConfirmarVentaPos,
  ): Observable<IApiResponse<IVentaPosResponse>> {
    return this._restService.post<IApiResponse<IVentaPosResponse>>(
      `${this.apiUrl}/confirmar`,
      body,
    );
  }

  public cancelarVenta(
    ideVent: number,
  ): Observable<IApiResponse<ICancelarVentaPosResponse>> {
    return this._restService.post<IApiResponse<ICancelarVentaPosResponse>>(
      `${this.apiUrl}/cancelar/${ideVent}`,
      {},
    );
  }

  public buscarClientePorCedula(
    cedula: string,
  ): Observable<IApiResponse<IClientePos>> {
    return this._restService.get<IApiResponse<IClientePos>>(
      `${this.apiUrl}/cliente/cedula/${cedula}`,
    );
  }
}
