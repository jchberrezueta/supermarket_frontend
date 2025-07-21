import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { Empresa } from '@models/proveedores';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private _restService = inject(RestService);

  constructor() { }

  

  getEmpresas(): Observable<Empresa> {
    return this._restService.get<Empresa>('empresas');
  }

}
