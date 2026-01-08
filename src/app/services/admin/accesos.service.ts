import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IResultDataAccesoUsuario } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesosService {
private readonly _restService = inject(RestService);
  private readonly apiUrl = 'accesos';

  public listar(): Observable<IResultDataAccesoUsuario> {
    return this._restService.get<IResultDataAccesoUsuario>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataAccesoUsuario> {
    return this._restService.get<IResultDataAccesoUsuario>(`${this.apiUrl}/buscar/${id}`);
  }

  /**
   * JOINS
   */
  public listarAccesosUsuarios(): Observable<IResultData> {
    return this._restService.get<IResultData>(`${this.apiUrl}/listar/accesos`);
  }
  

  /**
   * COMBOS
   */
  public listarComboIps(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/ips`);
  }
  public listarComboNavegador(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/navegador`);
  }


}