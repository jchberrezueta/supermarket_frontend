import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { ICliente, IResultDataCliente } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
private readonly _restService = inject(RestService);
  private readonly apiUrl = 'clientes';

  public listar(): Observable<IResultDataCliente> {
    return this._restService.get<IResultDataCliente>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataCliente> {
    return this._restService.get<IResultDataCliente>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: ICliente) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: ICliente) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  
  /**
   * COMBOS
   */
  public listarComboClientes(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/clientes`);
  }
}