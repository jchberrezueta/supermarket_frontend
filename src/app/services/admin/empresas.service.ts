import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { Observable } from 'rxjs';

import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IResultData } from '@core/models';
import { IEmpresa, IEmpresaPrecios, IResultDataEmpresa, IResultDataEmpresaPrecios } from '@models';

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

  public insertar(body: IEmpresa) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IEmpresa) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }

  public listarEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/estados`);
  }

  /**
   * Empresas Precios
   */
  public listarPrecios(): Observable<IResultDataEmpresaPrecios> {
    return this._restService.get<IResultDataEmpresaPrecios>(`${this.apiUrl}/listar/precios`);
  }

  public listarPreciosProductosEmpresa(id: number): Observable<any> {
    return this._restService.get<any>(`${this.apiUrl}/listar/precios/${id}`);
  }

  public insertarPrecio(body: IEmpresaPrecios) {
    return this._restService.post<any>(`${this.apiUrl}/insertar/precio`, body);
  }

  public actualizarPrecio(id: number, body: IEmpresaPrecios) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/precio/${id}`, body);
  }
}