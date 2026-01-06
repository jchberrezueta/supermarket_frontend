import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IPedidoCompleto, IResultDataPedido } from '@models';
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
    return this._restService.post<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}
