import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { IEmpresa } from '@models/proveedores';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  private _restService = inject(RestService);

  constructor() { }

  getEmpresaById(id: number) {
    return this._restService.get<IEmpresa>('empresa/');
  }

  /*getEmpresas(): Observable<Empresa> {
    return this._restService.get<Empresa>('empresas');
  }*/

}
