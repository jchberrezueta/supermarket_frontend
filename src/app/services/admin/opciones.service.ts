import { inject, Injectable } from '@angular/core';

import { IResultDataCreate } from '@core/models';

import { RestService } from '@core/services/rest.service';

import { ICreateOpcion, IResultDataOpciones, IUpdateOpcion } from '@models';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpcionesService {
  private readonly restService = inject(RestService);

  private readonly apiUrl = 'opciones';

  public listar(): Observable<IResultDataOpciones> {
    return this.restService.get<IResultDataOpciones>(this.apiUrl);
  }

  public buscar(id: number): Observable<IResultDataOpciones> {
    return this.restService.get<IResultDataOpciones>(
      `${this.apiUrl}/buscar/${id}`,
    );
  }

  public insertar(body: ICreateOpcion): Observable<IResultDataCreate> {
    return this.restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar`,
      body,
    );
  }

  public actualizar(
    id: number,
    body: IUpdateOpcion,
  ): Observable<IResultDataCreate> {
    return this.restService.put<IResultDataCreate>(
      `${this.apiUrl}/actualizar/${id}`,
      body,
    );
  }

  public eliminar(id: number): Observable<IResultDataCreate> {
    return this.restService.delete<IResultDataCreate>(
      `${this.apiUrl}/eliminar/${id}`,
    );
  }

  public listarComboNombres(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/nombres`,
    );
  }

  public listarComboRutas(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/rutas`,
    );
  }

  public listarComboNiveles(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/niveles`,
    );
  }

  public listarComboPadres(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/padres`,
    );
  }

  public listarComboEstados(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/estados`,
    );
  }

  public listarComboVisible(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/visible`,
    );
  }
}
