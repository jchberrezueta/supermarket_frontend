import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IMarca, IResultDataMarca } from '@models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'marcas';

  public listar(): Observable<IResultDataMarca> {
    return this._restService.get<IResultDataMarca>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataMarca> {
    return this._restService.get<IResultDataMarca>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IMarca) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IMarca) {
    return this._restService.post<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}
