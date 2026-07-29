import { inject, Injectable } from '@angular/core';

import { RestService } from '@core/services/rest.service';

import { IResultDataLote } from '@models';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LotesService {
  private readonly restService = inject(RestService);

  private readonly apiUrl = 'lotes';

  public listar(): Observable<IResultDataLote> {
    return this.restService.get<IResultDataLote>(this.apiUrl);
  }

  public buscar(id: number): Observable<IResultDataLote> {
    return this.restService.get<IResultDataLote>(`${this.apiUrl}/buscar/${id}`);
  }

  public listarComboProductos(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/productos`,
    );
  }

  public listarComboEstados(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/estados`,
    );
  }
}
