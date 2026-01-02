import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesosService {
private readonly _restService = inject(RestService);
  private readonly apiUrl = 'accesos';

  public listar(): Observable<IResultData> {
    return this._restService.get<IResultData>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultData> {
    return this._restService.get<IResultData>(`${this.apiUrl}/buscar/${id}`);
  }
}