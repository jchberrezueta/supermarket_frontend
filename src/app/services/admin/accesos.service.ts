import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { IResultDataAccesoUsuario } from '@models';
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
}