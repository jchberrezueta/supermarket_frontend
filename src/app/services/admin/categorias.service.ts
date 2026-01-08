import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { ICategoria, IResultDataCategoria } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
private readonly _restService = inject(RestService);
  private readonly apiUrl = 'categorias';

  public listar(): Observable<IResultDataCategoria> {
    return this._restService.get<IResultDataCategoria>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataCategoria> {
    return this._restService.get<IResultDataCategoria>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: ICategoria) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: ICategoria) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  /**
   * COMBOS
   */

  public listarComboNombres(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/nombre`);
  }
  public listarComboDescripcion(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/descripcion`);
  }
  public listarComboCategorias(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/categorias`);
  }
  
}