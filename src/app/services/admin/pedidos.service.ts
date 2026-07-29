import { inject, Injectable } from '@angular/core';
import { IResultData, IResultDataCreate } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IPedidoCompleto, IResultDataPedido } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'pedidos';

  public listar(): Observable<IResultDataPedido> {
    return this._restService.get<IResultDataPedido>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataPedido> {
    return this._restService.get<IResultDataPedido>(
      `${this.apiUrl}/buscar/${id}`,
    );
  }

  public insertar(body: IPedidoCompleto): Observable<IResultDataCreate> {
    return this._restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar`,
      body,
    );
  }

  public actualizar(
    id: number,
    body: IPedidoCompleto,
  ): Observable<IResultDataCreate> {
    return this._restService.put<IResultDataCreate>(
      `${this.apiUrl}/actualizar/${id}`,
      body,
    );
  }

  public eliminar(id: number): Observable<IResultDataCreate> {
    return this._restService.delete<IResultDataCreate>(
      `${this.apiUrl}/eliminar/${id}`,
    );
  }

  public emitir(id: number): Observable<IResultDataCreate> {
    return this._restService.put<IResultDataCreate>(
      `${this.apiUrl}/emitir/${id}`,
      {},
    );
  }

  public cancelar(
    id: number,
    motivoCancelacion: string,
  ): Observable<IResultDataCreate> {
    return this._restService.put<IResultDataCreate>(
      `${this.apiUrl}/cancelar/${id}`,
      {
        motivoCancelacion,
      },
    );
  }

  public cerrarIncompleto(
    id: number,
    motivoCierre: string,
  ): Observable<IResultDataCreate> {
    return this._restService.put<IResultDataCreate>(
      `${this.apiUrl}/cerrar-incompleto/${id}`,
      {
        motivoCierre,
      },
    );
  }

  public listarDetallesPedido(idPedido: number): Observable<IResultData> {
    return this._restService.get<IResultData>(
      `${this.apiUrl}/listar/detalles/${idPedido}`,
    );
  }

  /**
   * COMBOS
   */
  public listarComboEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/estados`,
    );
  }
  public listarComboMotivos(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/motivos`,
    );
  }
  public listarComboPedidos(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/pedidos`,
    );
  }
}
