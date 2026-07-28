import { inject, Injectable } from '@angular/core';

import { RestService } from '@core/services/rest.service';

import { IResultDataAccesoUsuario } from '@models';

import { IComboBoxOption } from '@shared/models/combo_box_option';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccesosService {
  private readonly restService = inject(RestService);

  private readonly apiUrl = 'accesos';

  public listar(): Observable<IResultDataAccesoUsuario> {
    return this.restService.get<IResultDataAccesoUsuario>(this.apiUrl);
  }

  public buscar(id: number): Observable<IResultDataAccesoUsuario> {
    return this.restService.get<IResultDataAccesoUsuario>(
      `${this.apiUrl}/buscar/${id}`,
    );
  }

  public listarComboIps(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/ips`,
    );
  }

  public listarComboNavegador(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/navegador`,
    );
  }

  public listarComboCuentas(): Observable<IComboBoxOption[]> {
    return this.restService.get<IComboBoxOption[]>(
      `${this.apiUrl}/listar/combo/cuentas`,
    );
  }
}
