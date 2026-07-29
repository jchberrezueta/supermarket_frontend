import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { Observable } from 'rxjs';

import { IComboBoxOption } from '@shared/models/combo_box_option';
import { IResultData, IResultDataCreate } from '@core/models';
import {
  IEmpresa,
  IEmpresaPrecios,
  IResultDataEmpresa,
  IResultDataEmpresaPrecios,
} from '@models';

@Injectable({
  providedIn: 'root',
})
export class EmpresasService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'empresas';

  public listar(): Observable<IResultDataEmpresa> {
    return this._restService.get<IResultDataEmpresa>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataEmpresa> {
    return this._restService.get<IResultDataEmpresa>(
      `${this.apiUrl}/buscar/${id}`,
    );
  }

  public buscarActiva(id: number): Observable<IResultDataEmpresa> {
    return this._restService.get<IResultDataEmpresa>(
      `${this.apiUrl}/buscar/activa/${id}`,
    );
  }

  public insertar(
    body: Omit<IEmpresa, 'ideEmp'>,
  ): Observable<IResultDataCreate> {
    return this._restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar`,
      body,
    );
  }

  public actualizar(id: number, body: IEmpresa): Observable<IResultDataCreate> {
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

  public listarEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/empresas/estados`,
    );
  }

  public listarComboEmpresas(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/empresas`,
    );
  }

  public listarComboEmpresasActivas(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/empresas/activas`,
    );
  }

  public listarComboResponsable(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/empresas/responsables`,
    );
  }

  /**
   * Empresas Precios
   */
  public listarPrecios(): Observable<IResultDataEmpresaPrecios> {
    return this._restService.get<IResultDataEmpresaPrecios>(
      `${this.apiUrl}/listar/precios`,
    );
  }

  public listarPreciosEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/precios/estados`,
    );
  }

  public listarPreciosProductosEmpresa(
    id: number,
  ): Observable<IResultDataEmpresaPrecios> {
    return this._restService.get<IResultDataEmpresaPrecios>(
      `${this.apiUrl}/listar/precios/${id}`,
    );
  }

  public insertarPrecio(
    body: Omit<IEmpresaPrecios, 'ideEmprProd'>,
  ): Observable<IResultDataCreate> {
    return this._restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar/precio`,
      body,
    );
  }

  public actualizarPrecio(
    id: number,
    body: IEmpresaPrecios,
  ): Observable<IResultDataCreate> {
    return this._restService.put<IResultDataCreate>(
      `${this.apiUrl}/actualizar/precio/${id}`,
      body,
    );
  }
}
