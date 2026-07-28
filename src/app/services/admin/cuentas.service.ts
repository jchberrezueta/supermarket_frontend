import { inject, Injectable } from '@angular/core';

import { IResultData, IResultDataCreate } from '@core/models';

import { RestService } from '@core/services/rest.service';

import { ICreateCuenta, IResultDataCuenta, IUpdateCuenta } from '@models';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CuentasService {
  private readonly restService = inject(RestService);

  private readonly apiUrl = 'cuentas';

  public listar(): Observable<IResultDataCuenta> {
    return this.restService.get<IResultDataCuenta>(this.apiUrl);
  }

  public buscar(id: number): Observable<IResultDataCuenta> {
    return this.restService.get<IResultDataCuenta>(
      `${this.apiUrl}/buscar/${id}`,
    );
  }

  public insertar(body: ICreateCuenta): Observable<IResultDataCreate> {
    return this.restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar`,
      body,
    );
  }

  public actualizar(
    id: number,
    body: IUpdateCuenta,
  ): Observable<IResultDataCreate> {
    return this.restService.put<IResultDataCreate>(
      `${this.apiUrl}/actualizar/${id}`,
      body,
    );
  }

  public restablecerClave(
    id: number,
    claveTemporal: string,
  ): Observable<IResultDataCreate> {
    return this.restService.post<IResultDataCreate>(
      `${this.apiUrl}/${id}/restablecer-clave`,
      {
        claveTemporal,
      },
    );
  }

  public eliminar(id: number): Observable<IResultDataCreate> {
    return this.restService.delete<IResultDataCreate>(
      `${this.apiUrl}/eliminar/${id}`,
    );
  }

  public listarCuentas(): Observable<IResultData> {
    return this.restService.get<IResultData>(`${this.apiUrl}/listar/cuentas`);
  }

  public listarComboCuentas(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/cuentas`,
    );
  }

  public listarComboUsuarios(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/usuarios`,
    );
  }

  public listarComboEstados(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/estados`,
    );
  }
}
