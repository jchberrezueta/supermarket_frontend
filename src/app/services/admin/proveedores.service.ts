import { inject, Injectable } from '@angular/core';
import { IResultData } from '@core/models';
import { RestService } from '@core/services/rest.service';
import { IProveedor, IResultDataProveedor } from '@models';
import { IComboBoxOption } from '@shared/models/combo_box_option';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'proveedores';

  public listar(): Observable<IResultDataProveedor> {
    return this._restService.get<IResultDataProveedor>(`${this.apiUrl}`);
  }

  public buscar(id: number): Observable<IResultDataProveedor> {
    return this._restService.get<IResultDataProveedor>(`${this.apiUrl}/buscar/${id}`);
  }

  public insertar(body: IProveedor) {
    return this._restService.post<any>(`${this.apiUrl}/insertar`, body);
  }

  public actualizar(id: number, body: IProveedor) {
    return this._restService.put<any>(`${this.apiUrl}/actualizar/${id}`, body);
  }

  public eliminar(id: number) {
    return this._restService.delete<any>(`${this.apiUrl}/eliminar/${id}`);
  }


  public listarComboCedula(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/proveedores/combo/cedula`);
  }
  public listarComboPrimerNombre(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/proveedores/combo/primer/nombre`);
  }
  public listarComboApellidoPaterno(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/proveedores/combo/apellido/paterno`);
  }
  public listarComboEmail(): Observable<IComboBoxOption[]> {
    return this._restService.get<IComboBoxOption[]>(`${this.apiUrl}/listar/proveedores/combo/email`);
  }
}