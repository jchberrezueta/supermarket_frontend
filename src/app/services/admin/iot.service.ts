import { inject, Injectable } from '@angular/core';
import { RestService } from '@core/services/rest.service';
import { Observable } from 'rxjs';

export interface IIotDispositivoResumen {
  ideDisp: number;
  codigoDisp: string | null;
  nombreDisp: string | null;
  ubicacionDisp: string | null;
}

export interface IIotUltimaLectura {
  ideLect: number;
  temperaturaLect: number;
  humedadLect: number;
  fechaLect: string;
}

export interface IIotLimites {
  temperaturaMaxima: number;
  humedadMaxima: number;
}

export interface IIotAlerta {
  ideAler: number;
  ideDisp: number;
  ideLect: number | null;
  tipoAler: string;
  mensajeAler: string;
  estadoAler: string;
  fechaAler: string;
}

export interface IIotResumenBodega {
  estadoAmbiental: 'normal' | 'alerta' | 'critico' | 'sin_datos';
  mensajeEstado: string;
  dispositivo?: IIotDispositivoResumen;
  ultimaLectura: IIotUltimaLectura | null;
  limites: IIotLimites;
  totalAlertasAbiertas: number;
  alertasAbiertas: IIotAlerta[];
}

export interface IIotApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class IotService {
  private readonly _restService = inject(RestService);
  private readonly apiUrl = 'iot';

  getResumenBodega(
    codigoDispositivo = 'ESP32-BODEGA-01',
  ): Observable<IIotApiResponse<IIotResumenBodega>> {
    return this._restService.get<IIotApiResponse<IIotResumenBodega>>(
      `${this.apiUrl}/resumen-bodega?codigoDispositivo=${codigoDispositivo}`,
    );
  }
}
