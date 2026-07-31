import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RestService } from '@core/services/rest.service';
import { environment } from '@envs/environment';
import {
  ISigAccionCorrectivaRequest,
  ISigAlertaIot,
  ISigApiResponse,
  ISigDetalleIncidenteIot,
  ISigEventoAuditoriaIot,
  ISigIncidenteIot,
  ISigLecturaIot,
  ISigListaIot,
  ISigReconocerIncidenteRequest,
  ISigResumenCadenaFrio,
  SigEstadoAlerta,
  SigEstadoIncidente,
} from '@models';

@Injectable({
  providedIn: 'root',
})
export class SigCadenaFrioService {
  private readonly restService = inject(RestService);

  private readonly sigApiUrl = environment.sig_api_url;

  private readonly iotApiUrl = `${this.sigApiUrl}/iot`;

  public obtenerResumen(
    codigoDispositivo = 'ESP32-BODEGA-01',
  ): Observable<ISigApiResponse<ISigResumenCadenaFrio>> {
    const params = new HttpParams().set('codigoDispositivo', codigoDispositivo);

    return this.restService.get<ISigApiResponse<ISigResumenCadenaFrio>>(
      `${this.iotApiUrl}/resumen`,
      {
        params,
      },
    );
  }

  public obtenerLecturas(
    codigoDispositivo = 'ESP32-BODEGA-01',
    limite = 20,
  ): Observable<ISigApiResponse<ISigListaIot<ISigLecturaIot>>> {
    const params = new HttpParams()
      .set('codigoDispositivo', codigoDispositivo)
      .set('limite', limite.toString());

    return this.restService.get<ISigApiResponse<ISigListaIot<ISigLecturaIot>>>(
      `${this.iotApiUrl}/lecturas`,
      {
        params,
      },
    );
  }

  public obtenerAlertas(
    estado?: SigEstadoAlerta,
    limite = 20,
  ): Observable<ISigApiResponse<ISigListaIot<ISigAlertaIot>>> {
    let params = new HttpParams().set('limite', limite.toString());

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.restService.get<ISigApiResponse<ISigListaIot<ISigAlertaIot>>>(
      `${this.iotApiUrl}/alertas`,
      {
        params,
      },
    );
  }

  public obtenerIncidentes(
    estado?: SigEstadoIncidente,
    limite = 20,
  ): Observable<ISigApiResponse<ISigListaIot<ISigIncidenteIot>>> {
    let params = new HttpParams().set('limite', limite.toString());

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.restService.get<
      ISigApiResponse<ISigListaIot<ISigIncidenteIot>>
    >(`${this.iotApiUrl}/incidentes`, {
      params,
    });
  }

  public obtenerDetalleIncidente(
    incidenteId: number,
  ): Observable<ISigApiResponse<ISigDetalleIncidenteIot>> {
    return this.restService.get<ISigApiResponse<ISigDetalleIncidenteIot>>(
      `${this.iotApiUrl}/incidentes/${incidenteId}`,
    );
  }

  public reconocerIncidente(
    incidenteId: number,
    request: ISigReconocerIncidenteRequest,
  ): Observable<ISigApiResponse<ISigDetalleIncidenteIot>> {
    return this.restService.patch<ISigApiResponse<ISigDetalleIncidenteIot>>(
      `${this.iotApiUrl}/incidentes/${incidenteId}/reconocer`,
      request,
    );
  }

  public registrarAccionCorrectiva(
    incidenteId: number,
    request: ISigAccionCorrectivaRequest,
  ): Observable<ISigApiResponse<ISigDetalleIncidenteIot>> {
    return this.restService.post<ISigApiResponse<ISigDetalleIncidenteIot>>(
      `${this.iotApiUrl}/incidentes/${incidenteId}/acciones`,
      request,
    );
  }

  public resolverIncidente(
    incidenteId: number,
  ): Observable<ISigApiResponse<ISigDetalleIncidenteIot>> {
    return this.restService.patch<ISigApiResponse<ISigDetalleIncidenteIot>>(
      `${this.iotApiUrl}/incidentes/${incidenteId}/resolver`,
      {},
    );
  }

  public cerrarIncidente(
    incidenteId: number,
  ): Observable<ISigApiResponse<ISigDetalleIncidenteIot>> {
    return this.restService.patch<ISigApiResponse<ISigDetalleIncidenteIot>>(
      `${this.iotApiUrl}/incidentes/${incidenteId}/cerrar`,
      {},
    );
  }

  public obtenerAuditoria(
    accion?: string,
    limite = 50,
  ): Observable<ISigApiResponse<ISigListaIot<ISigEventoAuditoriaIot>>> {
    let params = new HttpParams().set('limite', limite.toString());

    if (accion?.trim()) {
      params = params.set('accion', accion.trim());
    }

    return this.restService.get<
      ISigApiResponse<ISigListaIot<ISigEventoAuditoriaIot>>
    >(`${this.sigApiUrl}/auditoria`, {
      params,
    });
  }
}
