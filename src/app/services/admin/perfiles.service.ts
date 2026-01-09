import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IPerfil, IResultDataPerfil } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'perfiles';

  public listar(): Observable<IResultDataPerfil> {
    return this._restService.get<IResultDataPerfil>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataPerfil> {
    return this._restService.get<IResultDataPerfil>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IPerfil) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IPerfil) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  /**
     * JOINS
     */
    public listarPerfiles(): Observable<IResultData> {
      return this._restService.get<IResultData>(`${this.apiUrl}/listar/perfiles`);
    }
  
    /**
     * COMBOS
     */
    public listarComboPerfiles(): Observable<IComboBoxOption[]> {
      return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/perfiles`);
    }
    public listarComboNombres(): Observable<IComboBoxOption[]> {
      return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/nombres`);
    }
    public listarComboDescripcion(): Observable<IComboBoxOption[]> {
      return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/descripciones`);
    }
}
