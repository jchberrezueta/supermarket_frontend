import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { Observable } from 'rxjs';

import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IResultData } from '@core/models';
import { IEmpresa, IResultDataEmpresa } from '@models';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'empresas';

  public listar(): Observable<IResultDataEmpresa> {
    return this._restService.get<IResultDataEmpresa>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataEmpresa> {
    return this._restService.get<IResultDataEmpresa>(`${this.apiUrl}/buscar/${id}`);
  }

  public listarEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/estados`);
  }

  public insertar(body: IEmpresa) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IEmpresa) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}