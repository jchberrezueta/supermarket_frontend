import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IOpciones, IResultDataOpciones } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpcionesService {
private readonly _restService = inject(RestService);
  private readonly apiUrl = 'opciones';

  public listar(): Observable<IResultDataOpciones> {
    return this._restService.get<IResultDataOpciones>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataOpciones> {
    return this._restService.get<IResultDataOpciones>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IOpciones) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IOpciones) {
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
  public listarComboRutas(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/rutas`);
  }
  public listarComboEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/estados`);
  }

}
