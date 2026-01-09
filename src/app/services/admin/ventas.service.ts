import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IDetalleVenta, IResultDataDetalleVenta, IResultDataVenta, IVenta } from '@models';
import { Observable } from 'rxjs';

// Interfaz para crear/actualizar venta con detalle
export interface IVentaConDetalle {
  cabeceraVenta: IVenta;
  detalleVenta: IDetalleVenta[];
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'ventas';

  public listar(): Observable<IResultDataVenta> {
    return this._restService.get<IResultDataVenta>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataVenta> {
    return this._restService.get<IResultDataVenta>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IVentaConDetalle) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IVentaConDetalle) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  public buscarDetallesVenta(ideVent: number): Observable<IResultDataDetalleVenta> {
    return this._restService.get<IResultDataDetalleVenta>(`${this.apiUrl}/detalles/${ideVent}`);
  }
}