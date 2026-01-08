import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IResultDataRol, IRol } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'roles';

  public listar(): Observable<IResultDataRol> {
    return this._restService.get<IResultDataRol>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataRol> {
    return this._restService.get<IResultDataRol>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IRol) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IRol) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  /**
   * COMBOS
   */
  public listarComboNombres(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/nombres`);
  }
  public listarComboDescripcion(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/descripcion`);
  }
}