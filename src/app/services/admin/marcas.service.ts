import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IMarca, IResultDataMarca } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';
import { IResultDataCreate } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class MarcasService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'marcas';

  public listar(): Observable<IResultDataMarca> {
    return this._restService.get<IResultDataMarca>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataMarca> {
    return this._restService.get<IResultDataMarca>(
      `${this.apiUrl}/buscar/${id}`,
    );
  }

  public insertar(
    body: Omit<IMarca, 'ideMarc'>,
  ): Observable<IResultDataCreate> {
    return this._restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar`,
      body,
    );
  }

  public actualizar(id: number, body: IMarca): Observable<IResultDataCreate> {
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

  public listarComboNombres(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/nombre`,
    );
  }
  public listarComboPais(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/pais`,
    );
  }
  public listarComboCalidad(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/calidad`,
    );
  }
  public listarComboMarcas(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/marcas`,
    );
  }
}
