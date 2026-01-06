import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IEmpleado, IResultDataEmpleado } from '@models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
private readonly _restService = inject(RestService);
  private readonly apiUrl = 'empleados';

  public listar(): Observable<IResultDataEmpleado> {
    return this._restService.get<IResultDataEmpleado>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataEmpleado> {
    return this._restService.get<IResultDataEmpleado>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IEmpleado) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IEmpleado) {
    return this._restService.post<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }
}
