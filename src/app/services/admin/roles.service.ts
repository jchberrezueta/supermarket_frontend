import { inject, Injectable } from '@angular/core';
import { IResultDataCreate } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IResultDataRol, IRol } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
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

  public insertar(body: Omit<IRol, 'ideRol'>): Observable<IResultDataCreate> {
    return this._restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar`,
      body,
    );
  }

  public actualizar(id: number, body: IRol): Observable<IResultDataCreate> {
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
  /**
   * COMBOS
   */
  public listarComboRoles(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/roles`,
    );
  }
  public listarComboNombres(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/nombres`,
    );
  }
  public listarComboDescripcion(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/descripcion`,
    );
  }
}
