import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { ICategoria, IResultDataCategoria } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';
import { IResultDataCreate } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'categorias';

  public listar(): Observable<IResultDataCategoria> {
    return this._restService.get<IResultDataCategoria>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataCategoria> {
    return this._restService.get<IResultDataCategoria>(
      `${this.apiUrl}/buscar/${id}`,
    );
  }

  public insertar(
    body: Omit<ICategoria, 'ideCate'>,
  ): Observable<IResultDataCreate> {
    return this._restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar`,
      body,
    );
  }

  public actualizar(
    id: number,
    body: ICategoria,
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

  /**
   * COMBOS
   */

  public listarComboNombres(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/nombre`,
    );
  }
  public listarComboDescripcion(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/descripcion`,
    );
  }
  public listarComboCategorias(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/categorias`,
    );
  }
}
