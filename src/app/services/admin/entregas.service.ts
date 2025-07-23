import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class EntregasService {

  private _restService = inject(RestService);

  constructor() { }

  

  /*getEmpresas(): Observable<Empresa> {
    return this._restService.get<Empresa>('empresas');
  }*/

}
