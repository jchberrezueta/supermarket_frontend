import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@envs/environment';
import { ISigApiResponse, ISigResumenEjecutivo } from '@models';

import { RestService } from '@core/services/rest.service';

@Injectable({
  providedIn: 'root',
})
export class SigService {
  private readonly restService = inject(RestService);
  private readonly apiUrl = environment.sig_api_url;

  public obtenerResumenEjecutivo(): Observable<
    ISigApiResponse<ISigResumenEjecutivo>
  > {
    return this.restService.get<ISigApiResponse<ISigResumenEjecutivo>>(
      `${this.apiUrl}/resumen-ejecutivo`,
    );
  }
}
