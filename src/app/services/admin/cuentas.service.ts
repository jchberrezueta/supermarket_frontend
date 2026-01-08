import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { ICuenta, IResultDataCuenta } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'cuentas';

  public listar(): Observable<IResultDataCuenta> {
    return this._restService.get<IResultDataCuenta>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataCuenta> {
    return this._restService.get<IResultDataCuenta>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: ICuenta) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: ICuenta) {
    return this._restService.post<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  /**
   * JOINS
   */
  public listarCuentas(): Observable<IResultData> {
    return this._restService.get<IResultData>(`${this.apiUrl}/listar/cuentas`);
  }

  /**
   * COMBOS
   */
  public listarComboCuentas(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/cuentas`);
  }
  public listarComboUsuarios(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/usuarios`);
  }
  public listarComboEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/estados`);
  }
}
