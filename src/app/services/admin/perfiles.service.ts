import { inject, Injectable } from '@angular/core';

import { IResultData, IResultDataCreate } from '@core/models';

import { RestService } from '@core/services/rest.service';

import {
  ICreatePerfil,
  IGuardarPermisosPerfilRequest,
  IPerfilPermisosResponse,
  IResultDataPerfil,
  IUpdatePerfil,
} from '@models';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PerfilesService {
  private readonly restService = inject(RestService);

  private readonly apiUrl = 'perfiles';

  public listar(): Observable<IResultDataPerfil> {
    return this.restService.get<IResultDataPerfil>(this.apiUrl);
  }

  public buscar(id: number): Observable<IResultDataPerfil> {
    return this.restService.get<IResultDataPerfil>(
      `${this.apiUrl}/buscar/${id}`,
    );
  }

  public insertar(body: ICreatePerfil): Observable<IResultDataCreate> {
    return this.restService.post<IResultDataCreate>(
      `${this.apiUrl}/insertar`,
      body,
    );
  }

  public actualizar(
    id: number,
    body: IUpdatePerfil,
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

  public listarPermisos(id: number): Observable<IPerfilPermisosResponse> {
    return this.restService.get<IPerfilPermisosResponse>(
      `${this.apiUrl}/${id}/permisos`,
    );
  }

  public guardarPermisos(
    id: number,
    body: IGuardarPermisosPerfilRequest,
  ): Observable<IResultDataCreate> {
    return this.restService.put<IResultDataCreate>(
      `${this.apiUrl}/${id}/permisos`,
      body,
    );
  }

  public listarPerfiles(): Observable<IResultData> {
    return this.restService.get<IResultData>(`${this.apiUrl}/listar/perfiles`);
  }

  public listarComboPerfiles(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/perfiles`,
    );
  }

  public listarComboNombres(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/nombres`,
    );
  }

  public listarComboDescripcion(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/descripciones`,
    );
  }

  public listarComboRoles(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/roles`,
    );
  }
}
