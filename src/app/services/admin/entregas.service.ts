import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IEntregaCompleta, IPedidoEntregaDisponible, IPedidoEntregaPendiente, IResultDataEntrega } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntregasService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'entregas';

  public listar(): Observable<IResultDataEntrega> {
    return this._restService.get<IResultDataEntrega>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataEntrega> {
    return this._restService.get<IResultDataEntrega>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IEntregaCompleta) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IEntregaCompleta) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  public listarPedidosDisponibles(): Observable<{ data: IPedidoEntregaDisponible[] }> {
    return this._restService.get<{ data: IPedidoEntregaDisponible[] }>(`${this.apiUrl}/pedidos/disponibles`);
  }

  public obtenerPedidoPendiente(id: number): Observable<{ data: IPedidoEntregaPendiente[] }> {
    return this._restService.get<{ data: IPedidoEntregaPendiente[] }>(`${this.apiUrl}/pedidos/${id}/pendientes`);
  }

  public listarProveedoresEmpresa(idEmpresa: number): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/proveedores/empresa/${idEmpresa}`);
  }

  /**
   * COMBOS
   */
  public listarComboEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/estados`);
  }
}
