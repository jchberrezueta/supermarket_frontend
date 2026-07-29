import { inject, Injectable } from '@angular/core';

import { IResultDataCreate } from '@core/models';

import { RestService } from '@core/services/rest.service';

import { ICreateProducto, IResultDataProducto, IUpdateProducto } from '@models';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'productos';

  public listar(): Observable<IResultDataProducto> {
    return this._restService.get<IResultDataProducto>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataProducto> {
    return this._restService.get<IResultDataProducto>(
      `${this.apiUrl}/buscar/${id}`,
    );
  }

  public insertar(body: ICreateProducto): Observable<IResultDataCreate> {
    return this._restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar`,
      body,
    );
  }

  public actualizar(
    id: number,
    body: IUpdateProducto,
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
  public listarComboProductos(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/productos`,
    );
  }
  public listarComboProductosActivos(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/productos/activos`,
    );
  }
  public listarComboProductosActivosSinPrecioPorEmpresa(
    id: number,
  ): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/productos/activos/empresa/${id}`,
    );
  }
  public listarComboCodigoBarras(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/codigo/barras`,
    );
  }
  public listarComboEstados(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/estados`,
    );
  }
  public listarComboDisponibilidad(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/disponibilidad`,
    );
  }
}
