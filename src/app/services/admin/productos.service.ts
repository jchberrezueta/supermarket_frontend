import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IProducto, IResultDataProducto } from '@models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'productos';

  public listar(): Observable<IResultDataProducto> {
    return this._restService.get<IResultDataProducto>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataProducto> {
    return this._restService.get<IResultDataProducto>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IProducto) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IProducto) {
    return this._restService.post<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}
