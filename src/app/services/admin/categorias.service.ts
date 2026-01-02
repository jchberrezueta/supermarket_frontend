import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { ICategoria } from '@models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
private readonly _restService = inject(RestService);
  private readonly apiUrl = 'categorias';

  public listar(): Observable<IResultData> {
    return this._restService.get<IResultData>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultData> {
    return this._restService.get<IResultData>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: ICategoria) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: ICategoria) {
    return this._restService.post<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}