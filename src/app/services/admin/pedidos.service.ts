import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IPedidoCompleto, IResultDataPedido } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'pedidos';

  public listar(): Observable<IResultDataPedido> {
    return this._restService.get<IResultDataPedido>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataPedido> {
    return this._restService.get<IResultDataPedido>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IPedidoCompleto) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IPedidoCompleto) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  public listarDetallesPedido(idPedido: number): Observable<IResultData> {
    return this._restService.get<IResultData>(`${this.apiUrl}/listar/detalles/${idPedido}`);
  }

  /**
   * COMBOS
   */
  public listarComboEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/estados`);
  }
  public listarComboMotivos(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/motivos`);
  }
}
