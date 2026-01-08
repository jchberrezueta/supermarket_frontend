import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IEmpleado, IResultDataEmpleado } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
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


  /**
     * COMBOS
     */
    public listarComboEmpleados(): Observable<IComboBoxOption[]> {
      return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/empleados`);
    }
    public listarComboCedulas(): Observable<IComboBoxOption[]> {
      return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/cedulas`);
    }
    public listarComboPrimerNombre(): Observable<IComboBoxOption[]> {
      return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/primer/nombre`);
    }
    public listarComboApellidoPaterno(): Observable<IComboBoxOption[]> {
      return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/apellido/paterno`);
    }
    public listarComboTitulos(): Observable<IComboBoxOption[]> {
      return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/titulos`);
    }
    public listarComboEstados(): Observable<IComboBoxOption[]> {
      return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/combo/estados`);
    }
}
